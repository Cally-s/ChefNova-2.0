(function (root) {
  "use strict";

  const PRICE_SOURCE_TYPES = Object.freeze({
    CHEF_NOVA_ESTIMATE: "chef-nova-estimate",
    USER_ENTERED: "user-entered",
    STORE_PROFILE: "store-profile"
  });
  const PRICE_BASIS_TYPES = Object.freeze({ PACKAGE: "package", UNIT_RATE: "unit-rate" });
  const PROMOTION_TYPES = Object.freeze({ MULTI_BUY: "multi-buy" });
  const SUPPORTED_PRICE_CURRENCIES = Object.freeze(["CAD"]);
  const PRICE_PROFILE_SCHEMA_VERSION = 1;
  const UNIT_LABELS = { "fl-oz": "fl oz", each: "item", piece: "piece", slice: "slice", clove: "clove" };

  function normalizePriceSourceType(value) {
    if (value === "chef-nova-estimates") return PRICE_SOURCE_TYPES.CHEF_NOVA_ESTIMATE;
    if (value === "saved-profile") return PRICE_SOURCE_TYPES.STORE_PROFILE;
    return Object.values(PRICE_SOURCE_TYPES).includes(value) ? value : PRICE_SOURCE_TYPES.CHEF_NOVA_ESTIMATE;
  }

  function dollarsToCents(value, options = {}) {
    const text = String(value ?? "").trim();
    if (!text || !/^\d+(\.\d{1,2})?$/.test(text)) return { valid: false, cents: null, error: "Enter dollars and cents." };
    const number = Number(text);
    if (!Number.isFinite(number) || (!options.allowZero && number <= 0) || (options.allowZero && number < 0)) {
      return { valid: false, cents: null, error: "Enter an amount greater than $0." };
    }
    return { valid: true, cents: Math.round(number * 100), error: "" };
  }

  function centsToCurrency(cents, currency = "CAD") {
    const value = Number(cents);
    if (!Number.isInteger(value) || value <= 0 || !SUPPORTED_PRICE_CURRENCIES.includes(currency)) return "Price not available";
    return new Intl.NumberFormat("en-CA", { style: "currency", currency }).format(value / 100);
  }

  function unitLabel(unit, quantity = 1) {
    const base = UNIT_LABELS[unit] || String(unit || "").replace(/-/g, " ");
    if (base === "item" && Number(quantity) !== 1) return "items";
    return base;
  }

  function isSaleActive(entry, today = new Date().toISOString().slice(0, 10)) {
    if (!Number.isInteger(entry?.salePriceCents) || entry.salePriceCents <= 0) return false;
    if (entry.saleStartsOn && entry.saleStartsOn > today) return false;
    if (entry.saleEndsOn && entry.saleEndsOn < today) return false;
    return true;
  }

  function getEffectivePriceCents(entry, today) {
    return isSaleActive(entry, today) ? entry.salePriceCents : entry.regularPriceCents;
  }

  function formatPriceEntry(entry, options = {}) {
    if (!entry || !Number.isInteger(entry.regularPriceCents) || entry.regularPriceCents <= 0) return "Price not available";
    const price = centsToCurrency(getEffectivePriceCents(entry, options.today), entry.currency || "CAD");
    const quantity = Number(entry.pricedQuantity);
    const unit = unitLabel(entry.pricedUnit, quantity);
    if (entry.priceBasis === PRICE_BASIS_TYPES.UNIT_RATE && quantity === 1) return `${price}/${unit}`;
    const quantityText = quantity === 1 ? unit : `${quantity} ${unit}`;
    return entry.priceBasis === PRICE_BASIS_TYPES.PACKAGE ? `${price} per ${quantityText} package` : `${price} per ${quantityText}`;
  }

  function validatePriceEntry(entry, context = {}) {
    const errors = [];
    const units = new Set(context.units || []);
    const ingredientIds = new Set(context.ingredientIds || []);
    if (!entry || typeof entry !== "object") return { valid: false, errors: ["Entry is missing."] };
    if (!entry.id) errors.push("Missing entry ID.");
    if (!entry.ingredientId || (ingredientIds.size && !ingredientIds.has(entry.ingredientId))) errors.push("Invalid ingredient reference.");
    if (!Object.values(PRICE_SOURCE_TYPES).includes(entry.sourceType)) errors.push("Invalid source type.");
    if (!Object.values(PRICE_BASIS_TYPES).includes(entry.priceBasis)) errors.push("Invalid price basis.");
    if (!Number.isFinite(Number(entry.pricedQuantity)) || Number(entry.pricedQuantity) <= 0) errors.push("Invalid priced quantity.");
    if (!entry.pricedUnit || (units.size && !units.has(entry.pricedUnit))) errors.push("Invalid unit.");
    if (!Number.isInteger(entry.regularPriceCents) || entry.regularPriceCents <= 0) errors.push("Invalid regular price.");
    if (entry.salePriceCents != null && (!Number.isInteger(entry.salePriceCents) || entry.salePriceCents <= 0 || entry.salePriceCents > entry.regularPriceCents)) errors.push("Invalid sale price.");
    if (entry.promotion != null) {
      const promotion = entry.promotion;
      if (!promotion || typeof promotion !== "object") errors.push("Invalid promotion.");
      else {
        if (promotion.promotionType !== PROMOTION_TYPES.MULTI_BUY) errors.push("Invalid promotion type.");
        if (!Number.isInteger(Number(promotion.purchasePackageCount)) || Number(promotion.purchasePackageCount) <= 0) errors.push("Invalid promotion package count.");
        if (!Number.isInteger(promotion.bundlePriceCents) || promotion.bundlePriceCents <= 0) errors.push("Invalid promotion bundle price.");
        if (promotion.startsOn && !/^\d{4}-\d{2}-\d{2}$/.test(String(promotion.startsOn))) errors.push("Invalid promotion start date.");
        if (promotion.endsOn && !/^\d{4}-\d{2}-\d{2}$/.test(String(promotion.endsOn))) errors.push("Invalid promotion end date.");
        if (promotion.startsOn && promotion.endsOn && promotion.endsOn < promotion.startsOn) errors.push("Invalid promotion date range.");
        if (promotion.maximumBundleCount != null && (!Number.isInteger(Number(promotion.maximumBundleCount)) || Number(promotion.maximumBundleCount) <= 0)) errors.push("Invalid maximum bundle count.");
      }
    }
    if (!SUPPORTED_PRICE_CURRENCIES.includes(entry.currency)) errors.push("Invalid currency.");
    if (!entry.updatedAt) errors.push("Missing updated date.");
    return { valid: !errors.length, errors };
  }

  function validatePriceProfile(profile, context = {}) {
    const entries = Array.isArray(profile?.entries) ? profile.entries : [];
    const entryResults = entries.map((entry) => validatePriceEntry(entry, context));
    const duplicateIds = entries.map((entry) => entry.id).filter((id, index, ids) => id && ids.indexOf(id) !== index);
    return { valid: Boolean(profile?.id && profile?.name && !duplicateIds.length && entryResults.every((result) => result.valid)), duplicateIds, entryResults };
  }

  function choosePreferredEntry(entries) {
    const valid = (Array.isArray(entries) ? entries : []).filter((entry) => Number.isInteger(entry.regularPriceCents) && entry.regularPriceCents > 0);
    const preferred = valid.filter((entry) => entry.isPreferred === true);
    const candidates = preferred.length ? preferred : valid;
    return candidates.sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))[0] || null;
  }

  function getPriceEntriesForIngredient({ ingredientId, profileId, profiles = [] }) {
    const profile = profiles.find((candidate) => candidate.id === profileId);
    return profile ? (profile.entries || []).filter((entry) => entry.ingredientId === ingredientId) : [];
  }

  function resolveIngredientPrice(options = {}) {
    const ingredientId = options.ingredientId;
    const selectedPriceSource = normalizePriceSourceType(options.selectedPriceSource);
    const estimates = options.chefNovaEstimateCatalogue || {};
    const estimateProfiles = Array.isArray(estimates.profiles) ? estimates.profiles : [];
    const estimateProfile = estimateProfiles.find((profile) => profile.isBuiltIn) || estimateProfiles[0] || null;
    const userProfiles = Array.isArray(options.userPriceProfiles) ? options.userPriceProfiles : [];
    const overrides = Array.isArray(options.sessionPriceOverrides) ? options.sessionPriceOverrides : [];
    const fallbackEstimate = choosePreferredEntry(getPriceEntriesForIngredient({ ingredientId, profileId: estimateProfile?.id, profiles: estimateProfiles }));
    let entry = null;
    let sourceProfile = null;
    let usedFallback = false;

    if (selectedPriceSource === PRICE_SOURCE_TYPES.USER_ENTERED) {
      entry = choosePreferredEntry(overrides.filter((candidate) => candidate.ingredientId === ingredientId));
      if (!entry && fallbackEstimate) { entry = fallbackEstimate; sourceProfile = estimateProfile; usedFallback = true; }
    } else if (selectedPriceSource === PRICE_SOURCE_TYPES.STORE_PROFILE) {
      sourceProfile = userProfiles.find((profile) => profile.id === options.selectedProfileId) || null;
      entry = choosePreferredEntry(getPriceEntriesForIngredient({ ingredientId, profileId: sourceProfile?.id, profiles: userProfiles }));
      if (!entry && fallbackEstimate) { entry = fallbackEstimate; sourceProfile = estimateProfile; usedFallback = true; }
    } else {
      entry = fallbackEstimate;
      sourceProfile = estimateProfile;
    }

    if (!entry) return { status: "missing", entry: null, sourceProfile: null, usedFallback: false };
    return { status: "resolved", entry, sourceProfile, usedFallback, formattedPrice: formatPriceEntry(entry), effectivePriceCents: getEffectivePriceCents(entry) };
  }

  function isPromotionActive(promotion, today = new Date().toISOString().slice(0, 10)) {
    if (!promotion || promotion.promotionType !== PROMOTION_TYPES.MULTI_BUY) return false;
    if (promotion.startsOn && promotion.startsOn > today) return false;
    if (promotion.endsOn && promotion.endsOn < today) return false;
    return true;
  }

  root.ChefNovaPriceData = { PRICE_SOURCE_TYPES, PRICE_BASIS_TYPES, PROMOTION_TYPES, SUPPORTED_PRICE_CURRENCIES, PRICE_PROFILE_SCHEMA_VERSION, normalizePriceSourceType, dollarsToCents, centsToCurrency, unitLabel, isSaleActive, isPromotionActive, getEffectivePriceCents, formatPriceEntry, validatePriceEntry, validatePriceProfile, choosePreferredEntry, getPriceEntriesForIngredient, resolveIngredientPrice };
  if (typeof module !== "undefined") module.exports = root.ChefNovaPriceData;
})(typeof window !== "undefined" ? window : globalThis);
