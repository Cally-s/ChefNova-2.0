const assert = require("assert");
const fs = require("fs");

const app = fs.readFileSync("app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const pantryModule = fs.readFileSync("scripts/pantry-first-planning.js", "utf8");

assert(html.includes("scripts/pantry-first-planning.js"), "Pantry-first module must load before app.js.");
assert(app.includes("const PANTRY_FIRST = window.ChefNovaPantryFirst"), "app.js must use the shared Pantry-first module.");
assert(app.includes("PANTRY_FIRST_SCORE_WEIGHTS"), "Pantry-first ranking weights must be centralized.");
assert(app.includes("pantryPlanningInventory"), "Meal-plan generation context must include a temporary Pantry inventory.");
assert(app.includes("commitSelectedPantryAllocation"), "Only the selected recipe allocation should be committed.");
assert(app.includes("renderPantryFirstSummary"), "Budget Rescue must render a Pantry-first summary.");
assert(app.includes("calculatePantrySavingsForPlan"), "Pantry savings must use a shared calculation helper.");
assert(app.includes("calculateMealPlanCostsForPlan(plan, [])"), "Purchases avoided must compare with-Pantry and no-Pantry cost engine results.");
assert(app.includes("costs.purchaseGroups.filter((group) => group.missingQuantity > 0)"), "Shopping-list additions must use only missing purchase groups.");
assert(app.includes("Review Pantry Use"), "A Review Pantry Use interface must be available.");
assert(app.includes("Your Pantry will not be changed"), "Preview wording must state that real Pantry is unchanged.");
assert(pantryModule.includes("createPlanningInventory"), "Shared module must create temporary planning inventory.");
assert(pantryModule.includes("simulateRequirementAllocation"), "Shared module must allocate individual requirements.");
assert(pantryModule.includes("simulateRecipeAgainstInventory"), "Shared module must simulate full recipes.");
assert(pantryModule.includes("rebuildPlanPantryAllocations"), "Shared module must rebuild final plan allocations.");
assert(pantryModule.includes("PANTRY_QUANTITY_STATUSES"), "Shared module must track known and unknown Pantry quantities.");
assert(pantryModule.includes("USE_SOON_STATUSES"), "Shared module must derive use-soon statuses.");

console.log("Pantry-first static checks passed.");
