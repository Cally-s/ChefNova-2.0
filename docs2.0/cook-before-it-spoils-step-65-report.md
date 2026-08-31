# Cook Before It Spoils Step 65 Report

## Goal

Localize Chef Nova measurements, dates, numbers, temperatures, safety thresholds, spoken measurement text, exports, and user display preferences without mutating canonical stored values.

## Files Created

- `scripts/localization-service.js`
- `tests/cook-before-it-spoils-step-65-localization-service.test.js`
- `docs/cook-before-it-spoils-step-65-report.md`

## Files Changed

- `index.html`
- `app.js`
- `style.css`

## Data-Model Changes

Step 65 adds a reusable canonical quantity adapter with this stable shape:

```json
{
  "value": "200",
  "unit": "g",
  "minimumValue": "optional decimal string",
  "maximumValue": "optional decimal string",
  "approximate": true
}
```

Canonical values use stable unit identifiers and decimal strings. Display conversion creates presentation objects only and does not rewrite saved recipe, Pantry, Shopping List, Budget Rescue, meal-plan, or export data.

Package, recipe-use, and purchase quantities remain separate through `createSeparatedQuantityModel()`.

## Migration and Backwards Compatibility

The localization service includes `migrateLegacyQuantity()` for existing `{ point, unit }`, numeric, and string quantity values. Existing saved data remains readable, and display preferences are stored separately:

- Registered users: `chefNovaLocalizationPreferences_<userId>`
- Guests: `chefNovaGuestLocalizationPreferences` in `sessionStorage`

Guest preferences remain temporary.

## Formatting and Conversion Utilities

New centralized utilities:

- `formatQuantity()`
- `formatIngredientQuantity()`
- `formatTemperature()`
- `formatSafetyTemperature()`
- `formatLocalizedNumber()`
- `formatDate()`
- `formatTime()`
- `formatDateTime()`
- `formatDuration()`
- `parseLocalizedNumber()`
- `convertQuantity()`
- `createMeasurementSpeechText()`
- `formatCommonFraction()`
- `createLocalizedExport()`
- `importLocalizedExport()`

The existing app helpers `formatQuantityForDisplay()`, `formatShoppingQuantity()`, `formatDate()`, and `formatProfileUpdatedDate()` now use the centralized service where available.

## Supported Locales and Units

Initial locales:

- `en-CA`
- `en-US`
- `fr-CA`
- `fr-FR`
- `zh-CN`
- `ar`

Initial canonical units include:

- `g`, `kg`, `mg`
- `mL`, `L`, `tsp`, `tbsp`, `cup`, `fl_oz`
- `oz`, `lb`
- `cm`, `in`
- `count`, `pinch`, `dash`, `clove`, `slice`, `can`, `package`, `bunch`
- `C`, `F`
- `minute`, `hour`

Mass-to-volume conversion is blocked unless verified density information is available.

## Safety-Temperature Handling

Safety temperatures use a dedicated threshold catalogue. The chicken internal-temperature threshold stores canonical `74` Celsius with approved display pair `74°C / 165°F`.

Safety formatting preserves the operator, approved Celsius/Fahrenheit pair, source metadata, and canonical value. It does not use ordinary recipe-temperature rounding.

## Accessibility Improvements

- Profile includes keyboard-accessible localization controls.
- Live preview updates use `aria-live`.
- Measurement preview uses `bdi` for mixed-direction text.
- RTL Arabic quantity display uses directionality isolation.
- Spoken measurement text uses expanded unit labels.
- Fractions include accessible labels.
- CSS includes responsive, high-contrast, reduced-motion, and print handling.

## Connected Chef Nova Workflow

Step 65 is connected to the Profile page through the new Regional Display section. Users can choose locale, measurement system, temperature display, hour cycle, and time zone. The live preview shows ingredient, volume, temperature, number, date, and time formatting.

The shared formatting helpers are used by existing Chef Nova surfaces that call common quantity/date display functions, including Pantry, Shopping List, Meal Planner allocation summaries, Budget Rescue summaries, Food Rescue/Impact views, notifications, and profile timestamps.

## Tests Added

`tests/cook-before-it-spoils-step-65-localization-service.test.js` covers:

- Canonical values unchanged by locale or measurement changes.
- English Canada metric display.
- French Canada decimal-comma display and parsing.
- Simplified Chinese ingredient ordering.
- Imperial display from canonical grams.
- No repeated-conversion drift.
- Ordinary temperature conversion.
- Safety temperature approved pairs.
- Package, recipe-use, and purchase quantity separation.
- Arabic RTL mixed-direction display.
- Locale-specific dates and time-zone display changes.
- Structured export/import canonical preservation.
- Density-required mass-to-volume blocking.
- Singular/plural unit grammar.
- Fraction display with accessible labels.
- Unknown-unit graceful failure.
- TTS expanded measurement text.
- App, HTML, and CSS integration anchors.

## Commands Run

```text
node --check app.js
node --check rules.js
node --check scripts/localization-service.js
node --check tests/cook-before-it-spoils-step-65-localization-service.test.js
node tests/cook-before-it-spoils-step-65-localization-service.test.js
node tests/cook-before-it-spoils-step-64-missing-prices-and-quantities.test.js
node tests/cook-before-it-spoils-step-38-shopping-list-integration-static.test.js
node tests/cook-before-it-spoils-step-50-partial-packages-static.test.js
node tests/price-confidence-static.test.js
node tests/respectful-budget-messages-static.test.js
```

## Test, Lint, Type-Check, and Build Results

- Syntax result: passed for `app.js`, `rules.js`, `scripts/localization-service.js`, and the Step 65 test file.
- Step 65 test result: passed.
- Related regression result: passed for Step 64 missing data, Step 38 Shopping List integration, Step 50 partial packages, price confidence, and respectful budget messages.
- Lint result: not applicable; no project lint command is available.
- Type-check result: not applicable; plain JavaScript project.
- Build result: not applicable; direct `index.html` app.

## Remaining Limitations

- Ingredient translations are seeded for required fixtures and structured for expansion.
- Verified ingredient-specific density profiles are not yet populated broadly, so unsafe mass-to-volume conversion remains blocked.
- The implementation connects shared formatting helpers and Profile controls; some deeply embedded one-off strings may still need follow-up replacement in later localization hardening.
