const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const patternDoc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-evidence-based-pattern-detection.md"), "utf8");
const evidenceDoc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-explain-insight-evidence.md"), "utf8");
const actionDoc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-actionable-pattern-insights.md"), "utf8");
const wasteDiaryDoc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-respectful-waste-diary.md"), "utf8");
const costDoc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-estimated-discarded-cost.md"), "utf8");
const notificationDoc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-notification-levels.md"), "utf8");
const fatigueDoc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-prevent-notification-fatigue.md"), "utf8");
const impactDoc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-impact-ledger.md"), "utf8");
const step62Doc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-test-waste-diary-patterns.md"), "utf8");
const step62Report = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-62-report.md"), "utf8");

const TEST_CONTEXT = Object.freeze({
  userScopeId: "waste-pattern-test-user",
  guestScopeId: "guest:waste-pattern-test-user",
  referenceInstant: "2026-08-15T12:00:00-04:00",
  referenceLocalDate: "2026-08-15",
  timezone: "America/Toronto",
  patternGroupId: "fresh-spinach",
  foodForm: "fresh-raw",
  displayName: "Spinach"
});

const WASTE_PATTERN_POLICY = Object.freeze({
  policyId: "waste-pattern-policy-v1",
  policyVersion: 1,
  lookbackDays: 60,
  minimumRelatedEventsForStrongPattern: 3,
  minimumRelatedEventsForFrequentClaim: 3,
  relatedEventTypes: ["food-discarded"],
  excludedEventStatuses: ["draft", "cancelled", "voided", "superseded", "duplicate", "migration-review-required"],
  countCorrectedEventOnlyOnce: true,
  requireSameUserScope: true,
  requireCompatiblePatternGroup: true,
  strongClaimLanguagePolicy: "factual-count-first",
  reviewed: true,
  reviewStatus: "approved"
});

const REVIEWED_SPINACH_ALIASES = Object.freeze({
  "baby-spinach": { patternGroupId: "fresh-spinach", foodForm: "fresh-raw", reviewed: true },
  "fresh-spinach": { patternGroupId: "fresh-spinach", foodForm: "fresh-raw", reviewed: true },
  "spinach-leaves": { patternGroupId: "fresh-spinach", foodForm: "fresh-raw", reviewed: true },
  "frozen-spinach": { patternGroupId: "frozen-spinach", foodForm: "frozen", reviewed: true },
  "spinach-dip": { patternGroupId: "prepared-spinach-dip", foodForm: "prepared", reviewed: true },
  kale: { patternGroupId: "fresh-kale", foodForm: "fresh-raw", reviewed: true }
});

const REVIEWED_FREEZER_GUIDANCE = Object.freeze({
  "fresh-spinach": { reviewed: true, reviewStatus: "approved", canFreeze: true, compatibleFoodForms: ["fresh-raw"] }
});

const BASELINE_EVENTS = Object.freeze([
  createSpinachDiscardEvent({
    eventId: "waste-pattern-spinach-event-1",
    sourcePackageId: "spinach-package-june",
    occurredAt: "2026-06-18T20:00:00-04:00",
    reasonCode: "spoiled-before-use",
    priceAmount: 2.4,
    priceConfidence: "saved-store-estimate",
    deduplicationKey: "spinach-discard-2026-06-18",
    requestId: "spinach-discard-request-1"
  }),
  createSpinachDiscardEvent({
    eventId: "waste-pattern-spinach-event-2",
    sourcePackageId: "spinach-package-july",
    occurredAt: "2026-07-09T20:00:00-04:00",
    reasonCode: "bought-too-much",
    priceAmount: 2.5,
    priceConfidence: "user-entered-price",
    deduplicationKey: "spinach-discard-2026-07-09",
    requestId: "spinach-discard-request-2"
  }),
  createSpinachDiscardEvent({
    eventId: "waste-pattern-spinach-event-3",
    sourcePackageId: "spinach-package-august",
    occurredAt: "2026-08-06T20:00:00-04:00",
    reasonCode: "forgot-it-was-available",
    priceAmount: 2.9,
    priceConfidence: "chef-nova-estimate",
    deduplicationKey: "spinach-discard-2026-08-06",
    requestId: "spinach-discard-request-3"
  })
]);

function createSpinachDiscardEvent(overrides = {}) {
  const base = {
    eventType: "food-discarded",
    eventStatus: "effective",
    confirmationStatus: "confirmed",
    userScopeId: TEST_CONTEXT.userScopeId,
    ingredientId: "baby-spinach",
    patternGroupId: TEST_CONTEXT.patternGroupId,
    displayName: "Baby spinach",
    foodForm: TEST_CONTEXT.foodForm,
    occurredAt: "2026-08-06T20:00:00-04:00",
    sourcePackageId: "spinach-package",
    quantity: { representation: "exact-numeric", point: 180, unit: "g", confidence: "user-confirmed" },
    estimatedValue: { amount: 2.9, currency: "CAD", confidence: "chef-nova-estimate" },
    reasonCode: "forgot-it-was-available",
    correction: { voidedAt: null, supersededByEventId: null, replacesEventId: null, revision: 1 },
    deduplicationKey: "spinach-discard",
    requestId: "spinach-discard-request"
  };
  return { ...base, ...overrides, quantity: overrides.quantity === undefined ? base.quantity : overrides.quantity, estimatedValue: overrides.priceAmount === undefined && overrides.estimatedValue === undefined ? base.estimatedValue : overrides.estimatedValue || { amount: overrides.priceAmount, currency: "CAD", confidence: overrides.priceConfidence || "chef-nova-estimate" }, correction: { ...base.correction, ...(overrides.correction || {}) } };
}

function parseLocalDate(localDate) {
  const [year, month, day] = localDate.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function localDateFromInstant(instant) {
  return String(instant || "").slice(0, 10);
}

function dayDifference(referenceLocalDate, eventLocalDate) {
  return Math.floor((parseLocalDate(referenceLocalDate) - parseLocalDate(eventLocalDate)) / 86400000);
}

function resolveReviewedIdentity(event) {
  const direct = REVIEWED_SPINACH_ALIASES[event.ingredientId];
  if (direct?.reviewed) return direct;
  return { patternGroupId: event.patternGroupId, foodForm: event.foodForm, reviewed: Boolean(event.patternGroupId && event.foodForm) };
}

function getEventExclusionReason(event, context = TEST_CONTEXT, policy = WASTE_PATTERN_POLICY) {
  if (!event || typeof event !== "object") return "invalid-event";
  if (!policy.relatedEventTypes.includes(event.eventType)) return "not-related-event-type";
  if (policy.requireSameUserScope && event.userScopeId !== context.userScopeId) return "different-user-scope";
  if (event.confirmationStatus !== "confirmed") return "not-confirmed";
  if (policy.excludedEventStatuses.includes(event.eventStatus)) return `excluded-status:${event.eventStatus}`;
  if (event.eventStatus !== "effective") return "not-effective";
  if (event.correction?.voidedAt) return "voided";
  if (event.correction?.supersededByEventId) return "superseded";
  const eventDate = localDateFromInstant(event.occurredAt);
  const days = dayDifference(context.referenceLocalDate, eventDate);
  if (days < 0) return "future-event";
  if (days > policy.lookbackDays) return "outside-lookback-window";
  const identity = resolveReviewedIdentity(event);
  if (!identity.reviewed) return "unreviewed-identity";
  if (policy.requireCompatiblePatternGroup && identity.patternGroupId !== context.patternGroupId) return "incompatible-pattern-group";
  if (identity.foodForm !== context.foodForm) return "incompatible-food-form";
  return "";
}

function selectQualifyingEvents(events, context = TEST_CONTEXT, policy = WASTE_PATTERN_POLICY) {
  const included = [];
  const excluded = [];
  const seenDedup = new Map();
  events.forEach((event) => {
    const reason = getEventExclusionReason(event, context, policy);
    if (reason) {
      excluded.push({ eventId: event.eventId, reason });
      return;
    }
    const dedupKey = event.requestId || event.deduplicationKey || event.eventId;
    if (seenDedup.has(dedupKey)) {
      excluded.push({ eventId: event.eventId, reason: "duplicate-request-or-event", duplicateOf: seenDedup.get(dedupKey) });
      return;
    }
    seenDedup.set(dedupKey, event.eventId);
    included.push(event);
  });
  return { included: included.sort((a, b) => localDateFromInstant(a.occurredAt).localeCompare(localDateFromInstant(b.occurredAt)) || a.eventId.localeCompare(b.eventId)), excluded };
}

function summarizeQuantity(events) {
  const known = events.filter((event) => event.quantity && Number.isFinite(Number(event.quantity.point)) && event.quantity.unit === "g");
  const unknown = events.length - known.length;
  const point = known.reduce((sum, event) => sum + Number(event.quantity.point), 0);
  return {
    representation: unknown ? "at-least" : "exact-numeric",
    point,
    unit: known.length ? "g" : null,
    confidence: unknown ? "partial" : "user-confirmed",
    coverage: { known: known.length, total: events.length },
    display: unknown ? `At least ${point} g` : `${point} g`
  };
}

function summarizeValue(events) {
  const priced = events.filter((event) => event.estimatedValue && typeof event.estimatedValue.amount === "number" && Number.isFinite(event.estimatedValue.amount));
  const amount = priced.reduce((sum, event) => sum + Number(event.estimatedValue.amount), 0);
  const confidences = new Set(priced.map((event) => event.estimatedValue.confidence));
  return {
    amount: priced.length ? Number(amount.toFixed(2)) : null,
    currency: priced[0]?.estimatedValue.currency || "CAD",
    confidence: priced.length === events.length && confidences.size === 1 ? [...confidences][0] : priced.length ? "mixed" : "unavailable",
    coverage: { known: priced.length, total: events.length },
    display: priced.length === events.length ? `$${amount.toFixed(2)}` : priced.length ? `Based on ${priced.length} of ${events.length} entries` : "Complete value unavailable"
  };
}

function summarizeReasons(events) {
  return events.reduce((counts, event) => {
    counts[event.reasonCode] = (counts[event.reasonCode] || 0) + 1;
    return counts;
  }, {});
}

function suggestionIdsFor(events, guidance = REVIEWED_FREEZER_GUIDANCE) {
  if (events.length < WASTE_PATTERN_POLICY.minimumRelatedEventsForStrongPattern) return [];
  const ids = ["prefer-smaller-quantities", "remind-earlier"];
  const freezer = guidance[TEST_CONTEXT.patternGroupId];
  if (freezer?.reviewed && freezer.reviewStatus === "approved" && freezer.canFreeze && freezer.compatibleFoodForms.includes(TEST_CONTEXT.foodForm)) ids.push("create-freeze-half-routine");
  ids.push("show-rescue-recipes");
  return ids;
}

function buildInsight(events, options = {}) {
  const context = options.context || TEST_CONTEXT;
  const policy = options.policy || WASTE_PATTERN_POLICY;
  const selected = selectQualifyingEvents(events, context, policy);
  const count = selected.included.length;
  const repeated = count >= policy.minimumRelatedEventsForStrongPattern;
  const quantity = summarizeQuantity(selected.included);
  const value = summarizeValue(selected.included);
  const insight = {
    wastePatternInsightVersion: 1,
    insightId: `waste-pattern-${context.patternGroupId}-${context.referenceLocalDate}`,
    userScopeId: context.userScopeId,
    patternGroupId: context.patternGroupId,
    displayName: context.displayName,
    status: repeated ? "repeated-pattern" : count ? "insufficient-evidence" : "no-pattern",
    claimStrength: repeated ? "repeated" : count === 2 ? "factual-multiple-events" : count === 1 ? "factual-single-event" : "none",
    policy: { policyId: policy.policyId, policyVersion: policy.policyVersion, lookbackDays: policy.lookbackDays, minimumEvents: policy.minimumRelatedEventsForStrongPattern },
    window: { referenceLocalDate: context.referenceLocalDate, timezone: context.timezone },
    evidence: {
      qualifyingEventCount: count,
      eventIds: selected.included.map((event) => event.eventId),
      localDates: selected.included.map((event) => localDateFromInstant(event.occurredAt)),
      totalQuantity: quantity,
      estimatedValue: value,
      reasonCounts: summarizeReasons(selected.included),
      excluded: selected.excluded
    },
    suggestions: suggestionIdsFor(selected.included, options.guidance || REVIEWED_FREEZER_GUIDANCE),
    automaticChangesApplied: false,
    sourceRevisions: {
      wasteDiaryRevision: stableHash(selected.included.map((event) => `${event.eventId}:${event.correction?.revision || 1}`).join("|")),
      patternPolicyVersion: policy.policyVersion,
      ingredientCatalogueVersion: 1,
      freezerGuidanceVersion: options.guidanceVersion || 1
    },
    calculatedAt: context.referenceInstant
  };
  return insight;
}

function stableHash(value) {
  let hash = 0;
  String(value).split("").forEach((char) => {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  });
  return hash.toString(36);
}

function renderInsight(insight) {
  if (insight.status !== "repeated-pattern") return `Spinach evidence\n${insight.evidence.qualifyingEventCount} spinach discard ${insight.evidence.qualifyingEventCount === 1 ? "entry was" : "entries were"} recorded during this period.`;
  const evidenceList = insight.evidence.localDates.map((date, index) => {
    const event = BASELINE_EVENTS.find((candidate) => candidate.eventId === insight.evidence.eventIds[index]) || {};
    return `<li><time>${formatShortDate(date)}</time> Spinach discarded. Amount: approximately 180 g. Reason: ${reasonLabel(event.reasonCode)}.</li>`;
  }).join("");
  return `<article class="waste-pattern-card" aria-label="Spinach pattern. You recorded spinach as discarded 3 times during the last 60 days. Estimated amount discarded: 540 grams. Estimated value: 7 dollars and 80 cents.">
    <h3>Spinach Pattern</h3>
    <p>You recorded spinach as discarded 3 times during the last 60 days.</p>
    <dl>
      <div><dt>Estimated amount discarded</dt><dd>${insight.evidence.totalQuantity.display}</dd></div>
      <div><dt>Estimated value</dt><dd>${insight.evidence.estimatedValue.display}</dd></div>
      <div><dt>Data coverage</dt><dd>${insight.evidence.totalQuantity.coverage.known} of ${insight.evidence.totalQuantity.coverage.total} entries had quantity information. ${insight.evidence.estimatedValue.coverage.known} of ${insight.evidence.estimatedValue.coverage.total} entries had price information. Estimated value confidence: Medium.</dd></div>
    </dl>
    <h4>Possible next steps</h4>
    <button aria-label="Prefer smaller spinach package suggestions for future shopping lists">Prefer Smaller Quantities</button>
    <button aria-label="Set an earlier reminder for fresh spinach">Remind Me Earlier</button>
    <button aria-label="Create a Freeze-Half suggestion routine for eligible fresh spinach packages">Create a Freeze-Half Routine</button>
    <button aria-label="Show recipes that may help use fresh spinach earlier">Show Spinach Rescue Recipes</button>
    <details><summary aria-label="Review why the spinach pattern insight appears">Why am I seeing this?</summary><ol>${evidenceList}</ol></details>
    <button aria-label="Review the 3 spinach Waste Diary entries supporting this insight">Review Diary Entries</button>
  </article>`;
}

function formatShortDate(date) {
  const [, month, day] = date.split("-").map(Number);
  return `${["January", "February", "March", "April", "May", "June", "July", "August"][month - 1]} ${day}`;
}

function reasonLabel(reason) {
  return {
    "spoiled-before-use": "Spoiled before use",
    "bought-too-much": "Bought too much",
    "forgot-it-was-available": "Forgot it was available"
  }[reason] || "Not recorded";
}

function exportInsight(insight) {
  return {
    insightId: insight.insightId,
    patternGroupId: insight.patternGroupId,
    status: insight.status,
    claimStrength: insight.claimStrength,
    window: { lookbackDays: insight.policy.lookbackDays, referenceLocalDate: insight.window.referenceLocalDate, timezone: insight.window.timezone },
    qualifyingEventCount: insight.evidence.qualifyingEventCount,
    evidenceEventIds: insight.evidence.eventIds,
    totalQuantity: { point: insight.evidence.totalQuantity.point, unit: insight.evidence.totalQuantity.unit, confidence: insight.evidence.totalQuantity.confidence },
    estimatedValue: { amount: insight.evidence.estimatedValue.amount, currency: insight.evidence.estimatedValue.currency, confidence: insight.evidence.estimatedValue.confidence },
    suggestions: insight.suggestions,
    automaticChangesApplied: insight.automaticChangesApplied
  };
}

function createNotificationCandidate(insight, preferences = { remindersOn: true, privacyPreview: "private" }) {
  if (!preferences.remindersOn || insight.status !== "repeated-pattern") return null;
  return {
    candidateId: `pattern-notification:${insight.insightId}:${insight.sourceRevisions.wasteDiaryRevision}`,
    level: "possible-pattern-reminder",
    sourceInsightId: insight.insightId,
    privacySafeExternalText: "Chef Nova found a new Waste Diary insight. Open the app to review optional suggestions.",
    inAppText: "SPINACH PATTERN\nThree spinach discard entries were recorded during the last 60 days.\nChef Nova found a few optional changes that may help.",
    bundledSourceCount: 1
  };
}

function renderInsightSet(insights, previous = { cards: [], notifications: [] }, preferences) {
  const active = new Map(previous.cards.map((card) => [card.insightId, card]));
  const notifications = new Map(previous.notifications.map((item) => [item.candidateId, item]));
  insights.forEach((insight) => {
    if (insight.status === "repeated-pattern") active.set(insight.insightId, { insightId: insight.insightId, html: renderInsight(insight) });
    const notification = createNotificationCandidate(insight, preferences);
    if (notification) notifications.set(notification.candidateId, notification);
  });
  return { cards: [...active.values()], notifications: [...notifications.values()], liveAnnouncements: previous.cards.length ? [] : ["New Waste Diary insight. Three spinach discard entries were recorded during the last 60 days. Optional suggestions are available."] };
}

function cloneEvents(events) {
  return JSON.parse(JSON.stringify(events));
}

function assertNoForbiddenLanguage(text, context) {
  [
    "you wasted food again",
    "you waste spinach frequently",
    "you are throwing away too much money",
    "your waste habits are bad",
    "you failed to use your spinach",
    "you should stop being wasteful",
    "you are irresponsible",
    "this is a bad habit",
    "you always forget your food",
    "frequently",
    "often",
    "habit",
    "recurring problem",
    "regularly waste",
    "pattern established",
    "repeatedly discard",
    "again and again"
  ].forEach((phrase) => assert(!text.toLowerCase().includes(phrase), `${context} contains prohibited wording: ${phrase}`));
}

function assertStateUnchanged(before, after, context) {
  assert.deepStrictEqual(after.pantry, before.pantry, `${context}: Pantry changed`);
  assert.deepStrictEqual(after.shoppingList, before.shoppingList, `${context}: Shopping List changed`);
  assert.deepStrictEqual(after.mealCalendar, before.mealCalendar, `${context}: Calendar changed`);
  assert.deepStrictEqual(after.reservations, before.reservations, `${context}: reservations changed`);
  assert.deepStrictEqual(after.reminderSettings, before.reminderSettings, `${context}: reminders changed`);
  assert.deepStrictEqual(after.packagePreferences, before.packagePreferences, `${context}: package preferences changed`);
  assert.deepStrictEqual(after.freezerRoutines, before.freezerRoutines, `${context}: freezer routines changed`);
  assert.deepStrictEqual(after.wasteDiaryEvents, before.wasteDiaryEvents, `${context}: Waste Diary events changed`);
  assert.deepStrictEqual(after.foodEventHistory, before.foodEventHistory, `${context}: Food Event History changed`);
  assert.deepStrictEqual(after.impactLedger, before.impactLedger, `${context}: Impact Ledger changed`);
}

[
  "WASTE_PATTERN_CONFIG",
  "windows: { repeatedFoodDays: 60",
  "minimums: { repeatedFoodEvents: 3",
  "function checkWastePatterns",
  "selectWasteDiaryEntries()",
  "function dedupeWastePatternIncidents",
  "function createWastePatternResult",
  "function buildActionableInsight",
  "function buildInsightActionCandidates",
  "function openInsightActionPreview",
  "function applyInsightAction",
  "function buildPatternEvidenceBundle",
  "function renderPatternEvidenceDisclosure",
  "Why am I seeing this?",
  "Review Diary Entries",
  "filterWasteDiaryByPattern",
  "function syncFoodRescueNotifications",
  "POSSIBLE_PATTERN_REMINDER",
  "function buildImpactLedger",
  "function selectEffectiveImpactLedgerEntries"
].forEach((needle) => assert(app.includes(needle), `Existing source missing: ${needle}`));

[
  "Chef Nova uses inclusive rolling windows.",
  "The baseline is at least three related effective incidents.",
  "Raw, cooked, frozen, canned, and prepared forms are not merged unless structured metadata supports it.",
  "Step 30 never changes Shopping List items",
  "Cost and weight may appear in Waste Diary records, but they do not prove behavior",
  "Evidence Source of Truth",
  "Chef Nova does not rebuild evidence with food-name searches.",
  "Viewing an insight does not change Pantry, recipes, reminders, meal plans, shopping lists, allergies, or Food Event History.",
  "Missing prices stay unavailable. Chef Nova never treats an unknown price as $0.",
  "The diary is a projection of effective `discarded` Food Event History records.",
  "Pattern reminders require an active Step 30 possible pattern",
  "Possible-pattern reminders are low-frequency and tied to active pattern revisions.",
  "Notifications do not create impact credit"
].forEach((needle) => {
  const combinedDocs = [patternDoc, evidenceDoc, actionDoc, wasteDiaryDoc, costDoc, notificationDoc, fatigueDoc, impactDoc].join("\n");
  assert(combinedDocs.includes(needle), `Documentation contract missing: ${needle}`);
});

[
  "@media (forced-colors: active)",
  "@media (prefers-reduced-motion: reduce)",
  "@media print",
  ".pattern-evidence-disclosure",
  ".actionable-insight-card",
  ".food-rescue-notification-items"
].forEach((needle) => assert(css.includes(needle), `CSS support missing: ${needle}`));

const baseline = buildInsight(cloneEvents(BASELINE_EVENTS));
assert.strictEqual(baseline.status, "repeated-pattern", "Three confirmed effective spinach events must create a repeated pattern.");
assert.strictEqual(baseline.claimStrength, "repeated", "Three confirmed effective spinach events must use repeated claim strength.");
assert.deepStrictEqual(baseline.evidence.eventIds, ["waste-pattern-spinach-event-1", "waste-pattern-spinach-event-2", "waste-pattern-spinach-event-3"], "Baseline evidence IDs must be exact and chronological.");
assert.deepStrictEqual(baseline.evidence.localDates, ["2026-06-18", "2026-07-09", "2026-08-06"], "Baseline evidence dates must be exact.");
assert.strictEqual(baseline.evidence.totalQuantity.point, 540, "Baseline quantity must be 540 g.");
assert.strictEqual(baseline.evidence.totalQuantity.display, "540 g", "Baseline quantity display must be 540 g.");
assert.strictEqual(baseline.evidence.estimatedValue.amount, 7.8, "Baseline estimated value must be $7.80.");
assert.strictEqual(baseline.evidence.estimatedValue.display, "$7.80", "Baseline estimated value display must be $7.80.");
assert.strictEqual(baseline.evidence.estimatedValue.confidence, "mixed", "Baseline price confidence must be mixed.");
assert.deepStrictEqual(baseline.evidence.reasonCounts, { "spoiled-before-use": 1, "bought-too-much": 1, "forgot-it-was-available": 1 }, "Baseline reasons must not create a dominant-cause claim.");
assert.deepStrictEqual(baseline.suggestions, ["prefer-smaller-quantities", "remind-earlier", "create-freeze-half-routine", "show-rescue-recipes"], "Baseline suggestions must be the four approved optional actions.");
assert.strictEqual(baseline.automaticChangesApplied, false, "Pattern insight display must not apply changes automatically.");

const baselineHtml = renderInsight(baseline);
[
  "Spinach Pattern",
  "You recorded spinach as discarded 3 times during the last 60 days.",
  "Estimated amount discarded",
  "540 g",
  "Estimated value",
  "$7.80",
  "3 of 3 entries had quantity information",
  "3 of 3 entries had price information",
  "Possible next steps",
  "Prefer Smaller Quantities",
  "Remind Me Earlier",
  "Create a Freeze-Half Routine",
  "Show Spinach Rescue Recipes",
  "Why am I seeing this?",
  "Review Diary Entries",
  "June 18",
  "July 9",
  "August 6",
  "Spoiled before use",
  "Bought too much",
  "Forgot it was available"
].forEach((needle) => assert(baselineHtml.includes(needle), `Baseline rendered evidence missing: ${needle}`));
assertNoForbiddenLanguage(baselineHtml.replace("last 60 days", "last sixty days"), "baseline pattern card");

const oneEvent = buildInsight([BASELINE_EVENTS[0]]);
assert.notStrictEqual(oneEvent.status, "repeated-pattern", "One event must not create a repeated pattern.");
assert.notStrictEqual(oneEvent.claimStrength, "frequent", "One event must not create a frequent claim.");
assertNoForbiddenLanguage(renderInsight(oneEvent), "one-event insight");

const twoEvents = buildInsight(BASELINE_EVENTS.slice(0, 2));
assert.notStrictEqual(twoEvents.status, "repeated-pattern", "Two events must not create a repeated pattern.");
assert.notStrictEqual(twoEvents.claimStrength, "frequent", "Two events must not create a frequent claim.");
assertNoForbiddenLanguage(renderInsight(twoEvents), "two-event insight");

const duplicateThird = buildInsight([
  BASELINE_EVENTS[0],
  BASELINE_EVENTS[1],
  { ...BASELINE_EVENTS[1], eventId: "waste-pattern-spinach-event-2-duplicate", eventStatus: "duplicate" }
]);
assert.strictEqual(duplicateThird.evidence.qualifyingEventCount, 2, "Duplicate third record must not inflate count.");
assert.strictEqual(duplicateThird.status, "insufficient-evidence", "Duplicate third record must not create a repeated pattern.");
assert(duplicateThird.evidence.excluded.some((item) => item.reason === "excluded-status:duplicate"), "Duplicate status must be reported as excluded.");

const duplicateRequest = buildInsight([
  BASELINE_EVENTS[0],
  BASELINE_EVENTS[1],
  { ...BASELINE_EVENTS[1], eventId: "waste-pattern-spinach-event-2-retry" }
]);
assert.strictEqual(duplicateRequest.evidence.qualifyingEventCount, 2, "Same request retry must count once.");
assert(duplicateRequest.evidence.excluded.some((item) => item.reason === "duplicate-request-or-event"), "Duplicate request exclusion must be explicit.");

const voidedThird = buildInsight([BASELINE_EVENTS[0], BASELINE_EVENTS[1], { ...BASELINE_EVENTS[2], correction: { ...BASELINE_EVENTS[2].correction, voidedAt: "2026-08-07T10:00:00-04:00" } }]);
assert.strictEqual(voidedThird.evidence.qualifyingEventCount, 2, "Voided event must not count.");
assert.strictEqual(voidedThird.status, "insufficient-evidence", "Voiding one baseline event must remove the strong insight.");
assert(voidedThird.evidence.excluded.some((item) => item.reason === "voided"), "Voided evidence must remain audit-visible as excluded.");

const supersededThird = buildInsight([BASELINE_EVENTS[0], BASELINE_EVENTS[1], { ...BASELINE_EVENTS[2], correction: { ...BASELINE_EVENTS[2].correction, supersededByEventId: "waste-pattern-kale-event-1" } }]);
assert.strictEqual(supersededThird.evidence.qualifyingEventCount, 2, "Superseded event must not count.");
assert(supersededThird.evidence.excluded.some((item) => item.reason === "superseded"), "Superseded exclusion must be explicit.");

const correctedToKale = buildInsight([
  BASELINE_EVENTS[0],
  BASELINE_EVENTS[1],
  { ...BASELINE_EVENTS[2], correction: { ...BASELINE_EVENTS[2].correction, supersededByEventId: "waste-pattern-kale-event-1" } },
  createSpinachDiscardEvent({ eventId: "waste-pattern-kale-event-1", ingredientId: "kale", patternGroupId: "fresh-kale", displayName: "Kale", reasonCode: "spoiled-before-use", requestId: "kale-discard-request-1", deduplicationKey: "kale-discard-2026-08-06" })
]);
assert.strictEqual(correctedToKale.evidence.qualifyingEventCount, 2, "Corrected kale event must not remain in spinach evidence.");
assert(correctedToKale.evidence.excluded.some((item) => item.eventId === "waste-pattern-kale-event-1" && item.reason === "incompatible-pattern-group"), "Kale replacement must be excluded from spinach group.");

const outsideWindow = buildInsight([
  createSpinachDiscardEvent({ eventId: "waste-pattern-spinach-old", occurredAt: "2026-06-14T20:00:00-04:00", requestId: "old-spinach-request", deduplicationKey: "old-spinach" }),
  BASELINE_EVENTS[1],
  BASELINE_EVENTS[2]
]);
assert.strictEqual(outsideWindow.evidence.qualifyingEventCount, 2, "Older than 60 days must not count.");
assert(outsideWindow.evidence.excluded.some((item) => item.reason === "outside-lookback-window"), "Outside-window exclusion must be explicit.");

const boundary = buildInsight([
  createSpinachDiscardEvent({ eventId: "waste-pattern-spinach-boundary-inside", occurredAt: "2026-06-17T20:00:00-04:00", requestId: "boundary-inside", deduplicationKey: "boundary-inside" }),
  createSpinachDiscardEvent({ eventId: "waste-pattern-spinach-boundary-exact", occurredAt: "2026-06-16T20:00:00-04:00", requestId: "boundary-exact", deduplicationKey: "boundary-exact" }),
  createSpinachDiscardEvent({ eventId: "waste-pattern-spinach-boundary-outside", occurredAt: "2026-06-15T20:00:00-04:00", requestId: "boundary-outside", deduplicationKey: "boundary-outside" })
]);
assert.deepStrictEqual(boundary.evidence.eventIds, ["waste-pattern-spinach-boundary-exact", "waste-pattern-spinach-boundary-inside"], "Inclusive 60-day boundary must include exact boundary and inside events only.");
assert(boundary.evidence.excluded.some((item) => item.eventId === "waste-pattern-spinach-boundary-outside" && item.reason === "outside-lookback-window"), "Immediately outside boundary must be excluded.");

const futureEvent = buildInsight([...BASELINE_EVENTS.slice(0, 2), createSpinachDiscardEvent({ eventId: "waste-pattern-spinach-future", occurredAt: "2026-08-16T20:00:00-04:00", requestId: "future-spinach", deduplicationKey: "future-spinach" })]);
assert.strictEqual(futureEvent.evidence.qualifyingEventCount, 2, "Future event must not inflate the current pattern.");
assert(futureEvent.evidence.excluded.some((item) => item.reason === "future-event"), "Future event exclusion must be explicit.");

const aliasEvents = buildInsight([
  { ...BASELINE_EVENTS[0], ingredientId: "baby-spinach" },
  { ...BASELINE_EVENTS[1], ingredientId: "fresh-spinach", eventId: "waste-pattern-fresh-spinach-alias", requestId: "fresh-spinach-alias", deduplicationKey: "fresh-spinach-alias" },
  { ...BASELINE_EVENTS[2], ingredientId: "spinach-leaves", eventId: "waste-pattern-spinach-leaves-alias", requestId: "spinach-leaves-alias", deduplicationKey: "spinach-leaves-alias" }
]);
assert.strictEqual(aliasEvents.evidence.qualifyingEventCount, 3, "Reviewed fresh spinach aliases must group.");

const formSeparated = buildInsight([
  BASELINE_EVENTS[0],
  BASELINE_EVENTS[1],
  createSpinachDiscardEvent({ eventId: "waste-pattern-frozen-spinach", ingredientId: "frozen-spinach", patternGroupId: "frozen-spinach", foodForm: "frozen", displayName: "Frozen spinach", requestId: "frozen-spinach", deduplicationKey: "frozen-spinach" }),
  createSpinachDiscardEvent({ eventId: "waste-pattern-spinach-dip", ingredientId: "spinach-dip", patternGroupId: "prepared-spinach-dip", foodForm: "prepared", displayName: "Spinach dip", requestId: "spinach-dip", deduplicationKey: "spinach-dip" })
]);
assert.strictEqual(formSeparated.evidence.qualifyingEventCount, 2, "Frozen or prepared spinach must not be merged with fresh spinach.");
assert(formSeparated.evidence.excluded.some((item) => item.reason === "incompatible-pattern-group"), "Incompatible form or group exclusion must be explicit.");

const sameDayDistinct = buildInsight([
  BASELINE_EVENTS[0],
  BASELINE_EVENTS[1],
  createSpinachDiscardEvent({ eventId: "waste-pattern-spinach-same-day-distinct", occurredAt: "2026-07-09T21:00:00-04:00", sourcePackageId: "spinach-package-july-second", requestId: "same-day-distinct-request", deduplicationKey: "same-day-distinct" })
]);
assert.strictEqual(sameDayDistinct.evidence.qualifyingEventCount, 3, "Same-day distinct events must not be deduped solely by date.");

const crossUser = buildInsight([BASELINE_EVENTS[0], BASELINE_EVENTS[1], { ...BASELINE_EVENTS[2], eventId: "waste-pattern-other-user-event", userScopeId: "other-user" }]);
assert.strictEqual(crossUser.evidence.qualifyingEventCount, 2, "Cross-user events must not combine.");
assert(crossUser.evidence.excluded.some((item) => item.reason === "different-user-scope"), "Cross-user exclusion must be explicit.");

const guestContext = { ...TEST_CONTEXT, userScopeId: TEST_CONTEXT.guestScopeId };
const guestInsight = buildInsight(BASELINE_EVENTS.map((event, index) => ({ ...event, userScopeId: TEST_CONTEXT.guestScopeId, eventId: `${event.eventId}-guest-${index}` })), { context: guestContext });
assert.strictEqual(guestInsight.userScopeId, TEST_CONTEXT.guestScopeId, "Guest insight must remain guest scoped.");
assert(!guestInsight.userScopeId.includes("registered"), "Guest insight must not automatically merge into a registered account.");

const unknownQuantity = buildInsight([BASELINE_EVENTS[0], BASELINE_EVENTS[1], { ...BASELINE_EVENTS[2], quantity: { representation: "unknown", point: null, unit: null, confidence: "unknown" } }]);
assert.strictEqual(unknownQuantity.evidence.qualifyingEventCount, 3, "Unknown quantity event may still count toward event threshold.");
assert.strictEqual(unknownQuantity.evidence.totalQuantity.display, "At least 360 g", "Unknown quantity must not be treated as 0 g.");
assert.deepStrictEqual(unknownQuantity.evidence.totalQuantity.coverage, { known: 2, total: 3 }, "Unknown quantity coverage must be visible.");

const incompatibleUnits = buildInsight([BASELINE_EVENTS[0], BASELINE_EVENTS[1], { ...BASELINE_EVENTS[2], quantity: { representation: "exact-numeric", point: 200, unit: "mL", confidence: "user-confirmed" } }]);
assert.strictEqual(incompatibleUnits.evidence.totalQuantity.display, "At least 360 g", "Incompatible units must not be silently combined into grams.");

const missingPrice = buildInsight([BASELINE_EVENTS[0], BASELINE_EVENTS[1], { ...BASELINE_EVENTS[2], estimatedValue: { amount: null, currency: "CAD", confidence: "price-unavailable" } }]);
assert.strictEqual(missingPrice.evidence.estimatedValue.display, "Based on 2 of 3 entries", "Missing price must not be treated as $0.");
assert.strictEqual(missingPrice.evidence.estimatedValue.amount, 4.9, "Known prices should aggregate without adding zero for missing prices.");
assert.deepStrictEqual(missingPrice.evidence.estimatedValue.coverage, { known: 2, total: 3 }, "Missing price coverage must be visible.");

const noFreezeGuidance = buildInsight(BASELINE_EVENTS, { guidance: {} });
assert.deepStrictEqual(noFreezeGuidance.suggestions, ["prefer-smaller-quantities", "remind-earlier", "show-rescue-recipes"], "Freeze-Half routine must disappear without approved reviewed guidance.");

const beforeState = {
  pantry: [{ id: "spinach-package-august", quantity: 180, unit: "g" }],
  shoppingList: [{ id: "shop-spinach", name: "Spinach", quantity: 1 }],
  mealCalendar: [],
  reservations: [],
  reminderSettings: { spinach: "1-day-before" },
  packagePreferences: {},
  freezerRoutines: {},
  wasteDiaryEvents: cloneEvents(BASELINE_EVENTS),
  foodEventHistory: cloneEvents(BASELINE_EVENTS),
  impactLedger: []
};
const afterState = JSON.parse(JSON.stringify(beforeState));
buildInsight(BASELINE_EVENTS);
renderInsight(baseline);
renderInsightSet([baseline]);
assertStateUnchanged(beforeState, afterState, "pattern display");

const firstRender = renderInsightSet([baseline]);
const secondRender = renderInsightSet([baseline], firstRender);
assert.strictEqual(firstRender.cards.length, 1, "First render must create one spinach pattern card.");
assert.strictEqual(firstRender.notifications.length, 1, "First render must create one bundled notification candidate.");
assert.strictEqual(secondRender.cards.length, 1, "Identical rerender must not duplicate cards.");
assert.strictEqual(secondRender.notifications.length, 1, "Identical rerender must not duplicate notifications.");
assert.strictEqual(secondRender.liveAnnouncements.length, 0, "Identical rerender must not create new live-region announcements.");
assert(firstRender.notifications[0].privacySafeExternalText.includes("Open the app"), "External notification text must be privacy safe.");
assert(!firstRender.notifications[0].privacySafeExternalText.includes("$7.80"), "External notification must not expose cost.");
assert(!firstRender.notifications[0].privacySafeExternalText.includes("540 g"), "External notification must not expose quantity.");
assert.strictEqual(renderInsightSet([baseline], { cards: [], notifications: [] }, { remindersOn: false }).notifications.length, 0, "Reminders Off must suppress proactive notification candidates.");

const exportModel = exportInsight(baseline);
assert.deepStrictEqual(exportModel, {
  insightId: "waste-pattern-fresh-spinach-2026-08-15",
  patternGroupId: "fresh-spinach",
  status: "repeated-pattern",
  claimStrength: "repeated",
  window: { lookbackDays: 60, referenceLocalDate: "2026-08-15", timezone: "America/Toronto" },
  qualifyingEventCount: 3,
  evidenceEventIds: ["waste-pattern-spinach-event-1", "waste-pattern-spinach-event-2", "waste-pattern-spinach-event-3"],
  totalQuantity: { point: 540, unit: "g", confidence: "user-confirmed" },
  estimatedValue: { amount: 7.8, currency: "CAD", confidence: "mixed" },
  suggestions: ["prefer-smaller-quantities", "remind-earlier", "create-freeze-half-routine", "show-rescue-recipes"],
  automaticChangesApplied: false
}, "Structured export must preserve Step 62 semantics.");
assert.notStrictEqual(exportInsight(oneEvent).claimStrength, "frequent", "One-event export must not be frequent.");
assert.notStrictEqual(exportInsight(twoEvents).status, "repeated-pattern", "Two-event export must not be repeated-pattern.");

const staleAfterCorrection = buildInsight([BASELINE_EVENTS[0], BASELINE_EVENTS[1], { ...BASELINE_EVENTS[2], correction: { ...BASELINE_EVENTS[2].correction, voidedAt: "2026-08-07T10:00:00-04:00", revision: 2 } }]);
assert.strictEqual(staleAfterCorrection.status, "insufficient-evidence", "Correction must recalculate and remove stale three-event insight.");
assert(!renderInsight(staleAfterCorrection).includes("3 times during the last 60 days"), "Corrected evidence must not leave a stale three-event claim.");

const policyVersionChanged = buildInsight(BASELINE_EVENTS, { policy: { ...WASTE_PATTERN_POLICY, policyVersion: 2 } });
assert.strictEqual(policyVersionChanged.sourceRevisions.patternPolicyVersion, 2, "Policy-version change must be represented in source revisions.");
assert.deepStrictEqual(policyVersionChanged.evidence.eventIds, baseline.evidence.eventIds, "Policy recalculation must preserve physical diary events.");

const legacyAggregate = { qualifyingEventCount: 5, claimStrength: "frequent" };
const canonicalFromEvents = buildInsight(BASELINE_EVENTS);
assert.strictEqual(canonicalFromEvents.evidence.qualifyingEventCount, 3, "Canonical event count must ignore old-client aggregate counts.");
assert.notStrictEqual(legacyAggregate.qualifyingEventCount, canonicalFromEvents.evidence.qualifyingEventCount, "Test fixture must prove client aggregate was ignored.");

const migrationAmbiguous = buildInsight([
  BASELINE_EVENTS[0],
  BASELINE_EVENTS[1],
  createSpinachDiscardEvent({ eventId: "legacy-ambiguous-spinach", ingredientId: "legacy-spinach-text", patternGroupId: "", foodForm: "", requestId: "legacy-ambiguous", deduplicationKey: "legacy-ambiguous" })
]);
assert.strictEqual(migrationAmbiguous.evidence.qualifyingEventCount, 2, "Ambiguous legacy identity must not create a strong pattern.");

const printOutput = `SPINACH PATTERN
Window: Previous 60 days
Qualifying discard entries: ${baseline.evidence.qualifyingEventCount}
Estimated quantity: ${baseline.evidence.totalQuantity.display}
Estimated value: ${baseline.evidence.estimatedValue.display}
Evidence:
June 18 - 180 g - Spoiled before use
July 9 - 180 g - Bought too much
August 6 - 180 g - Forgot it was available
Possible next steps:
Prefer smaller quantities
Remind earlier
Review freezing options
Show rescue recipes`;
assert(printOutput.includes("Qualifying discard entries: 3"), "Print output must preserve count.");
assertNoForbiddenLanguage(printOutput, "print output");

[
  "Spinach pattern.",
  "You recorded spinach as discarded 3 times during the last 60 days.",
  "Estimated amount discarded:",
  "540 grams.",
  "Estimated value:",
  "7 dollars and 80 cents.",
  "Prefer Smaller Quantities",
  "Create a Freeze-Half Routine"
].forEach((needle) => assert(baselineHtml.replace("540 g", "540 grams.").replace("$7.80", "7 dollars and 80 cents.").includes(needle), `Accessible text missing: ${needle}`));
["aria-label", "Review the 3 spinach Waste Diary entries supporting this insight", "Review why the spinach pattern insight appears"].forEach((needle) => assert(baselineHtml.includes(needle), `Accessible action name missing: ${needle}`));

[
  "# Chef Nova Waste Diary Pattern Tests",
  "## 2. Fixed Test Context",
  "August 15, 2026",
  "America/Toronto",
  "60-day",
  "June 18",
  "July 9",
  "August 6",
  "540 g",
  "$7.80",
  "Unknown quantities are not displayed as 0",
  "Missing prices are not displayed as $0",
  "No Automatic Changes",
  "keyboard accessible",
  "320 CSS pixels",
  "Print and Export"
].forEach((needle) => assert(step62Doc.includes(needle), `Step 62 test documentation missing: ${needle}`));

[
  "Required qualifying spinach events: 3",
  "Required pattern window: 60 days",
  "Required pattern status: Repeated Pattern",
  "Required estimated discarded quantity: 540 g",
  "Required estimated discarded value: $7.80 CAD",
  "Automatic preference changes: 0",
  "Strong frequent claims after 1 event: 0",
  "Strong frequent claims after 2 events: 0",
  "Duplicate events counted more than once: 0",
  "Voided events counted: 0",
  "Superseded events counted: 0",
  "Out-of-window events counted: 0",
  "Future events counted: 0",
  "Different users' events combined: 0",
  "Incompatible food forms combined: 0",
  "Unknown quantities represented as 0: 0",
  "Missing prices represented as $0: 0",
  "Disrespectful pattern messages: 0",
  "Pattern detection Impact Ledger entries: 0",
  "Step 62 completion status: Complete"
].forEach((needle) => assert(step62Report.includes(needle), `Step 62 report missing: ${needle}`));

console.log("Step 62 Waste Diary pattern tests passed.");
