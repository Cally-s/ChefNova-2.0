const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dod = fs.readFileSync(path.join(root, "docs/budget-rescue-definition-of-done.md"), "utf8");
const report = fs.readFileSync(path.join(root, "docs/budget-rescue-final-acceptance-report.md"), "utf8");

const allowedResults = new Set([
  "PASS",
  "FAIL",
  "BLOCKED",
  "NOT RUN",
  "PRE-EXISTING UNRELATED FAILURE",
  "NOT APPLICABLE"
]);

for (let index = 1; index <= 14; index += 1) {
  const id = `DOD-${String(index).padStart(2, "0")}`;
  assert(dod.includes(id), `Definition of Done must include ${id}.`);
  assert(report.includes(id), `Final acceptance report must include ${id}.`);
}

[
  "ID | Requirement | Implementation Evidence | Test Evidence | Result | Notes",
  "Cross-Cutting Acceptance Summary",
  "Final Readiness Interpretation"
].forEach((text) => assert(dod.includes(text), `Definition of Done missing section: ${text}`));

[
  "# Chef Nova Budget Rescue Final Acceptance Report",
  "## 1. Executive Result",
  "NOT READY",
  "## 3. Definition of Done Matrix",
  "## 4. Cross-Cutting Results",
  "## 5. Required Scenario Results",
  "## 6. Commands Run",
  "## 9. Manual Verification",
  "## 11. Final Confirmations"
].forEach((text) => assert(report.includes(text), `Final report missing section: ${text}`));

assert(report.includes("No unresolved Budget Rescue release blockers were found in the executed validation scope."), "Final report must include executed-scope blocker statement.");
assert(report.includes("Full manual accessibility and device sign-off remains incomplete"), "Final report must explain why final status is not ready.");
assert(report.includes("No backend, database, live grocery-price API, retailer scraping"), "Final report must confirm no prohibited external system was introduced.");

const resultPattern = /\|\s*(PASS|FAIL|BLOCKED|NOT RUN|PRE-EXISTING UNRELATED FAILURE|NOT APPLICABLE)\s*\|/g;
const matchedResults = [...dod.matchAll(resultPattern), ...report.matchAll(resultPattern)].map((match) => match[1]);
assert(matchedResults.length > 20, "Acceptance docs should include result values.");
matchedResults.forEach((result) => assert(allowedResults.has(result), `Unexpected result value: ${result}`));

console.log("Budget Rescue final acceptance document checks passed.");
