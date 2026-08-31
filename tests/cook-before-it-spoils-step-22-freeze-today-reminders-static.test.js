const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const systemDoc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-freeze-today-reminders.md"), "utf8");
const reportDoc = fs.readFileSync(path.join(root, "docs/cook-before-it-spoils-step-22-report.md"), "utf8");

[
  "FOOD_REMINDER_SCHEMA_VERSION",
  "FREEZE_REMINDER_ELIGIBILITY_VERSION",
  "FREEZE_PLAN_COVERAGE_VERSION",
  "FOOD_REMINDER_TYPES",
  "FREEZE_REMINDER_STATUSES",
  "FREEZE_REMINDER_ACTION_TYPES",
  "function deriveFreezeReminderPlanCoverage",
  "function deriveFreezeTodayReminderEligibility",
  "function createFreezeReminderRecord",
  "function getFreezeTodayReminderRecords",
  "function buildFreezeReminderViewModel",
  "function renderFreezeTodayReminderCard",
  "function renderFreezeTodayReminderSection",
  "function syncFreezeTodayReminderNotifications",
  "function handleFreezeReminderAction"
].forEach((needle) => assert(app.includes(needle), `${needle} is missing`));

[
  "currentQuantity = inventoryItem.currentQuantity",
  "timelyPlannedQuantity = sum(valid confirmed allocations scheduled on/before priorityActionDate)",
  "lateReservedQuantity = sum(active reservations after priorityActionDate)",
  "allActiveReservedQuantity = sum(all active reservations)",
  "unreservedQuantity = currentQuantity - allActiveReservedQuantity",
  "quantityWithoutTimelyPlan = currentQuantity - timelyPlannedQuantity",
  "actionableFreezeQuantity = Math.min(quantityWithoutTimelyPlan, unreservedQuantity)"
].forEach((needle) => assert(app.includes(needle) && systemDoc.includes(needle), `formula text missing: ${needle}`));

assert(app.includes("findMealForReservation(reservation)"), "reservation-linked meal lookup is required");
assert(app.includes("entry.pantryReservationIds"), "meal coverage must use exact reservation IDs");
assert(app.includes("scheduledDate <= priorityActionDate"), "timely allocations must be date-bounded");
assert(app.includes("scheduledDate > priorityActionDate"), "late reservations must remain separate");
assert(app.includes("FREEZER_GUIDANCE_REVIEW_STATUSES.APPROVED") && app.includes("FREEZER_GUIDANCE_REVIEW_STATUSES.APPROVED_WITH_LIMITATIONS"), "approved freezer guidance is required");
assert(app.includes("guardrail.hardExclusion") && app.includes("guardrail.requiresUserReview"), "food-safety guardrails must gate reminders");
assert(app.includes("PANTRY_PRESERVATION_STATES.FROZEN"), "already-frozen food must be excluded");
assert(app.includes("notification::${record.reminderId}"), "notifications must use stable reminder IDs");
assert(app.includes("actionTarget: PLANNING_MODES.COOK_BEFORE_IT_SPOILS"), "notification action must route to Cook Before It Spoils");

const handlerMatch = app.match(/function handleFreezeReminderAction\(button\) \{[\s\S]*?\n  \}/);
assert(handlerMatch, "freeze reminder action handler is missing");
const handler = handlerMatch[0];
assert(!handler.includes("executePantryCommand"), "reminder actions must not execute Pantry mutations");
assert(!handler.includes("freezeLeftoverBatch("), "reminder actions must not freeze leftovers directly");
assert(!handler.includes("PANTRY_PRESERVATION_STATES.FROZEN ="), "reminder actions must not set frozen state directly");
assert(handler.includes("openUseFirstFreezeOptions"), "freeze actions must open existing Freeze Options");
assert(handler.includes("openUseFirstPanelRecipeSearch"), "recipe action must reuse existing recipe flow");
assert(handler.includes("openCookBeforeItSpoilsFromLeftover"), "leftover action must reuse existing leftover flow");

[
  ".freeze-reminder-section",
  ".freeze-reminder-card",
  ".freeze-reminder-grid",
  ".freeze-reminder-actions",
  ".freeze-guidance-use-list",
  ".freeze-today-dashboard"
].forEach((needle) => assert(css.includes(needle), `${needle} CSS is missing`));

[
  "The reminder is advisory",
  "Inventory mutation is intentionally excluded",
  "Only exact reservation links count",
  "Step 22 Implementation Report"
].forEach((needle) => assert(systemDoc.includes(needle) || reportDoc.includes(needle), `documentation missing: ${needle}`));

console.log("Step 22 Freeze Today reminder static checks passed.");
