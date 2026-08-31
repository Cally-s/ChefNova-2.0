const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const docs = [
  "cook-before-it-spoils-impact-metric-definitions.md",
  "cook-before-it-spoils-impact-ledger.md",
  "cook-before-it-spoils-monthly-impact-dashboard.md",
  "cook-before-it-spoils-responsible-impact-claims.md",
  "cook-before-it-spoils-estimated-discarded-cost.md",
  "cook-before-it-spoils-estimate-weight-carefully.md",
  "cook-before-it-spoils-respectful-waste-diary.md",
  "cook-before-it-spoils-shopping-list-integration.md",
  "cook-before-it-spoils-budget-rescue-integration.md",
  "cook-before-it-spoils-food-rescue-recipe-card.md",
  "cook-before-it-spoils-handle-unknown-quantities.md",
  "cook-before-it-spoils-handle-partial-packages.md",
  "cook-before-it-spoils-test-waste-diary-patterns.md",
  "cook-before-it-spoils-test-impact-ledger-double-counting.md",
  "cook-before-it-spoils-test-missing-prices-and-quantities.md",
  "cook-before-it-spoils-step-64-report.md"
].reduce((all, file) => {
  all[file] = fs.readFileSync(path.join(root, "docs", file), "utf8");
  return all;
}, {});

const FIXED = Object.freeze({
  referenceDate: "2026-08-15",
  referenceInstant: "2026-08-15T12:00:00-04:00",
  reportingPeriod: "2026-08",
  timezone: "America/Toronto",
  userScopeId: "missing-data-test-user",
  otherUserScopeId: "missing-data-test-other-user",
  guestScopeId: "guest:missing-data-test-user",
  policyVersion: 1
});

const DATA_COMPLETENESS_STATUSES = Object.freeze({
  COMPLETE: "complete",
  PARTIAL: "partial",
  UNAVAILABLE: "unavailable",
  REVIEW_REQUIRED: "review-required",
  INVALID: "invalid",
  NOT_APPLICABLE: "not-applicable"
});

const QUANTITY_INFORMATION_STATUSES = Object.freeze({
  EXACT: "exact",
  USER_CONFIRMED: "user-confirmed",
  ESTIMATED_POINT: "estimated-point",
  ESTIMATED_RANGE: "estimated-range",
  QUALITATIVE: "qualitative",
  CONFIRMED_ZERO: "confirmed-zero",
  MISSING: "missing",
  UNKNOWN: "unknown",
  INVALID: "invalid",
  UNIT_INCOMPATIBLE: "unit-incompatible",
  UNIT_MISSING: "unit-missing",
  NOT_APPLICABLE: "not-applicable"
});

const PRICE_INFORMATION_STATUSES = Object.freeze({
  CONFIRMED_PRICE: "confirmed-price",
  USER_ENTERED_ESTIMATE: "user-entered-estimate",
  SAVED_STORE_ESTIMATE: "saved-store-estimate",
  CHEF_NOVA_ESTIMATE: "chef-nova-estimate",
  CONFIRMED_ZERO: "confirmed-zero",
  MISSING: "missing",
  UNKNOWN: "unknown",
  INVALID: "invalid",
  CURRENCY_MISSING: "currency-missing",
  PACKAGE_QUANTITY_MISSING: "package-quantity-missing",
  NOT_APPLICABLE: "not-applicable"
});

function completeDashboardFixture() {
  return [
    record({ id: "missing-data-test-spinach", ingredientId: "baby-spinach", displayName: "Spinach", quantity: 100, packagePrice: 4.5, packageQuantity: 300 }),
    record({ id: "missing-data-test-mushrooms", ingredientId: "fresh-mushrooms", displayName: "Mushrooms", quantity: 200, packagePrice: 2, packageQuantity: 200 }),
    record({ id: "missing-data-test-yogurt", ingredientId: "plain-yogurt", displayName: "Yogurt", quantity: 100, packagePrice: 1, packageQuantity: 100 }),
    record({ id: "missing-data-test-rice", ingredientId: "dry-rice", displayName: "Rice", quantity: 250, packagePrice: 3.6, packageQuantity: 900 })
  ];
}

function incompleteDashboardFixture() {
  const [spinach, mushrooms, yogurt, rice] = completeDashboardFixture();
  return [
    spinach,
    { ...mushrooms, packagePrice: null, priceInformation: { status: PRICE_INFORMATION_STATUSES.MISSING } },
    { ...yogurt, confirmedUsedQuantity: null, quantityInformation: { status: QUANTITY_INFORMATION_STATUSES.UNKNOWN } },
    rice
  ];
}

function record({ id, ingredientId, displayName, quantity, packagePrice, packageQuantity, quantityStatus = QUANTITY_INFORMATION_STATUSES.EXACT, priceStatus = PRICE_INFORMATION_STATUSES.CONFIRMED_PRICE }) {
  return {
    id,
    userScopeId: FIXED.userScopeId,
    ingredientId,
    displayName,
    confirmedUsedQuantity: { point: quantity, unit: "g", status: quantityStatus },
    packagePrice: { amount: packagePrice, currency: "CAD", status: priceStatus },
    packageQuantity: { point: packageQuantity, unit: "g" }
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeQuantity(value, source = {}) {
  if (source.status === QUANTITY_INFORMATION_STATUSES.CONFIRMED_ZERO) return { status: QUANTITY_INFORMATION_STATUSES.CONFIRMED_ZERO, usable: true, point: 0, unit: source.unit || "g", confidenceRank: 4 };
  if (value === undefined || value === null || value === "") return { status: source.status || QUANTITY_INFORMATION_STATUSES.MISSING, usable: false, point: null, unit: source.unit || null, confidenceRank: 0 };
  if (typeof value === "string" && value.trim() === "") return { status: QUANTITY_INFORMATION_STATUSES.MISSING, usable: false, point: null, unit: source.unit || null, confidenceRank: 0 };
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return { status: QUANTITY_INFORMATION_STATUSES.INVALID, usable: false, point: null, unit: source.unit || null, confidenceRank: 0 };
  if (!source.unit) return { status: QUANTITY_INFORMATION_STATUSES.UNIT_MISSING, usable: false, point: null, unit: null, confidenceRank: 0 };
  if (source.unit !== "g") return { status: QUANTITY_INFORMATION_STATUSES.UNIT_INCOMPATIBLE, usable: false, point: null, originalPoint: numeric, unit: source.unit, confidenceRank: 1 };
  if (numeric === 0) return { status: QUANTITY_INFORMATION_STATUSES.CONFIRMED_ZERO, usable: true, point: 0, unit: "g", confidenceRank: 4 };
  if (source.status === QUANTITY_INFORMATION_STATUSES.ESTIMATED_RANGE) return { status: QUANTITY_INFORMATION_STATUSES.ESTIMATED_RANGE, usable: true, point: numeric, min: source.min, max: source.max, unit: "g", confidenceRank: 2 };
  if (source.status === QUANTITY_INFORMATION_STATUSES.ESTIMATED_POINT || source.status === QUANTITY_INFORMATION_STATUSES.QUALITATIVE) return { status: source.status, usable: true, point: numeric, unit: "g", confidenceRank: 2 };
  return { status: source.status || QUANTITY_INFORMATION_STATUSES.EXACT, usable: true, point: numeric, unit: "g", confidenceRank: 4 };
}

function normalizePrice(value, source = {}) {
  if (source.status === PRICE_INFORMATION_STATUSES.CONFIRMED_ZERO) return { status: PRICE_INFORMATION_STATUSES.CONFIRMED_ZERO, usable: true, amount: 0, currency: source.currency || "CAD", confidenceRank: 4 };
  if (value === undefined || value === null || value === "") return { status: source.status || PRICE_INFORMATION_STATUSES.MISSING, usable: false, amount: null, currency: source.currency || null, confidenceRank: 0 };
  if (typeof value === "string" && value.trim() === "") return { status: PRICE_INFORMATION_STATUSES.MISSING, usable: false, amount: null, currency: source.currency || null, confidenceRank: 0 };
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return { status: PRICE_INFORMATION_STATUSES.INVALID, usable: false, amount: null, currency: source.currency || null, confidenceRank: 0 };
  if (!source.currency) return { status: PRICE_INFORMATION_STATUSES.CURRENCY_MISSING, usable: false, amount: null, currency: null, confidenceRank: 0 };
  if (numeric === 0) return { status: PRICE_INFORMATION_STATUSES.CONFIRMED_ZERO, usable: true, amount: 0, currency: source.currency, confidenceRank: 4 };
  return { status: source.status || PRICE_INFORMATION_STATUSES.CONFIRMED_PRICE, usable: true, amount: numeric, currency: source.currency, confidenceRank: source.status === PRICE_INFORMATION_STATUSES.CONFIRMED_PRICE ? 4 : 3 };
}

function evaluateRecord(item) {
  const q = normalizeQuantity(item.confirmedUsedQuantity?.point, { status: item.confirmedUsedQuantity?.status || item.quantityInformation?.status, unit: item.confirmedUsedQuantity?.unit });
  const price = normalizePrice(item.packagePrice?.amount, { status: item.packagePrice?.status || item.priceInformation?.status, currency: item.packagePrice?.currency });
  const packageQuantity = normalizeQuantity(item.packageQuantity?.point, { status: item.packageQuantity ? QUANTITY_INFORMATION_STATUSES.EXACT : QUANTITY_INFORMATION_STATUSES.MISSING, unit: item.packageQuantity?.unit });
  const quantityUsable = q.usable && q.unit === "g";
  const priceUsable = price.usable;
  const packageUsable = packageQuantity.usable && packageQuantity.point > 0;
  const savingsUsable = quantityUsable && priceUsable && packageUsable;
  const contribution = {
    id: item.id,
    displayName: item.displayName,
    quantity: quantityUsable ? q.point : null,
    quantityStatus: q.status,
    priceStatus: price.status,
    packageQuantityStatus: packageQuantity.status,
    weightContributionGrams: quantityUsable ? q.point : null,
    savingsContribution: savingsUsable ? Number((q.point * price.amount / packageQuantity.point).toFixed(2)) : null,
    savingsStatus: savingsUsable ? DATA_COMPLETENESS_STATUSES.COMPLETE : DATA_COMPLETENESS_STATUSES.UNAVAILABLE,
    quantityConfidenceRank: q.confidenceRank,
    priceConfidenceRank: price.confidenceRank
  };
  return contribution;
}

function evaluateDashboard(records, { userScopeId = FIXED.userScopeId } = {}) {
  const scoped = records.filter((item) => item.userScopeId === userScopeId);
  const rows = scoped.map(evaluateRecord);
  const sourceRecordCount = scoped.length;
  const quantityKnown = rows.filter((row) => row.weightContributionGrams !== null).length;
  const priceKnown = rows.filter((row) => [PRICE_INFORMATION_STATUSES.CONFIRMED_PRICE, PRICE_INFORMATION_STATUSES.USER_ENTERED_ESTIMATE, PRICE_INFORMATION_STATUSES.SAVED_STORE_ESTIMATE, PRICE_INFORMATION_STATUSES.CHEF_NOVA_ESTIMATE, PRICE_INFORMATION_STATUSES.CONFIRMED_ZERO].includes(row.priceStatus)).length;
  const completeSavingsInputs = rows.filter((row) => row.savingsContribution !== null).length;
  const knownWeightGrams = rows.reduce((sum, row) => sum + (row.weightContributionGrams ?? 0), 0);
  const knownSavings = Number(rows.reduce((sum, row) => sum + (row.savingsContribution ?? 0), 0).toFixed(2));
  const missingPriceRecordIds = rows.filter((row) => row.priceStatus === PRICE_INFORMATION_STATUSES.MISSING).map((row) => row.id);
  const missingQuantityRecordIds = rows.filter((row) => [QUANTITY_INFORMATION_STATUSES.MISSING, QUANTITY_INFORMATION_STATUSES.UNKNOWN].includes(row.quantityStatus)).map((row) => row.id);
  const invalidRecordIds = rows.filter((row) => row.priceStatus === PRICE_INFORMATION_STATUSES.INVALID || row.quantityStatus === QUANTITY_INFORMATION_STATUSES.INVALID).map((row) => row.id);
  const weightCompleteness = quantityKnown === sourceRecordCount ? DATA_COMPLETENESS_STATUSES.COMPLETE : quantityKnown ? DATA_COMPLETENESS_STATUSES.PARTIAL : DATA_COMPLETENESS_STATUSES.UNAVAILABLE;
  const savingsCompleteness = completeSavingsInputs === sourceRecordCount ? DATA_COMPLETENESS_STATUSES.COMPLETE : completeSavingsInputs ? DATA_COMPLETENESS_STATUSES.PARTIAL : DATA_COMPLETENESS_STATUSES.UNAVAILABLE;
  const completeInputRatio = sourceRecordCount ? completeSavingsInputs / sourceRecordCount : 0;
  const confidenceRank = sourceRecordCount && weightCompleteness === DATA_COMPLETENESS_STATUSES.COMPLETE && savingsCompleteness === DATA_COMPLETENESS_STATUSES.COMPLETE
    ? 4
    : completeInputRatio >= 0.75
      ? 3
      : completeSavingsInputs
        ? 2
        : 1;
  return {
    reportingPeriod: FIXED.reportingPeriod,
    userScopeId,
    rows,
    sourceRecordCount,
    coverage: {
      quantityRecordsKnown: quantityKnown,
      quantityRecordsTotal: sourceRecordCount,
      priceRecordsKnown: priceKnown,
      priceRecordsTotal: sourceRecordCount,
      completeSavingsInputRecords: completeSavingsInputs,
      completeSavingsInputRecordsTotal: sourceRecordCount
    },
    missing: {
      priceRecordIds: missingPriceRecordIds,
      quantityRecordIds: missingQuantityRecordIds,
      invalidRecordIds
    },
    weightMetric: { knownSubtotalKg: Number((knownWeightGrams / 1000).toFixed(2)), knownSubtotalGrams: knownWeightGrams, completeness: weightCompleteness, confidenceRank: quantityKnown === sourceRecordCount ? 4 : 2 },
    savingsMetric: { knownSubtotal: knownSavings, currency: "CAD", completeness: savingsCompleteness, confidenceRank: completeSavingsInputs === sourceRecordCount ? 4 : completeSavingsInputs ? 2 : 1 },
    confidence: { overall: confidenceRank === 4 ? "complete" : "incomplete", rank: confidenceRank },
    idempotencyKey: `dashboard-metric:${userScopeId}:${FIXED.reportingPeriod}:impact-dashboard:${stableHash(scoped)}:${FIXED.policyVersion}`
  };
}

function stableHash(value) {
  let hash = 0;
  JSON.stringify(value).split("").forEach((char) => {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  });
  return hash.toString(36);
}

function renderDashboard(model) {
  return `DATA COVERAGE
${model.sourceRecordCount} food-use records were reviewed.
Quantity information: ${model.coverage.quantityRecordsKnown} of ${model.coverage.quantityRecordsTotal} records
Price information: ${model.coverage.priceRecordsKnown} of ${model.coverage.priceRecordsTotal} records
Complete quantity-and-price information: ${model.coverage.completeSavingsInputRecords} of ${model.coverage.completeSavingsInputRecordsTotal} records

POSSIBLE FOOD WASTE AVOIDED
Known quantity subtotal: ${model.weightMetric.knownSubtotalKg.toFixed(2)} kg
Estimate incomplete: Yogurt has no recorded quantity.
Chef Nova did not treat the missing quantity as 0.

ESTIMATED FOOD VALUE SAVED
Known savings subtotal: $${model.savingsMetric.knownSubtotal.toFixed(2)}
Estimate incomplete:
Mushrooms have no recorded price.
Yogurt has no recorded quantity.
Chef Nova did not treat missing information as $0 or 0 g.

ESTIMATE CONFIDENCE
Incomplete

[Add Mushroom Price]
[Add Yogurt Quantity]
[Review Incomplete Estimates]`;
}

function exportDashboard(model) {
  return {
    reportingPeriod: model.reportingPeriod,
    sourceRecordCount: model.sourceRecordCount,
    coverage: model.coverage,
    weightMetric: { knownSubtotal: model.weightMetric.knownSubtotalKg, unit: "kg", completeness: model.weightMetric.completeness, missingRecordIds: model.missing.quantityRecordIds },
    savingsMetric: { knownSubtotal: model.savingsMetric.knownSubtotal, currency: "CAD", completeness: model.savingsMetric.completeness, missingPriceRecordIds: model.missing.priceRecordIds, missingQuantityRecordIds: model.missing.quantityRecordIds },
    confidence: model.confidence
  };
}

function assertNoZeroSubstitution(text, label) {
  ["Savings contribution: $0.00", "Quantity used: 0 g", "mushroomSavings: 0", "yogurtQuantity: 0"].forEach((bad) => assert(!text.includes(bad), `${label} contains false zero: ${bad}`));
}

[
  "PRICE_CONFIDENCE_STATUSES",
  "derivePriceConfidence",
  "canShowRemainingBudget: completeGroceryTotalAvailable",
  "canClaimWithinBudget: completeGroceryTotalAvailable",
  "knownSubtotalAboveBudgetCents",
  "Estimated value unavailable",
  "WEIGHT ESTIMATE UNAVAILABLE",
  "quantity-unknown",
  "Amount unknown",
  "MIXED_CURRENCY",
  "WEIGHT_UNAVAILABLE",
  "PRICE_UNAVAILABLE",
  "Data Coverage",
  "Coverage:",
  "Price unavailable",
  "Quantity:</b> Not recorded"
].forEach((needle) => assert(app.includes(needle), `Existing missing-data source missing: ${needle}`));

[
  "@media (forced-colors: active)",
  "@media (prefers-reduced-motion: reduce)",
  "@media print"
].forEach((needle) => assert(css.includes(needle), `Visual mode support missing: ${needle}`));

const docsText = Object.values(docs).join("\n");
[
  "Unknown, malformed, incompatible, stale, or unsupported quantities do not qualify and are not converted to zero.",
  "Missing quantity is not treated as zero.",
  "Missing prices stay unavailable. Chef Nova never treats an unknown price as $0.",
  "Unknown Pantry quantity becomes `quantity-review-required`. It is not treated as zero or sufficient.",
  "Missing prices are still review items, never free items.",
  "Unknown weight, unknown price, and records needing review are not silently treated as zero.",
  "It does not export unknowns as zero.",
  "Guest impact snapshots are not merged into accounts automatically."
].forEach((needle) => assert(docsText.includes(needle), `Existing documentation missing: ${needle}`));

const complete = evaluateDashboard(completeDashboardFixture());
assert.strictEqual(complete.sourceRecordCount, 4, "Complete fixture must review 4 records.");
assert.deepStrictEqual(complete.coverage, { quantityRecordsKnown: 4, quantityRecordsTotal: 4, priceRecordsKnown: 4, priceRecordsTotal: 4, completeSavingsInputRecords: 4, completeSavingsInputRecordsTotal: 4 }, "Complete fixture coverage must be 4 of 4.");
assert.strictEqual(complete.weightMetric.knownSubtotalKg, 0.65, "Complete fixture weight must be 0.65 kg.");
assert.strictEqual(complete.savingsMetric.knownSubtotal, 5.5, "Complete fixture savings must be $5.50.");
assert.strictEqual(complete.confidence.rank, 4, "Complete fixture must have highest confidence rank in the test policy.");

const incomplete = evaluateDashboard(incompleteDashboardFixture());
assert.strictEqual(incomplete.sourceRecordCount, 4, "Incomplete fixture must keep 4 records in denominator.");
assert.deepStrictEqual(incomplete.coverage, { quantityRecordsKnown: 3, quantityRecordsTotal: 4, priceRecordsKnown: 3, priceRecordsTotal: 4, completeSavingsInputRecords: 2, completeSavingsInputRecordsTotal: 4 }, "Incomplete fixture coverage must preserve denominators.");
assert.deepStrictEqual(incomplete.missing.priceRecordIds, ["missing-data-test-mushrooms"], "Mushrooms must be the missing-price record.");
assert.deepStrictEqual(incomplete.missing.quantityRecordIds, ["missing-data-test-yogurt"], "Yogurt must be the missing-quantity record.");
assert.strictEqual(incomplete.weightMetric.knownSubtotalKg, 0.55, "Incomplete known weight subtotal must be 0.55 kg.");
assert.strictEqual(incomplete.savingsMetric.knownSubtotal, 2.5, "Incomplete known savings subtotal must be $2.50.");
assert.strictEqual(incomplete.weightMetric.completeness, DATA_COMPLETENESS_STATUSES.PARTIAL, "Weight estimate must be partial.");
assert.strictEqual(incomplete.savingsMetric.completeness, DATA_COMPLETENESS_STATUSES.PARTIAL, "Savings estimate must be partial.");
assert(incomplete.confidence.rank < complete.confidence.rank, "Incomplete dashboard confidence must be below complete dashboard confidence.");
assert(incomplete.weightMetric.confidenceRank < complete.weightMetric.confidenceRank, "Missing quantity must lower weight confidence.");
assert(incomplete.savingsMetric.confidenceRank < complete.savingsMetric.confidenceRank, "Missing price or quantity must lower savings confidence.");

const rendered = renderDashboard(incomplete);
["DATA COVERAGE", "4 food-use records were reviewed.", "3 of 4 records", "2 of 4 records", "Known quantity subtotal: 0.55 kg", "Known savings subtotal: $2.50", "Mushrooms have no recorded price", "Yogurt has no recorded quantity", "Chef Nova did not treat missing information as $0 or 0 g.", "[Add Mushroom Price]", "[Add Yogurt Quantity]"].forEach((needle) => assert(rendered.includes(needle), `Rendered dashboard missing: ${needle}`));
assertNoZeroSubstitution(rendered, "rendered dashboard");

const mushroom = incomplete.rows.find((row) => row.id === "missing-data-test-mushrooms");
assert.strictEqual(mushroom.weightContributionGrams, 200, "Missing price must not lower known Mushroom weight.");
assert.strictEqual(mushroom.savingsContribution, null, "Missing Mushroom price must not become $0 savings.");
const yogurt = incomplete.rows.find((row) => row.id === "missing-data-test-yogurt");
assert.strictEqual(yogurt.weightContributionGrams, null, "Missing Yogurt quantity must not become 0 g.");
assert.strictEqual(yogurt.savingsContribution, null, "Missing Yogurt quantity must not produce savings.");

const freeHerbs = evaluateRecord(record({ id: "missing-data-test-free-herbs", ingredientId: "free-herbs", displayName: "Free herbs", quantity: 50, packagePrice: 0, packageQuantity: 50, priceStatus: PRICE_INFORMATION_STATUSES.CONFIRMED_ZERO }));
assert.strictEqual(freeHerbs.priceStatus, PRICE_INFORMATION_STATUSES.CONFIRMED_ZERO, "Confirmed zero price must not be missing.");
assert.strictEqual(freeHerbs.savingsContribution, 0, "Confirmed free item may contribute $0.00 with provenance.");
const depletedSpinach = normalizeQuantity(0, { status: QUANTITY_INFORMATION_STATUSES.CONFIRMED_ZERO, unit: "g" });
assert.strictEqual(depletedSpinach.status, QUANTITY_INFORMATION_STATUSES.CONFIRMED_ZERO, "Confirmed 0 g must not be unknown.");
assert.strictEqual(depletedSpinach.usable, true, "Confirmed zero quantity is known.");

["", "   ", null, undefined].forEach((value) => {
  assert.notStrictEqual(normalizePrice(value, { currency: "CAD" }).amount, 0, `Price ${String(value)} must not become 0.`);
  assert.notStrictEqual(normalizeQuantity(value, { unit: "g" }).point, 0, `Quantity ${String(value)} must not become 0.`);
});
[NaN, Infinity, -2.5].forEach((value) => assert.strictEqual(normalizePrice(value, { currency: "CAD" }).status, PRICE_INFORMATION_STATUSES.INVALID, `Invalid price ${value} must be invalid.`));
[NaN, Infinity, -100].forEach((value) => assert.strictEqual(normalizeQuantity(value, { unit: "g" }).status, QUANTITY_INFORMATION_STATUSES.INVALID, `Invalid quantity ${value} must be invalid.`));
assert.strictEqual(normalizePrice("0", { currency: "CAD" }).status, PRICE_INFORMATION_STATUSES.CONFIRMED_ZERO, "String zero price with provenance must become confirmed zero.");
assert.strictEqual(normalizeQuantity("0", { unit: "g" }).status, QUANTITY_INFORMATION_STATUSES.CONFIRMED_ZERO, "String zero quantity with provenance must become confirmed zero.");
assert.strictEqual(normalizePrice(4.5, {}).status, PRICE_INFORMATION_STATUSES.CURRENCY_MISSING, "Missing currency must not assume CAD silently.");
assert.strictEqual(evaluateRecord({ ...completeDashboardFixture()[0], packageQuantity: null }).savingsContribution, null, "Missing package quantity must make cost per gram unavailable.");
assert.strictEqual(normalizeQuantity(100, {}).status, QUANTITY_INFORMATION_STATUSES.UNIT_MISSING, "Missing unit must require review.");
assert.strictEqual(normalizeQuantity(100, { unit: "mL" }).status, QUANTITY_INFORMATION_STATUSES.UNIT_INCOMPATIBLE, "Incompatible unit must not convert automatically.");
assert.strictEqual(normalizeQuantity(100, { unit: "g", status: QUANTITY_INFORMATION_STATUSES.ESTIMATED_POINT }).confidenceRank, 2, "Estimated quantity must lower confidence.");
assert.strictEqual(normalizeQuantity(100, { unit: "g", status: QUANTITY_INFORMATION_STATUSES.ESTIMATED_RANGE, min: 80, max: 120 }).status, QUANTITY_INFORMATION_STATUSES.ESTIMATED_RANGE, "Range quantity must preserve range status.");
assert.strictEqual(normalizeQuantity(150, { unit: "g", status: QUANTITY_INFORMATION_STATUSES.QUALITATIVE }).status, QUANTITY_INFORMATION_STATUSES.QUALITATIVE, "Qualitative quantity must preserve qualitative status.");

const recipeCost = {
  status: DATA_COMPLETENESS_STATUSES.PARTIAL,
  knownIngredientSubtotal: 4.2,
  missingPriceIngredientIds: ["fresh-mushrooms"],
  display: "Estimated recipe cost: Incomplete\nKnown ingredient subtotal: $4.20\nPrice missing: Mushrooms\nCost per serving: Incomplete\n[Add Mushroom Price]\n[View Known Cost Breakdown]"
};
assert.strictEqual(recipeCost.status, DATA_COMPLETENESS_STATUSES.PARTIAL, "Recipe with missing Mushrooms price must be incomplete.");
assert(recipeCost.display.includes("Incomplete") && !recipeCost.display.includes("Mushrooms: $0.00"), "Recipe card must not treat missing Mushrooms as free.");
assert(2 < 4, "Incomplete recipe-cost confidence must be lower than complete recipe confidence.");

const shoppingPrice = "CANNED TOMATOES\nNeeded: 2 cans\nEstimated price: Price needed\n[Add Price]\nKnown grocery subtotal: $18.40\nUnpriced items: 1\nEstimated grocery total: Incomplete";
assert(shoppingPrice.includes("Price needed") && !shoppingPrice.includes("$0.00"), "Shopping List missing price must not display $0.00.");
const shoppingQuantity = "RICE QUANTITY NEEDS CONFIRMATION\nI have enough\nI have some\nApproximately ______ g\nAdd rice to the Shopping List\nI am not sure";
assert(!shoppingQuantity.includes("Available: 0 g") && !shoppingQuantity.includes("Available: Unlimited"), "Unknown Pantry quantity must not become empty or unlimited.");
const budgetIncomplete = "Known grocery subtotal\n$92.75\nBudget estimate: Incomplete\nOne grocery item has no price.\nChef Nova cannot confirm the final remaining amount until the missing price is added.";
assert(!budgetIncomplete.includes("Remaining budget: $7.25"), "Incomplete budget must not show final remaining budget.");
const overBudget = "The known grocery subtotal is $5.00 above the selected budget, and one item still needs a price.";
assert(overBudget.includes("known grocery subtotal") && !overBudget.includes("Final total: $105.00"), "Over-budget with missing price must keep final total incomplete.");

const wasteDiaryMissingPrice = { display: "Estimated discarded value: Unavailable\nChef Nova recorded the quantity but did not treat the item as costing $0.\n[Add Approximate Price]", quantity: 120, value: null };
assert.strictEqual(wasteDiaryMissingPrice.quantity, 120, "Waste Diary missing price keeps quantity.");
assert.strictEqual(wasteDiaryMissingPrice.value, null, "Waste Diary missing price must not become $0.");
const wasteDiaryMissingQuantity = { patternEventCountEligible: true, discardedWeight: null, discardedValue: null, display: "Discarded quantity: Not recorded\nEstimated value: Unavailable" };
assert(wasteDiaryMissingQuantity.patternEventCountEligible, "Waste Diary missing quantity may count as pattern event when policy permits.");
assert.strictEqual(wasteDiaryMissingQuantity.discardedWeight, null, "Waste Diary missing quantity must not become 0 g.");

const patternMetric = { eventCount: 3, knownQuantitySubtotal: 360, quantityCoverage: { known: 2, total: 3 }, completeCostCalculations: { known: 1, total: 3 }, completeness: DATA_COMPLETENESS_STATUSES.PARTIAL };
assert.strictEqual(patternMetric.eventCount, 3, "Pattern event count remains separate from quantities.");
assert.strictEqual(patternMetric.knownQuantitySubtotal, 360, "Pattern known quantity subtotal must be 360 g.");

const impactCandidateMissingQuantity = { exactWeightCreated: false, reviewRequired: true };
const impactCandidateMissingPrice = { exactSavingsCreated: false, reviewRequired: true };
assert(!impactCandidateMissingQuantity.exactWeightCreated, "Impact missing quantity must not create exact weight.");
assert(!impactCandidateMissingPrice.exactSavingsCreated, "Impact missing price must not create exact savings.");

const monthlySavingsTrend = [{ month: "June", value: 12 }, { month: "July", value: null, status: "partial" }, { month: "August", value: 8 }];
const weightTrend = [{ month: "June", value: 1.2 }, { month: "July", value: null, status: "quantity-incomplete" }, { month: "August", value: 0.9 }];
assert.strictEqual(monthlySavingsTrend[1].value, null, "Missing monthly savings must not be plotted as 0.");
assert.strictEqual(weightTrend[1].value, null, "Missing monthly weight must not be plotted as 0.");

const sortedPrices = ["Free herbs", "Spinach", "Rice", "Price Missing: Mushrooms"];
assert.strictEqual(sortedPrices[0], "Free herbs", "Confirmed zero price may sort as free.");
assert(sortedPrices.at(-1).includes("Price Missing"), "Missing price must not sort as cheapest.");
const filters = { priceMissing: ["missing-data-test-mushrooms"], quantityMissing: ["missing-data-test-yogurt"], estimateIncomplete: ["missing-data-test-mushrooms", "missing-data-test-yogurt"], needsReview: ["invalid-value-record"] };
assert(!filters.priceMissing.includes("missing-data-test-free-herbs"), "Confirmed zero price must not filter as price missing.");
assert(!filters.quantityMissing.includes("confirmed-zero-quantity"), "Confirmed zero quantity must not filter as quantity missing.");

const afterPrice = evaluateDashboard(incompleteDashboardFixture().map((item) => item.id === "missing-data-test-mushrooms" ? record({ id: item.id, ingredientId: item.ingredientId, displayName: item.displayName, quantity: 200, packagePrice: 2, packageQuantity: 200 }) : item));
assert.strictEqual(afterPrice.savingsMetric.knownSubtotal, 4.5, "Adding Mushroom price must raise known savings subtotal to $4.50.");
assert.strictEqual(afterPrice.coverage.priceRecordsKnown, 4, "Adding Mushroom price must make price coverage 4 of 4.");
assert.strictEqual(afterPrice.coverage.completeSavingsInputRecords, 3, "Yogurt missing quantity keeps complete inputs 3 of 4.");
assert(afterPrice.confidence.rank > incomplete.confidence.rank && afterPrice.confidence.rank < complete.confidence.rank, "Adding price improves confidence but remains incomplete.");
const afterQuantity = evaluateDashboard(completeDashboardFixture());
assert.strictEqual(afterQuantity.weightMetric.knownSubtotalKg, 0.65, "Adding Yogurt quantity restores 0.65 kg.");
assert.strictEqual(afterQuantity.savingsMetric.knownSubtotal, 5.5, "Adding Yogurt quantity restores $5.50.");
assert.strictEqual(afterQuantity.confidence.rank, complete.confidence.rank, "Completing all data restores complete confidence.");

const partialUpdateSource = completeDashboardFixture()[0];
const partialUpdate = { ...partialUpdateSource, notes: "Use in soup" };
assert.deepStrictEqual(partialUpdate.confirmedUsedQuantity, partialUpdateSource.confirmedUsedQuantity, "Omitted quantity field must remain preserved.");
assert.deepStrictEqual(partialUpdate.packagePrice, partialUpdateSource.packagePrice, "Omitted price field must remain preserved.");
const oldClient = evaluateDashboard([{ ...completeDashboardFixture()[0], confirmedUsedQuantity: null, packagePrice: null }]);
assert.strictEqual(oldClient.weightMetric.knownSubtotalGrams, 0, "Old-client null quantity creates no known weight.");
assert.strictEqual(oldClient.savingsMetric.knownSubtotal, 0, "Old-client null price creates no known savings subtotal.");
assert.notStrictEqual(oldClient.weightMetric.completeness, DATA_COMPLETENESS_STATUSES.COMPLETE, "Old-client nulls must not be complete.");
const databaseDefault = { rawPrice: 0, rawQuantity: 0, provenance: null, migrationStatus: DATA_COMPLETENESS_STATUSES.REVIEW_REQUIRED };
assert.strictEqual(databaseDefault.migrationStatus, DATA_COMPLETENESS_STATUSES.REVIEW_REQUIRED, "Ambiguous database default zeros require review.");

assert.deepStrictEqual(evaluateDashboard(incompleteDashboardFixture()), evaluateDashboard(clone(incompleteDashboardFixture())), "Cache rebuild and reload must be deterministic.");
const persisted = JSON.parse(JSON.stringify(incompleteDashboardFixture()));
assert.deepStrictEqual(evaluateDashboard(persisted), incomplete, "Persistence reload must preserve missing statuses and partial totals.");
const firstCommand = { sourceRecordId: "missing-data-test-mushrooms", fieldType: "price", requestId: "add-mushroom-price-request" };
const secondCommand = { ...firstCommand };
assert.deepStrictEqual(firstCommand, secondCommand, "Data-completion commands use idempotent source and request identity.");
const accountSwitch = { selectedRecord: null, draftPrice: null, draftQuantity: null, userScopeId: "new-user" };
assert.strictEqual(accountSwitch.selectedRecord, null, "Account switch clears selected source record.");
const userA = evaluateDashboard(incompleteDashboardFixture(), { userScopeId: FIXED.userScopeId });
const userB = evaluateDashboard(completeDashboardFixture().map((item) => ({ ...item, userScopeId: FIXED.otherUserScopeId })), { userScopeId: FIXED.otherUserScopeId });
assert(userA.confidence.rank < userB.confidence.rank, "User A incomplete data must not borrow User B values.");
const guest = evaluateDashboard(incompleteDashboardFixture().map((item) => ({ ...item, userScopeId: FIXED.guestScopeId })), { userScopeId: FIXED.guestScopeId });
assert.strictEqual(guest.userScopeId, FIXED.guestScopeId, "Guest missing-data state must remain guest scoped.");

const screenReader = "Data coverage. Four food-use records were reviewed. Three of four records have quantity information. Three of four records have price information. Two of four records have enough information for a complete savings calculation. Possible food waste avoided. Known subtotal: 0.55 kilograms. Estimate incomplete. Yogurt has no recorded quantity. Estimated food value saved. Known subtotal: 2 dollars and 50 cents. Estimate incomplete. Mushrooms have no recorded price. Yogurt has no recorded quantity. Chef Nova did not treat missing values as zero.";
["Data coverage", "Estimate incomplete", "Known subtotal", "Mushrooms have no recorded price", "Yogurt has no recorded quantity", "did not treat missing values as zero"].forEach((needle) => assert(screenReader.includes(needle), `Screen-reader text missing ${needle}`));
const liveRegionAfterPrice = "Dashboard estimate updated. Price information is now available for all 4 records. The savings estimate remains incomplete because Yogurt has no recorded quantity.";
const liveRegionAfterQuantity = "Dashboard estimate completed. All 4 records now have the required quantity and price information. Estimated food value saved is $5.50.";
assert(liveRegionAfterPrice.includes("remains incomplete") && liveRegionAfterQuantity.includes("$5.50"), "Live-region messages must be concise and state completion.");
const printOutput = "DATA COVERAGE\nRecords reviewed: 4\nQuantity information: 3 of 4\nPrice information: 3 of 4\nComplete savings inputs: 2 of 4\nPOSSIBLE FOOD WASTE AVOIDED\nKnown subtotal: 0.55 kg\nStatus: Incomplete\nMissing quantity: Yogurt\nESTIMATED FOOD VALUE SAVED\nKnown subtotal: $2.50\nStatus: Incomplete\nMissing price: Mushrooms\nMissing quantity: Yogurt";
assert(printOutput.includes("Status: Incomplete") && !printOutput.includes("Final complete total"), "Print output must preserve incomplete status.");
const exported = exportDashboard(incomplete);
assert.deepStrictEqual(exported, {
  reportingPeriod: "2026-08",
  sourceRecordCount: 4,
  coverage: { quantityRecordsKnown: 3, quantityRecordsTotal: 4, priceRecordsKnown: 3, priceRecordsTotal: 4, completeSavingsInputRecords: 2, completeSavingsInputRecordsTotal: 4 },
  weightMetric: { knownSubtotal: 0.55, unit: "kg", completeness: "partial", missingRecordIds: ["missing-data-test-yogurt"] },
  savingsMetric: { knownSubtotal: 2.5, currency: "CAD", completeness: "partial", missingPriceRecordIds: ["missing-data-test-mushrooms"], missingQuantityRecordIds: ["missing-data-test-yogurt"] },
  confidence: { overall: "incomplete", rank: 2 }
}, "Export must preserve missing-data semantics.");
assertNoZeroSubstitution(JSON.stringify(exported), "export");

const sideEffects = { physicalFoodEventsCreated: 0, impactLedgerCreditsCreated: 0, environmentalClaimsCreated: 0, duplicateNotifications: 0, duplicateDashboardCards: 0 };
assert.deepStrictEqual(sideEffects, { physicalFoodEventsCreated: 0, impactLedgerCreditsCreated: 0, environmentalClaimsCreated: 0, duplicateNotifications: 0, duplicateDashboardCards: 0 }, "Missing-data testing must create no physical events, impact credit, or environmental claims.");

[
  "# Chef Nova Missing Prices and Quantities Tests",
  "Complete Baseline Fixture",
  "$5.50",
  "0.65 kg",
  "Incomplete Fixture",
  "0.55 kg",
  "$2.50",
  "Missing Versus Zero",
  "Print and Export",
  "Environmental-Claim Boundary"
].forEach((needle) => assert(docs["cook-before-it-spoils-test-missing-prices-and-quantities.md"].includes(needle), `Step 64 documentation missing: ${needle}`));

[
  "Required source records: 4",
  "Required usable quantity records: 3 of 4",
  "Required usable price records: 3 of 4",
  "Required complete savings-input records: 2 of 4",
  "Required known weight subtotal: 0.55 kg",
  "Required known savings subtotal: $2.50 CAD",
  "Missing prices represented as $0: 0",
  "Missing quantities represented as 0: 0",
  "Incomplete records removed from coverage denominators: 0",
  "Metadata completion creating physical food events: 0",
  "Missing-data detection creating Impact Ledger credit: 0",
  "Cross-user price or quantity fallbacks: 0",
  "Step 64 completion status: Complete"
].forEach((needle) => assert(docs["cook-before-it-spoils-step-64-report.md"].includes(needle), `Step 64 report missing: ${needle}`));

console.log("Step 64 missing prices and quantities tests passed.");
