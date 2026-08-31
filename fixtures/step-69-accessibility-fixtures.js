const step69RecipeFixture = Object.freeze({
  id: "step-69-spinach-mushroom-pasta",
  name: "Spinach and Mushroom Pasta",
  sourceLocale: "en-CA",
  version: 4,
  servings: 4,
  structuredIngredients: [
    {
      ingredientId: "spinach",
      displayName: "spinach",
      canonicalQuantity: { value: "200", unit: "g" },
      packageQuantity: { value: "300", unit: "g" },
      recipeUseQuantity: { value: "200", unit: "g" },
      purchaseQuantity: { value: "1", unit: "package" }
    },
    {
      ingredientId: "mushrooms",
      displayName: "mushrooms",
      canonicalQuantity: { value: "180", unit: "g" },
      packageQuantity: { value: "227", unit: "g" },
      recipeUseQuantity: { value: "180", unit: "g" },
      purchaseQuantity: { value: "1", unit: "package" }
    },
    {
      ingredientId: "vegetable-broth",
      displayName: "vegetable broth",
      canonicalQuantity: { value: "1.5", unit: "L" },
      packageQuantity: { value: "1", unit: "package" },
      recipeUseQuantity: { value: "1.5", unit: "L" },
      purchaseQuantity: { value: "2", unit: "package" }
    },
    {
      ingredientId: "whole-wheat-pasta",
      displayName: "whole wheat pasta",
      canonicalQuantity: { value: "340", unit: "g" },
      packageQuantity: { value: "450", unit: "g" },
      recipeUseQuantity: { value: "340", unit: "g" },
      purchaseQuantity: { value: "1", unit: "package" }
    }
  ],
  steps: [
    "Wash the spinach and mushrooms. Pat them dry before cooking.",
    "Bring 1.5 L vegetable broth to a gentle boil for 5 minutes.",
    "Sauté the mushrooms for 5 to 7 minutes, until lightly browned.",
    "快速翻炒（Sauté）洋葱，直到呈半透明（translucent）。",
    "Stir in the pasta and simmer for 10 minutes until tender.",
    "Fold in spinach and cook for 2 minutes until wilted.",
    "Check that hot food reaches at least 74°C / 165°F if reheated.",
    "Let the pasta stand for 2 minutes before serving."
  ],
  reviewSteps: [
    {
      id: "step-1",
      order: 1,
      primaryInstruction: "Wash the spinach and mushrooms. Pat them dry before cooking.",
      ingredientUsages: [
        { ingredientId: "spinach", canonicalQuantity: { value: "200", unit: "g" } },
        { ingredientId: "mushrooms", canonicalQuantity: { value: "180", unit: "g" } }
      ],
      donenessCues: [{ type: "visual", description: "Vegetables look clean and dry.", required: true }]
    },
    {
      id: "step-2",
      order: 2,
      primaryInstruction: "Bring 1.5 L vegetable broth to a gentle boil.",
      ingredientUsages: [{ ingredientId: "vegetable-broth", canonicalQuantity: { value: "1.5", unit: "L" } }],
      duration: { minimumSeconds: 300, maximumSeconds: 420, timerRecommended: true },
      donenessCues: [{ type: "visual", description: "Small bubbles rise steadily.", required: true }]
    },
    {
      id: "step-3",
      order: 3,
      primaryInstruction: "Sauté the mushrooms for 5 to 7 minutes, until lightly browned.",
      ingredientUsages: [{ ingredientId: "mushrooms", canonicalQuantity: { value: "180", unit: "g" } }],
      duration: { minimumSeconds: 300, maximumSeconds: 420, timerRecommended: true },
      techniqueTerms: ["Sauté"],
      donenessCues: [{ type: "colour", description: "Edges are lightly browned.", required: true }]
    },
    {
      id: "step-4",
      order: 4,
      primaryInstruction: "快速翻炒（Sauté）洋葱，直到呈半透明（translucent）。",
      languageSpans: [
        { text: "快速翻炒", lang: "zh-CN" },
        { text: "Sauté", lang: "en-CA" },
        { text: "半透明", lang: "zh-CN" },
        { text: "translucent", lang: "en-CA" }
      ],
      ingredientUsages: [],
      techniqueTerms: ["Sauté", "translucent"],
      donenessCues: [{ type: "visual", description: "Onions look translucent.", required: true }]
    },
    {
      id: "step-5",
      order: 5,
      primaryInstruction: "Stir in the pasta and simmer until tender.",
      ingredientUsages: [{ ingredientId: "whole-wheat-pasta", canonicalQuantity: { value: "340", unit: "g" } }],
      duration: { minimumSeconds: 480, maximumSeconds: 660, timerRecommended: true },
      donenessCues: [{ type: "texture", description: "Pasta is tender but not mushy.", required: true }]
    },
    {
      id: "step-6",
      order: 6,
      primaryInstruction: "Fold in spinach and cook until wilted.",
      ingredientUsages: [{ ingredientId: "spinach", canonicalQuantity: { value: "200", unit: "g" } }],
      donenessCues: [{ type: "texture", description: "Spinach is wilted and bright green.", required: true }]
    },
    {
      id: "step-7",
      order: 7,
      primaryInstruction: "Check that hot food reaches a safe serving temperature if reheated.",
      ingredientUsages: [],
      safetyTemperature: "Heat to at least 74°C / 165°F.",
      donenessCues: [{ type: "temperature", description: "Heat to at least 74°C / 165°F.", required: true }]
    },
    {
      id: "step-8",
      order: 8,
      primaryInstruction: "Let the pasta stand for 2 minutes before serving.",
      ingredientUsages: [],
      duration: { minimumSeconds: 120, timerRecommended: true },
      donenessCues: [{ type: "resting", description: "Sauce thickens slightly.", required: true }]
    }
  ],
  safetyWarnings: ["Heat to at least 74°C / 165°F when reheating leftovers."],
  allergyWarnings: ["Contains wheat. Check broth labels for soy or celery."],
  media: {
    images: [
      {
        id: "spinach-mushroom-doneness-image",
        purpose: "doneness-reference",
        altText: "Mushrooms with lightly browned edges beside wilted spinach."
      }
    ],
    videos: [
      {
        id: "spinach-mushroom-technique-video",
        captionTrack: { status: "approved", version: 4, locale: "en-CA" },
        transcript: {
          status: "approved",
          version: 4,
          locale: "en-CA",
          text: "00:00 Sauté mushrooms. 00:20 Stir in pasta. 00:50 Fold in spinach."
        },
        visualDescription: "The video shows the browning cue for mushrooms and the wilted cue for spinach."
      }
    ]
  },
  offlinePackage: {
    packageId: "offline-step-69-spinach-mushroom-pasta-v4",
    recipeId: "step-69-spinach-mushroom-pasta",
    recipeVersion: 4,
    includesTranscript: true,
    includesApprovedTranslations: ["en-CA", "fr-CA", "zh-CN"],
    includesSafetyWarnings: true,
    includesAllergyWarnings: true
  },
  translations: [
    {
      targetLocale: "fr-CA",
      sourceVersion: 4,
      status: "approved",
      reviewedBy: "fr-reviewer-required",
      sample: "Faire sauter les champignons de 5 a 7 minutes."
    },
    {
      targetLocale: "zh-CN",
      sourceVersion: 3,
      status: "outdated",
      sample: "旧版本说明。"
    },
    {
      targetLocale: "ar",
      sourceVersion: 4,
      status: "human-review-required",
      direction: "rtl",
      sample: "تعليمات عربية تحتاج إلى مراجعة بشرية."
    }
  ]
});

const step69PantryFixture = Object.freeze([
  { id: "pantry-spinach", ingredientId: "spinach", name: "spinach", quantity: { value: "300", unit: "g" }, dateType: "best-before", dateValue: "2026-08-20" },
  { id: "pantry-mushrooms", ingredientId: "mushrooms", name: "mushrooms", quantity: { value: "227", unit: "g" }, dateType: "estimated-days-remaining", daysRemaining: 2 },
  { id: "pantry-yogurt", ingredientId: "yogurt", name: "yogurt", quantity: { value: "650", unit: "g" }, dateType: "best-before", dateValue: "2026-08-22" }
]);

const speechPantryFixture = Object.freeze({
  spokenPhrase: "Two cans of tomatoes in the pantry.",
  expectedEditableInterpretation: {
    ingredientName: "tomatoes",
    quantity: 2,
    packageUnit: "can",
    canSizeStatus: "confirmation-required",
    autoSaveAllowed: false
  }
});

const languageBridgeFixture = Object.freeze({
  interfaceLocale: "en-CA",
  explanationLocale: "zh-CN",
  cookingTermLocale: "en-CA",
  expectedText: "快速翻炒（Sauté）洋葱，直到呈半透明（translucent）。",
  spans: [
    { text: "快速翻炒", lang: "zh-CN", term: "Sauté" },
    { text: "Sauté", lang: "en-CA" },
    { text: "半透明", lang: "zh-CN", term: "translucent" },
    { text: "translucent", lang: "en-CA" }
  ]
});

module.exports = {
  step69RecipeFixture,
  step69PantryFixture,
  speechPantryFixture,
  languageBridgeFixture
};
