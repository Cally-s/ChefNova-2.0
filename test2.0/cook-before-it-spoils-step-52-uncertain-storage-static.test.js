const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const doc = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-handle-uncertain-storage.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs", "cook-before-it-spoils-step-52-report.md"), "utf8");

function includesAll(source, terms, label) {
  terms.forEach((term) => assert(source.includes(term), `${label} should include ${term}`));
}

includesAll(app, [
  "STORAGE_EXPOSURE_RECORD_VERSION",
  "STORAGE_SAFETY_DECISION_VERSION",
  "STORAGE_SAFETY_POLICY_VERSION",
  "STORAGE_EXPOSURE_STATUSES",
  "STORAGE_ENVIRONMENT_TYPES",
  "STORAGE_EVIDENCE_CONFIDENCE",
  "STORAGE_SAFETY_RESULTS",
  "RESERVATION_STORAGE_STATUSES"
], "app constants");

includesAll(app, [
  "confirmed-temperature-controlled",
  "confirmed-within-window",
  "at-threshold-review-required",
  "duration-uncertain",
  "temperature-uncertain",
  "confirmed-over-limit",
  "conflicting-information",
  "not-applicable",
  "review-required",
  "hard-excluded"
], "storage exposure statuses");

includesAll(app, [
  "refrigerated",
  "frozen",
  "hot-held",
  "cold-cooler",
  "normal-room-temperature",
  "hot-outdoor-conditions",
  "hot-vehicle",
  "power-outage",
  "transport-uncontrolled",
  "buffet-uncontrolled",
  "temperature-control-unknown"
], "storage environments");

includesAll(app, [
  "measured",
  "timer-confirmed",
  "user-confirmed",
  "user-estimated",
  "device-recorded",
  "imported-confirmed",
  "limited",
  "unknown",
  "conflicting",
  "invalid"
], "evidence confidence values");

includesAll(app, [
  "eligible-for-further-evaluation",
  "conditional-review-required",
  "not-eligible-for-rescue-use",
  "policy-unavailable",
  "conflict-review-required"
], "storage safety results");

includesAll(app, [
  "STORAGE_SAFETY_POLICY_CATALOGUE",
  "cooked-perishable-normal-room-v1",
  "perishable-hot-condition-v1",
  "verified-temperature-control-v1",
  "durationMinutes: 120",
  "durationMinutes: 60",
  "reviewed: true",
  "reviewStatus: \"approved\""
], "policy catalogue");

includesAll(app, [
  "createStorageExposureRecord",
  "createStorageSafetyDecision",
  "deriveStorageSafetyDecisionForPantryItem",
  "findStorageSafetyPolicyForExposure",
  "renderStorageSafetyDecisionSummary",
  "focusStorageReviewForm"
], "storage decision functions");

includesAll(app, [
  "storageExposureRecords",
  "storageSafetyDecision",
  "exposureEventIds",
  "foodClassification",
  "sourceRevisions",
  "hardEligibility"
], "record separation fields");

includesAll(app, [
  "Storage environment",
  "Timing confidence",
  "Measured food or storage temperature",
  "It happened, but I am not sure how long",
  "I am not sure whether temperature control was maintained",
  "Outdoors in hot conditions",
  "In a hot vehicle",
  "In a cooler with cold packs or ice",
  "During a power outage",
  "Transport without verified cooling",
  "Buffet or serving table without verified control"
], "review form fields");

includesAll(app, [
  "STORAGE INFORMATION NEEDS REVIEW",
  "STORAGE DURATION NEEDS CONFIRMATION",
  "NOT ELIGIBLE FOR RECIPE PLANNING",
  "STORAGE INFORMATION RECORDED",
  "HOT-CONDITION STORAGE REVIEW",
  "This item was recorded outside temperature control",
  "Eligible for further evaluation",
  "This storage record does not by itself guarantee food safety",
  "Review Storage Information",
  "Record as Discarded",
  "Review Recorded Information"
], "storage decision display copy");

includesAll(app, [
  "NOT_ELIGIBLE_FOR_RESCUE_USE",
  "EXCLUDED_ROOM_TEMPERATURE_EXPOSURE",
  "canUseForAutomaticPlanning: false",
  "canUseForDateDrivenRescueRanking: false",
  "canRecommendFreezing: false",
  "canRecommendTransformation: false",
  "Chef Nova cannot confirm that this item is currently suitable for a food-use recommendation"
], "food-safety guardrail integration");

includesAll(app, [
  "LEFTOVER TRANSFORMATION UNAVAILABLE",
  "Storage safety must be reviewed before Chef Nova can transform this leftover",
  "BLOCKED_BY_STORAGE_SAFETY",
  "STORAGE_INFORMATION_STALE",
  "STORAGE_REVIEW_REQUIRED",
  "STORAGE_VERIFIED"
], "transformations and reservations");

assert(!app.includes("Was it safe"), "Chef Nova should ask for facts, not ask users whether food was safe.");
assert(!app.includes("Use Anyway"), "Blocked storage decisions should not offer use-anyway actions.");
assert(!app.includes("Freeze Anyway"), "Blocked storage decisions should not offer freeze-anyway actions.");

includesAll(css, [
  "Cook Before It Spoils - Uncertain Storage Safety",
  ".storage-safety-decision-card",
  ".storage-safety-actions",
  ".storage-review-details fieldset"
], "storage safety CSS");

includesAll(doc, [
  "Factual Exposure Record",
  "Derived Safety Decision",
  "Reviewed Policy Catalogue",
  "Decision Outcomes",
  "Safety decisions happen before",
  "Missing package dates and use-soon estimates cannot override uncertain or unsafe storage history",
  "Unknown quantity remains separate from storage safety",
  "Each package is evaluated separately",
  "Chef Nova asks for facts. It does not ask users whether the food was safe"
], "documentation");

includesAll(report, [
  "Goal",
  "Files Changed",
  "Implementation Summary",
  "Safety Precedence",
  "Important Safety Boundaries",
  "Tests Run",
  "Risks and Notes"
], "implementation report");

console.log("Cook Before It Spoils Step 52 uncertain-storage static checks passed.");
