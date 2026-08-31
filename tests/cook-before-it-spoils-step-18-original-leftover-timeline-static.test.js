const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

function functionSection(name, nextName = null) {
  const start = app.indexOf(`function ${name}`);
  assert(start >= 0, `${name} should exist.`);
  const end = nextName ? app.indexOf(`function ${nextName}`, start + 1) : app.indexOf("\n  function ", start + 1);
  assert(end > start, `${name} section end should be found.`);
  return app.slice(start, end);
}

[
  "LEFTOVER_TIMELINE_DERIVATION_VERSION",
  "LEFTOVER_TIMELINE_POLICY_VERSION",
  "LEFTOVER_TIMELINE_ANCHORS",
  "LEFTOVER_TIMELINE_STATUSES",
  "LEFTOVER_TIMELINE_REASON_CODES",
  "TRANSFORMATION_REHEAT_EFFECTS"
].forEach((token) => assert(app.includes(token), `${token} must be declared.`));

const timelineBody = functionSection("deriveLeftoverTimeline", "formatTimelineRelativeAge");
assert(timelineBody.includes("originalCookedAt"), "Timeline derivation must preserve original cooked time.");
assert(timelineBody.includes("currentPreparedAt"), "Timeline derivation must track current prepared time separately.");
assert(timelineBody.includes("effectiveSafetyDeadline"), "Timeline derivation must expose the effective safety deadline.");
assert(timelineBody.includes("eventAppliesToCurrentPhysicalBatch"), "Timeline derivation must ignore events that only affect transformed or consumed portions.");
assert(timelineBody.includes("TRANSFORMATION_DOES_NOT_RESET"), "Timeline derivation must explain that transformations do not reset the timeline.");
assert(timelineBody.includes("REHEATING_DOES_NOT_RESET"), "Timeline derivation must explain that reheating does not reset the timeline.");
assert(timelineBody.includes("FRESH_INGREDIENTS_DO_NOT_EXTEND"), "Timeline derivation must explain that fresh ingredients do not extend the source timeline.");
assert(!timelineBody.includes("fetch("), "Timeline policy must not fetch runtime policy data.");

const guardrailBody = functionSection("deriveFoodSafetyGuardrail", "getFoodSafetyGuardrailForPantryItem");
assert(guardrailBody.includes("deriveLeftoverTimeline"), "Food-safety guardrails must use the shared leftover timeline.");
assert(guardrailBody.includes("leftoverTimeline"), "Food-safety results must carry the leftover timeline snapshot.");
assert(guardrailBody.includes("Transforming, reheating, freezing, or adding fresh ingredients does not reset it."), "Expired timeline message must state that later actions do not reset the original timeline.");

const detailsBody = functionSection("renderLeftoverBatchDetails", "setPantryFilter");
assert(detailsBody.includes("renderOriginalLeftoverTimelineSummary"), "Pantry leftover details must show the original timeline summary.");
assert(detailsBody.includes("Correct Timeline Record"), "Pantry leftover details must expose a correction affordance for timeline records.");
assert(detailsBody.includes("timeline.canRecommendFreezing"), "Freeze options should come from the shared timeline.");

const sourceValidationBody = functionSection("revalidateLeftoverTransformationSource", "hasLeftoverLineageCycle");
assert(sourceValidationBody.includes("timeline.reheatCount"), "Transformation source validation must use timeline-derived reheat count.");
assert(sourceValidationBody.includes("outside-safety-window"), "Transformation source validation must reject target dates beyond the original timeline deadline.");

const candidateBody = functionSection("generateSingleStepTransformationCandidates", "recipeContainsTransformationSourceAllergy");
assert(candidateBody.includes("getLeftoverTransformationReheatEffect"), "Transformation candidates must classify method reheat effects.");
assert(candidateBody.includes("transformationReheatEffect"), "Transformation candidates must expose method reheat effects.");

const completionBody = functionSection("applyTransformationSourceForCompletedMeal", "updateCalendarMealEntry");
assert(completionBody.includes("FOOD_EVENT_TYPES.REHEATED"), "Heated transformations must record a reheated event.");
assert(completionBody.includes("transformed-portion-only"), "Reheated events must be scoped to the transformed portion.");
assert(completionBody.includes("Original cooked time remains the safety anchor"), "Completion event note must preserve the original anchor.");

assert(css.includes(".original-leftover-timeline"), "Original leftover timeline styling should exist.");
assert(css.includes(".leftover-timeline-grid"), "Original leftover timeline grid styling should exist.");
assert(fs.existsSync(path.join(root, "docs", "cook-before-it-spoils-original-leftover-timeline.md")), "Original timeline documentation should exist.");
assert(fs.existsSync(path.join(root, "docs", "cook-before-it-spoils-step-18-report.md")), "Step 18 implementation report should exist.");

console.log("Cook Before It Spoils Step 18 original leftover timeline static checks passed.");
