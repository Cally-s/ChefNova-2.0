# Chef Nova Respectful Budget Messages

## 1. Purpose

Budget messages describe the current plan, prices, settings, and available options. They do not judge the user or suggest changing safety requirements.

## 2. Language Principles

Messages use plan-centred wording, estimated price language, and real next steps. Missing prices, partial plans, and Shopping List shortfalls block final budget claims.

## 3. Prohibited Language

Chef Nova must not say a budget is bad, unrealistic, or insufficient. It must not say the user cannot afford a plan, failed, chose badly, or should remove or ignore allergies.

## 4. Message View Model

`deriveRespectfulBudgetMessage()` returns one view model with message type, severity, heading, primary message, secondary message, safety message, detail lines, actions, live-region text, warnings, policy, and plan signature.

## 5. Message Priority

Priority is safety review, no safe plan, partial plan, Shopping List coverage, incomplete prices, above budget, cushion usage, within budget, and unavailable status.

## 6. Complete Plan Above Budget

This message appears only when the plan is complete, safe, priced, and covered by the Shopping List. It uses the actual estimated amount above budget and the actual action count.

## 7. Full Plan Not Found Within Budget

When a full safe priced plan is not available within the selected budget, Chef Nova names the actual plan length and budget. It offers only available actions.

## 8. Partial and No-Safe-Plan Messages

Partial plans state the planned meal count and requested meal count. No-safe-plan messages preserve safety language and list non-safety options only.

## 9. Incomplete Price and Shopping Coverage

Incomplete pricing shows the known priced subtotal only. Shopping List coverage issues prevent within-budget and remaining-budget claims.

## 10. Action Model

Actions include an ID, type, label, description, route attribute, source system, plan signature, and confirmation expectation. Disabled, unsafe, stale, or unsupported actions are not displayed.

## 11. Pantry Action

Pantry actions reuse existing Pantry and pantry-first planning information. They do not modify the real Pantry during preview.

## 12. Substitution Action

Lower-cost substitutions reuse the existing substitution review. They preserve allergies, required dietary settings, appliance settings, and time settings.

## 13. Shorter-Plan Action

Create a Four-Day Plan generates a preview using the current requirements. The current longer plan remains unchanged until the user confirms saving.

## 14. Allergy and Dietary Protection

Budget messaging never recommends removing allergies or required dietary restrictions. Hard filters remain the source of truth.

## 15. Budget Status and Emergency Integration

The Budget Status panel and Emergency Plan result summary both consume the shared respectful message model.

## 16. Accessibility

Messages use headings, paragraphs, optional lists, accessible buttons, visible focus, and polite live regions. The interface does not rely on color alone.

## 17. Localization

Dynamic amounts, day counts, meal counts, and action counts are passed through helpers before display. Singular and plural wording is handled centrally.

## 18. Testing

Run syntax checks plus Budget Rescue, price confidence, Shopping List, Emergency Plan, and `tests/respectful-budget-messages-static.test.js`.
