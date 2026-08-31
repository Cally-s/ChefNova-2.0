window.CHEF_NOVA_RECIPES = [
  {
    "id": "pasta",
    "name": "Pasta",
    "category": "Dinner",
    "subcategory": "Pasta",
    "cuisine": "Italian",
    "dietaryTags": [
      "Vegetarian"
    ],
    "ingredients": [
      {
        "name": "pasta",
        "quantity": 2,
        "unit": "cups"
      },
      {
        "name": "tomato sauce",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "garlic",
        "quantity": 2,
        "unit": "cloves"
      },
      {
        "name": "olive oil",
        "quantity": 1,
        "unit": "tbsp"
      },
      {
        "name": "parmesan",
        "quantity": 0.25,
        "unit": "cup"
      },
      {
        "name": "basil",
        "quantity": 2,
        "unit": "tbsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "chili flakes",
        "quantity": 0.5,
        "unit": "tsp"
      }
    ],
    "steps": [
      "Boil pasta until al dente.",
      "Warm olive oil and garlic in a pan.",
      "Stir in tomato sauce and simmer for 5 minutes.",
      "Toss pasta with sauce, parmesan, and basil."
    ],
    "cookingTime": 25,
    "preparationTime": 10,
    "difficulty": "Easy",
    "servings": 2,
    "calories": 520,
    "protein": 18,
    "carbohydrates": 78,
    "fat": 16,
    "allergies": [
      "Gluten",
      "Dairy"
    ],
    "image": "images/pasta.jpg",
    "keywords": [
      "pasta",
      "tomato",
      "quick dinner"
    ],
    "totalTime": 35,
    "sugar": 7,
    "vegetableServings": 1,
    "fibre": 5,
    "addedSugar": 1,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "pasta",
        "displayName": "Pasta",
        "displayText": "2 cups pasta",
        "quantity": 2,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": "pasta",
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "tomato-sauce",
        "displayName": "Tomato sauce",
        "displayText": "1 cup tomato sauce",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": "tomato-sauce",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "garlic",
        "displayName": "Garlic",
        "displayText": "2 cloves garlic",
        "quantity": 2,
        "quantityMax": null,
        "unit": "clove",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": "fresh",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "olive-oil",
        "displayName": "Olive oil",
        "displayText": "1 tbsp olive oil",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "oils-fats",
        "substituteGroup": "cooking-oil",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "parmesan",
        "displayName": "Parmesan",
        "displayText": "0.25 cup parmesan",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "cheese",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "basil",
        "displayName": "Basil",
        "displayText": "2 tbsp basil",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "herbs-spices",
        "substituteGroup": "fresh-herbs",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "chili-flakes",
        "displayName": "Chili flakes",
        "displayText": "0.5 tsp chili flakes",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "tsp",
        "optional": true,
        "category": "herbs-spices",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": true,
      "baseServings": 2,
      "minimumServings": 2,
      "maximumServings": 8,
      "scalingMode": "continuous",
      "servingIncrement": 1,
      "maximumServingsPerBatch": 4,
      "maximumBatchCount": 2,
      "batchTimeModel": {
        "type": "base-plus-additional-batch",
        "baseSessionMinutes": 35,
        "additionalBatchMinutes": 25
      }
    },
    "leftovers": {
      "supported": true,
      "supportedStorageMethods": [
        "refrigerated"
      ],
      "storageWindowDays": 2,
      "supportedTargetMealTypes": [
        "lunch",
        "dinner"
      ],
      "minimumLeftoverServings": 1,
      "reheatingMethods": [
        {
          "id": "microwave",
          "requiredAppliances": [
            "microwave"
          ],
          "reheatingTimeMinutes": 4,
          "requiresFullCookingSession": false
        },
        {
          "id": "stovetop",
          "requiredAppliances": [
            "stove"
          ],
          "reheatingTimeMinutes": 8,
          "requiresFullCookingSession": false
        }
      ]
    }
  },
  {
    "id": "fried-rice",
    "name": "Fried Rice",
    "category": "Dinner",
    "subcategory": "Rice",
    "cuisine": "Asian",
    "dietaryTags": [],
    "ingredients": [
      {
        "name": "rice",
        "quantity": 2,
        "unit": "cups"
      },
      {
        "name": "egg",
        "quantity": 2,
        "unit": "pieces"
      },
      {
        "name": "peas",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "carrots",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "soy sauce",
        "quantity": 2,
        "unit": "tbsp"
      },
      {
        "name": "green onion",
        "quantity": 2,
        "unit": "pieces"
      }
    ],
    "optionalIngredients": [
      {
        "name": "sesame oil",
        "quantity": 1,
        "unit": "tsp"
      }
    ],
    "steps": [
      "Scramble eggs and set aside.",
      "Stir-fry carrots and peas until tender.",
      "Add rice and soy sauce.",
      "Fold in eggs and green onion before serving."
    ],
    "cookingTime": 20,
    "preparationTime": 10,
    "difficulty": "Easy",
    "servings": 2,
    "calories": 430,
    "protein": 14,
    "carbohydrates": 66,
    "fat": 12,
    "allergies": [
      "Egg",
      "Soy",
      "Gluten"
    ],
    "image": "images/fried-rice.jpg",
    "keywords": [
      "rice",
      "egg",
      "quick dinner"
    ],
    "totalTime": 30,
    "sugar": 4,
    "vegetableServings": 1.5,
    "fibre": 4,
    "addedSugar": 1,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "rice",
        "displayName": "Rice",
        "displayText": "2 cups rice",
        "quantity": 2,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": "rice",
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "egg",
        "displayName": "Egg",
        "displayText": "2 pieces egg",
        "quantity": 2,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "eggs",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "peas",
        "displayName": "Peas",
        "displayText": "0.5 cup peas",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": "frozen",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "carrots",
        "displayName": "Carrots",
        "displayText": "0.5 cup carrots",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "soy-sauce",
        "displayName": "Soy sauce",
        "displayText": "2 tbsp soy sauce",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": "soy-sauce",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "green-onion",
        "displayName": "Green onion",
        "displayText": "2 pieces green onion",
        "quantity": 2,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "sesame-oil",
        "displayName": "Sesame oil",
        "displayText": "1 tsp sesame oil",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tsp",
        "optional": true,
        "category": "oils-fats",
        "substituteGroup": "cooking-oil",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": true,
      "baseServings": 2,
      "minimumServings": 2,
      "maximumServings": 6,
      "scalingMode": "continuous",
      "servingIncrement": 1,
      "maximumServingsPerBatch": 3,
      "maximumBatchCount": 2,
      "batchTimeModel": {
        "type": "base-plus-additional-batch",
        "baseSessionMinutes": 30,
        "additionalBatchMinutes": 20
      }
    },
    "leftovers": {
      "supported": true,
      "supportedStorageMethods": [
        "refrigerated"
      ],
      "storageWindowDays": 2,
      "supportedTargetMealTypes": [
        "lunch",
        "dinner"
      ],
      "minimumLeftoverServings": 1,
      "reheatingMethods": [
        {
          "id": "microwave",
          "requiredAppliances": [
            "microwave"
          ],
          "reheatingTimeMinutes": 4,
          "requiresFullCookingSession": false
        },
        {
          "id": "stovetop",
          "requiredAppliances": [
            "stove"
          ],
          "reheatingTimeMinutes": 8,
          "requiresFullCookingSession": false
        }
      ]
    }
  },
  {
    "id": "chicken-wrap",
    "name": "Chicken Wrap",
    "category": "Lunch",
    "subcategory": "Chicken",
    "cuisine": "American",
    "dietaryTags": [
      "High Protein"
    ],
    "ingredients": [
      {
        "name": "chicken",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "tortilla",
        "quantity": 2,
        "unit": "pieces"
      },
      {
        "name": "lettuce",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "tomato",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "cheddar",
        "quantity": 0.25,
        "unit": "cup"
      },
      {
        "name": "yogurt sauce",
        "quantity": 2,
        "unit": "tbsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "avocado",
        "quantity": 0.5,
        "unit": "piece"
      }
    ],
    "steps": [
      "Warm the tortilla.",
      "Slice cooked chicken.",
      "Layer lettuce, tomato, chicken, cheddar, and sauce.",
      "Roll tightly and toast if desired."
    ],
    "cookingTime": 10,
    "preparationTime": 10,
    "difficulty": "Easy",
    "servings": 2,
    "calories": 470,
    "protein": 32,
    "carbohydrates": 42,
    "fat": 18,
    "allergies": [
      "Gluten",
      "Dairy"
    ],
    "image": "images/chicken-wrap.jpg",
    "keywords": [
      "chicken",
      "wrap",
      "lunch"
    ],
    "totalTime": 20,
    "sugar": 5,
    "vegetableServings": 1,
    "fibre": 4,
    "addedSugar": 1,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "chicken",
        "displayName": "Chicken",
        "displayText": "1 cup chicken",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "meat",
        "substituteGroup": "poultry",
        "form": "cooked",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "tortilla",
        "displayName": "Tortilla",
        "displayText": "2 pieces tortilla",
        "quantity": 2,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "bakery",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "lettuce",
        "displayName": "Lettuce",
        "displayText": "1 cup lettuce",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": "leafy-greens",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "tomato",
        "displayName": "Tomato",
        "displayText": "1 piece tomato",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "cheddar",
        "displayName": "Cheddar",
        "displayText": "0.25 cup cheddar",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "cheese",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "yogurt-sauce",
        "displayName": "Yogurt sauce",
        "displayText": "2 tbsp yogurt sauce",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "yogurt-sauce",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "avocado",
        "displayName": "Avocado",
        "displayText": "0.5 piece avocado",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "piece",
        "optional": true,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    },
    "preparationMethods": [
      {
        "id": "ready-to-assemble",
        "methodType": "ready-to-assemble",
        "requiredApplianceIds": [],
        "totalTimeMinutes": 10,
        "activeTimeMinutes": 10,
        "validated": true
      }
    ]
  },
  {
    "id": "vegetable-soup",
    "name": "Vegetable Soup",
    "category": "Lunch",
    "subcategory": "Vegetarian",
    "cuisine": "Global",
    "dietaryTags": [
      "Vegetarian",
      "Vegan",
      "Dairy-Free"
    ],
    "ingredients": [
      {
        "name": "carrots",
        "quantity": 2,
        "unit": "pieces"
      },
      {
        "name": "celery",
        "quantity": 2,
        "unit": "stalks"
      },
      {
        "name": "onion",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "potatoes",
        "quantity": 2,
        "unit": "pieces"
      },
      {
        "name": "vegetable stock",
        "quantity": 4,
        "unit": "cups"
      },
      {
        "name": "tomato",
        "quantity": 1,
        "unit": "piece"
      }
    ],
    "optionalIngredients": [
      {
        "name": "parsley",
        "quantity": 2,
        "unit": "tbsp"
      }
    ],
    "steps": [
      "Saute onion, carrots, and celery.",
      "Add potatoes, tomato, and vegetable stock.",
      "Simmer until vegetables are tender.",
      "Season and serve warm."
    ],
    "cookingTime": 35,
    "preparationTime": 12,
    "difficulty": "Easy",
    "servings": 4,
    "calories": 260,
    "protein": 8,
    "carbohydrates": 52,
    "fat": 4,
    "allergies": [
      "None"
    ],
    "image": "images/vegetable-soup.jpg",
    "keywords": [
      "soup",
      "vegetables",
      "vegan",
      "soups"
    ],
    "totalTime": 47,
    "sugar": 9,
    "vegetableServings": 2.5,
    "fibre": 8,
    "addedSugar": 0,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "carrots",
        "displayName": "Carrots",
        "displayText": "2 pieces carrots",
        "quantity": 2,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "celery",
        "displayName": "Celery",
        "displayText": "2 stalks celery",
        "quantity": 2,
        "quantityMax": null,
        "unit": "stalk",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "onion",
        "displayName": "Onion",
        "displayText": "1 piece onion",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "potatoes",
        "displayName": "Potatoes",
        "displayText": "2 pieces potatoes",
        "quantity": 2,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "vegetable-stock",
        "displayName": "Vegetable stock",
        "displayText": "4 cups vegetable stock",
        "quantity": 4,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "other",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "tomato",
        "displayName": "Tomato",
        "displayText": "1 piece tomato",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "parsley",
        "displayName": "Parsley",
        "displayText": "2 tbsp parsley",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": true,
        "category": "herbs-spices",
        "substituteGroup": "fresh-herbs",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": true,
      "baseServings": 4,
      "minimumServings": 4,
      "maximumServings": 8,
      "scalingMode": "continuous",
      "servingIncrement": 1,
      "maximumServingsPerBatch": 4,
      "maximumBatchCount": 2,
      "batchTimeModel": {
        "type": "base-plus-additional-batch",
        "baseSessionMinutes": 47,
        "additionalBatchMinutes": 25
      }
    },
    "leftovers": {
      "supported": true,
      "supportedStorageMethods": [
        "refrigerated"
      ],
      "storageWindowDays": 2,
      "supportedTargetMealTypes": [
        "lunch",
        "dinner"
      ],
      "minimumLeftoverServings": 1,
      "reheatingMethods": [
        {
          "id": "microwave",
          "requiredAppliances": [
            "microwave"
          ],
          "reheatingTimeMinutes": 4,
          "requiresFullCookingSession": false
        },
        {
          "id": "stovetop",
          "requiredAppliances": [
            "stove"
          ],
          "reheatingTimeMinutes": 8,
          "requiresFullCookingSession": false
        }
      ]
    }
  },
  {
    "id": "omelette",
    "name": "Omelette",
    "category": "Breakfast",
    "subcategory": "Eggs",
    "cuisine": "French",
    "dietaryTags": [
      "Vegetarian",
      "High Protein"
    ],
    "ingredients": [
      {
        "name": "egg",
        "quantity": 3,
        "unit": "pieces"
      },
      {
        "name": "milk",
        "quantity": 2,
        "unit": "tbsp"
      },
      {
        "name": "cheddar",
        "quantity": 0.25,
        "unit": "cup"
      },
      {
        "name": "spinach",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "mushrooms",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "butter",
        "quantity": 1,
        "unit": "tsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "chives",
        "quantity": 1,
        "unit": "tbsp"
      }
    ],
    "steps": [
      "Whisk eggs with milk.",
      "Cook mushrooms and spinach in butter.",
      "Pour in eggs and cook gently.",
      "Add cheddar, fold, and serve."
    ],
    "cookingTime": 8,
    "preparationTime": 5,
    "difficulty": "Easy",
    "servings": 1,
    "calories": 350,
    "protein": 24,
    "carbohydrates": 7,
    "fat": 25,
    "allergies": [
      "Egg",
      "Dairy"
    ],
    "image": "images/omelette.jpg",
    "keywords": [
      "egg",
      "breakfast",
      "quick"
    ],
    "totalTime": 13,
    "sugar": 2,
    "vegetableServings": 0.5,
    "fibre": 2,
    "addedSugar": 0,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "egg",
        "displayName": "Egg",
        "displayText": "3 pieces egg",
        "quantity": 3,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "eggs",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "milk",
        "displayName": "Milk",
        "displayText": "2 tbsp milk",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "milk",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "cheddar",
        "displayName": "Cheddar",
        "displayText": "0.25 cup cheddar",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "cheese",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "spinach",
        "displayName": "Spinach",
        "displayText": "0.5 cup spinach",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": "leafy-greens",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "mushrooms",
        "displayName": "Mushrooms",
        "displayText": "0.5 cup mushrooms",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "butter",
        "displayName": "Butter",
        "displayText": "1 tsp butter",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tsp",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "cooking-fat",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "chives",
        "displayName": "Chives",
        "displayText": "1 tbsp chives",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": true,
        "category": "herbs-spices",
        "substituteGroup": "fresh-herbs",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "salmon-bowl",
    "name": "Salmon Bowl",
    "category": "Dinner",
    "subcategory": "Seafood",
    "cuisine": "Japanese-inspired",
    "dietaryTags": [
      "Pescatarian",
      "High Protein"
    ],
    "ingredients": [
      {
        "name": "salmon",
        "quantity": 1,
        "unit": "fillet"
      },
      {
        "name": "rice",
        "quantity": 1.5,
        "unit": "cups"
      },
      {
        "name": "cucumber",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "avocado",
        "quantity": 0.5,
        "unit": "piece"
      },
      {
        "name": "soy sauce",
        "quantity": 1,
        "unit": "tbsp"
      },
      {
        "name": "sesame seeds",
        "quantity": 1,
        "unit": "tsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "nori",
        "quantity": 1,
        "unit": "sheet"
      }
    ],
    "steps": [
      "Cook rice.",
      "Sear or bake salmon until flaky.",
      "Slice cucumber and avocado.",
      "Assemble the bowl with soy sauce and sesame seeds."
    ],
    "cookingTime": 20,
    "preparationTime": 10,
    "difficulty": "Medium",
    "servings": 1,
    "calories": 610,
    "protein": 38,
    "carbohydrates": 58,
    "fat": 24,
    "allergies": [
      "Fish",
      "Soy",
      "Sesame"
    ],
    "image": "images/salmon-bowl.jpg",
    "keywords": [
      "salmon",
      "rice",
      "seafood"
    ],
    "totalTime": 30,
    "sugar": 6,
    "vegetableServings": 1.5,
    "fibre": 6,
    "addedSugar": 1,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "salmon",
        "displayName": "Salmon",
        "displayText": "1 fillet salmon",
        "quantity": 1,
        "quantityMax": null,
        "unit": "fillet",
        "optional": false,
        "category": "seafood",
        "substituteGroup": "seafood",
        "form": "cooked",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "rice",
        "displayName": "Rice",
        "displayText": "1.5 cups rice",
        "quantity": 1.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": "rice",
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "cucumber",
        "displayName": "Cucumber",
        "displayText": "0.5 cup cucumber",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "avocado",
        "displayName": "Avocado",
        "displayText": "0.5 piece avocado",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "soy-sauce",
        "displayName": "Soy sauce",
        "displayText": "1 tbsp soy sauce",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": "soy-sauce",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "sesame-seeds",
        "displayName": "Sesame seeds",
        "displayText": "1 tsp sesame seeds",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tsp",
        "optional": false,
        "category": "other",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "nori",
        "displayName": "Nori",
        "displayText": "1 sheet nori",
        "quantity": 1,
        "quantityMax": null,
        "unit": "sheet",
        "optional": true,
        "category": "other",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "beef-stir-fry",
    "name": "Beef Stir Fry",
    "category": "Dinner",
    "subcategory": "Beef",
    "cuisine": "Asian",
    "dietaryTags": [
      "High Protein"
    ],
    "ingredients": [
      {
        "name": "beef",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "broccoli",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "bell pepper",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "garlic",
        "quantity": 2,
        "unit": "cloves"
      },
      {
        "name": "soy sauce",
        "quantity": 2,
        "unit": "tbsp"
      },
      {
        "name": "rice",
        "quantity": 1.5,
        "unit": "cups"
      }
    ],
    "optionalIngredients": [
      {
        "name": "ginger",
        "quantity": 1,
        "unit": "tsp"
      }
    ],
    "steps": [
      "Slice beef thinly.",
      "Stir-fry beef until browned.",
      "Add broccoli, bell pepper, and garlic.",
      "Finish with soy sauce and serve over rice."
    ],
    "cookingTime": 18,
    "preparationTime": 12,
    "difficulty": "Medium",
    "servings": 2,
    "calories": 560,
    "protein": 36,
    "carbohydrates": 54,
    "fat": 20,
    "allergies": [
      "Soy",
      "Gluten"
    ],
    "image": "images/beef-stir-fry.jpg",
    "keywords": [
      "beef",
      "stir fry",
      "rice"
    ],
    "totalTime": 30,
    "sugar": 8,
    "vegetableServings": 2,
    "fibre": 5,
    "addedSugar": 2,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "beef",
        "displayName": "Beef",
        "displayText": "1 cup beef",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "meat",
        "substituteGroup": "beef",
        "form": "cooked",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "broccoli",
        "displayName": "Broccoli",
        "displayText": "1 cup broccoli",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "bell-pepper",
        "displayName": "Bell pepper",
        "displayText": "1 piece bell pepper",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "garlic",
        "displayName": "Garlic",
        "displayText": "2 cloves garlic",
        "quantity": 2,
        "quantityMax": null,
        "unit": "clove",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": "fresh",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "soy-sauce",
        "displayName": "Soy sauce",
        "displayText": "2 tbsp soy sauce",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": "soy-sauce",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "rice",
        "displayName": "Rice",
        "displayText": "1.5 cups rice",
        "quantity": 1.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": "rice",
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "ginger",
        "displayName": "Ginger",
        "displayText": "1 tsp ginger",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tsp",
        "optional": true,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": true,
      "baseServings": 2,
      "minimumServings": 2,
      "maximumServings": 6,
      "scalingMode": "continuous",
      "servingIncrement": 1,
      "maximumServingsPerBatch": 3,
      "maximumBatchCount": 2,
      "batchTimeModel": {
        "type": "base-plus-additional-batch",
        "baseSessionMinutes": 30,
        "additionalBatchMinutes": 22
      }
    },
    "leftovers": {
      "supported": true,
      "supportedStorageMethods": [
        "refrigerated"
      ],
      "storageWindowDays": 2,
      "supportedTargetMealTypes": [
        "lunch",
        "dinner"
      ],
      "minimumLeftoverServings": 1,
      "reheatingMethods": [
        {
          "id": "microwave",
          "requiredAppliances": [
            "microwave"
          ],
          "reheatingTimeMinutes": 4,
          "requiresFullCookingSession": false
        },
        {
          "id": "stovetop",
          "requiredAppliances": [
            "stove"
          ],
          "reheatingTimeMinutes": 8,
          "requiresFullCookingSession": false
        }
      ]
    }
  },
  {
    "id": "tofu-noodles",
    "name": "Tofu Noodles",
    "category": "Dinner",
    "subcategory": "Vegan",
    "cuisine": "Asian",
    "dietaryTags": [
      "Vegetarian",
      "Vegan",
      "Dairy-Free"
    ],
    "ingredients": [
      {
        "name": "tofu",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "noodles",
        "quantity": 2,
        "unit": "cups"
      },
      {
        "name": "broccoli",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "carrots",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "soy sauce",
        "quantity": 2,
        "unit": "tbsp"
      },
      {
        "name": "ginger",
        "quantity": 1,
        "unit": "tsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "lime",
        "quantity": 0.5,
        "unit": "piece"
      }
    ],
    "steps": [
      "Press and cube tofu.",
      "Cook noodles.",
      "Stir-fry tofu, broccoli, carrots, and ginger.",
      "Toss with noodles and soy sauce."
    ],
    "cookingTime": 18,
    "preparationTime": 10,
    "difficulty": "Easy",
    "servings": 2,
    "calories": 480,
    "protein": 22,
    "carbohydrates": 62,
    "fat": 15,
    "allergies": [
      "Soy",
      "Gluten"
    ],
    "image": "images/tofu-noodles.jpg",
    "keywords": [
      "tofu",
      "noodles",
      "vegan"
    ],
    "totalTime": 28,
    "sugar": 7,
    "vegetableServings": 1.5,
    "fibre": 6,
    "addedSugar": 2,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "tofu",
        "displayName": "Tofu",
        "displayText": "1 cup tofu",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "legumes",
        "substituteGroup": "plant-protein",
        "form": "cooked",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "noodles",
        "displayName": "Noodles",
        "displayText": "2 cups noodles",
        "quantity": 2,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": "noodles",
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "broccoli",
        "displayName": "Broccoli",
        "displayText": "1 cup broccoli",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "carrots",
        "displayName": "Carrots",
        "displayText": "0.5 cup carrots",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "soy-sauce",
        "displayName": "Soy sauce",
        "displayText": "2 tbsp soy sauce",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": "soy-sauce",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "ginger",
        "displayName": "Ginger",
        "displayText": "1 tsp ginger",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tsp",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "lime",
        "displayName": "Lime",
        "displayText": "0.5 piece lime",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "piece",
        "optional": true,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": true,
      "baseServings": 2,
      "minimumServings": 2,
      "maximumServings": 6,
      "scalingMode": "continuous",
      "servingIncrement": 1,
      "maximumServingsPerBatch": 3,
      "maximumBatchCount": 2,
      "batchTimeModel": {
        "type": "base-plus-additional-batch",
        "baseSessionMinutes": 28,
        "additionalBatchMinutes": 20
      }
    },
    "leftovers": {
      "supported": true,
      "supportedStorageMethods": [
        "refrigerated"
      ],
      "storageWindowDays": 2,
      "supportedTargetMealTypes": [
        "lunch",
        "dinner"
      ],
      "minimumLeftoverServings": 1,
      "reheatingMethods": [
        {
          "id": "microwave",
          "requiredAppliances": [
            "microwave"
          ],
          "reheatingTimeMinutes": 4,
          "requiresFullCookingSession": false
        },
        {
          "id": "stovetop",
          "requiredAppliances": [
            "stove"
          ],
          "reheatingTimeMinutes": 8,
          "requiresFullCookingSession": false
        }
      ]
    }
  },
  {
    "id": "pancakes",
    "name": "Pancakes",
    "category": "Desserts",
    "subcategory": "Desserts",
    "cuisine": "American",
    "dietaryTags": [
      "Vegetarian"
    ],
    "ingredients": [
      {
        "name": "flour",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "egg",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "milk",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "baking powder",
        "quantity": 2,
        "unit": "tsp"
      },
      {
        "name": "butter",
        "quantity": 1,
        "unit": "tbsp"
      },
      {
        "name": "maple syrup",
        "quantity": 2,
        "unit": "tbsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "berries",
        "quantity": 0.5,
        "unit": "cup"
      }
    ],
    "steps": [
      "Whisk dry ingredients.",
      "Mix in eggs and milk.",
      "Cook batter on a buttered skillet.",
      "Serve with maple syrup."
    ],
    "cookingTime": 15,
    "preparationTime": 8,
    "difficulty": "Easy",
    "servings": 2,
    "calories": 430,
    "protein": 12,
    "carbohydrates": 68,
    "fat": 13,
    "allergies": [
      "Gluten",
      "Egg",
      "Dairy"
    ],
    "image": "images/pancakes.jpg",
    "keywords": [
      "pancakes",
      "breakfast",
      "sweet",
      "dessert"
    ],
    "totalTime": 23,
    "sugar": 18,
    "vegetableServings": 0,
    "fibre": 2,
    "addedSugar": 14,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "flour",
        "displayName": "Flour",
        "displayText": "1 cup flour",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": null,
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "egg",
        "displayName": "Egg",
        "displayText": "1 piece egg",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "eggs",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "milk",
        "displayName": "Milk",
        "displayText": "1 cup milk",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "milk",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "baking-powder",
        "displayName": "Baking powder",
        "displayText": "2 tsp baking powder",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tsp",
        "optional": false,
        "category": "bakery",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "butter",
        "displayName": "Butter",
        "displayText": "1 tbsp butter",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "cooking-fat",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "maple-syrup",
        "displayName": "Maple syrup",
        "displayText": "2 tbsp maple syrup",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "sweeteners",
        "substituteGroup": "sweetener",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "berries",
        "displayName": "Berries",
        "displayText": "0.5 cup berries",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": true,
        "category": "produce",
        "substituteGroup": null,
        "form": "frozen",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "caesar-salad",
    "name": "Caesar Salad",
    "category": "Lunch",
    "subcategory": "Lunch",
    "cuisine": "Italian-American",
    "dietaryTags": [],
    "ingredients": [
      {
        "name": "romaine",
        "quantity": 2,
        "unit": "cups"
      },
      {
        "name": "croutons",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "parmesan",
        "quantity": 0.25,
        "unit": "cup"
      },
      {
        "name": "caesar dressing",
        "quantity": 3,
        "unit": "tbsp"
      },
      {
        "name": "lemon",
        "quantity": 0.5,
        "unit": "piece"
      },
      {
        "name": "black pepper",
        "quantity": 0.25,
        "unit": "tsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "chicken",
        "quantity": 1,
        "unit": "cup"
      }
    ],
    "steps": [
      "Chop romaine.",
      "Toss with caesar dressing and lemon.",
      "Add croutons and parmesan.",
      "Finish with black pepper."
    ],
    "cookingTime": 0,
    "preparationTime": 10,
    "difficulty": "Easy",
    "servings": 2,
    "calories": 310,
    "protein": 11,
    "carbohydrates": 18,
    "fat": 22,
    "allergies": [
      "Gluten",
      "Dairy",
      "Fish"
    ],
    "image": "images/caesar-salad.jpg",
    "keywords": [
      "salad",
      "romaine",
      "quick lunch",
      "salads"
    ],
    "totalTime": 10,
    "sugar": 3,
    "vegetableServings": 2,
    "fibre": 4,
    "addedSugar": 1,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "romaine",
        "displayName": "Romaine",
        "displayText": "2 cups romaine",
        "quantity": 2,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": "leafy-greens",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "croutons",
        "displayName": "Croutons",
        "displayText": "0.5 cup croutons",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "bakery",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "parmesan",
        "displayName": "Parmesan",
        "displayText": "0.25 cup parmesan",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "cheese",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "caesar-dressing",
        "displayName": "Caesar dressing",
        "displayText": "3 tbsp caesar dressing",
        "quantity": 3,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "lemon",
        "displayName": "Lemon",
        "displayText": "0.5 piece lemon",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "black-pepper",
        "displayName": "Black pepper",
        "displayText": "0.25 tsp black pepper",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "tsp",
        "optional": false,
        "category": "herbs-spices",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "chicken",
        "displayName": "Chicken",
        "displayText": "1 cup chicken",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": true,
        "category": "meat",
        "substituteGroup": "poultry",
        "form": "cooked",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    },
    "preparationMethods": [
      {
        "id": "serve-cold",
        "methodType": "serve-cold",
        "requiredApplianceIds": [],
        "totalTimeMinutes": 10,
        "activeTimeMinutes": 10,
        "validated": true
      }
    ]
  },
  {
    "id": "chicken-curry",
    "name": "Chicken Curry",
    "category": "Dinner",
    "subcategory": "Chicken",
    "cuisine": "Indian-inspired",
    "dietaryTags": [
      "High Protein",
      "Dairy-Free"
    ],
    "ingredients": [
      {
        "name": "chicken",
        "quantity": 1.5,
        "unit": "cups"
      },
      {
        "name": "rice",
        "quantity": 2,
        "unit": "cups"
      },
      {
        "name": "coconut milk",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "curry powder",
        "quantity": 2,
        "unit": "tbsp"
      },
      {
        "name": "onion",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "garlic",
        "quantity": 2,
        "unit": "cloves"
      }
    ],
    "optionalIngredients": [
      {
        "name": "cilantro",
        "quantity": 2,
        "unit": "tbsp"
      }
    ],
    "steps": [
      "Saute onion and garlic.",
      "Add chicken and curry powder.",
      "Pour in coconut milk and simmer.",
      "Serve over rice."
    ],
    "cookingTime": 25,
    "preparationTime": 10,
    "difficulty": "Medium",
    "servings": 3,
    "calories": 650,
    "protein": 40,
    "carbohydrates": 60,
    "fat": 28,
    "allergies": [
      "None"
    ],
    "image": "images/chicken-curry.jpg",
    "keywords": [
      "chicken",
      "curry",
      "rice"
    ],
    "totalTime": 35,
    "sugar": 8,
    "vegetableServings": 1.5,
    "fibre": 4,
    "addedSugar": 1,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "chicken",
        "displayName": "Chicken",
        "displayText": "1.5 cups chicken",
        "quantity": 1.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "meat",
        "substituteGroup": "poultry",
        "form": "cooked",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "rice",
        "displayName": "Rice",
        "displayText": "2 cups rice",
        "quantity": 2,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": "rice",
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "coconut-milk",
        "displayName": "Coconut milk",
        "displayText": "1 cup coconut milk",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy-alternatives",
        "substituteGroup": "plant-milk",
        "form": "canned",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "curry-powder",
        "displayName": "Curry powder",
        "displayText": "2 tbsp curry powder",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "herbs-spices",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "onion",
        "displayName": "Onion",
        "displayText": "1 piece onion",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "garlic",
        "displayName": "Garlic",
        "displayText": "2 cloves garlic",
        "quantity": 2,
        "quantityMax": null,
        "unit": "clove",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": "fresh",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "cilantro",
        "displayName": "Cilantro",
        "displayText": "2 tbsp cilantro",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": true,
        "category": "herbs-spices",
        "substituteGroup": "fresh-herbs",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": true,
      "baseServings": 3,
      "minimumServings": 3,
      "maximumServings": 6,
      "scalingMode": "continuous",
      "servingIncrement": 1,
      "maximumServingsPerBatch": 3,
      "maximumBatchCount": 2,
      "batchTimeModel": {
        "type": "base-plus-additional-batch",
        "baseSessionMinutes": 35,
        "additionalBatchMinutes": 25
      }
    },
    "leftovers": {
      "supported": true,
      "supportedStorageMethods": [
        "refrigerated"
      ],
      "storageWindowDays": 2,
      "supportedTargetMealTypes": [
        "lunch",
        "dinner"
      ],
      "minimumLeftoverServings": 1,
      "reheatingMethods": [
        {
          "id": "microwave",
          "requiredAppliances": [
            "microwave"
          ],
          "reheatingTimeMinutes": 4,
          "requiresFullCookingSession": false
        },
        {
          "id": "stovetop",
          "requiredAppliances": [
            "stove"
          ],
          "reheatingTimeMinutes": 8,
          "requiresFullCookingSession": false
        }
      ]
    }
  },
  {
    "id": "smoothie-bowl",
    "name": "Smoothie Bowl",
    "category": "Breakfast",
    "subcategory": "Drinks",
    "cuisine": "American",
    "dietaryTags": [
      "Vegetarian"
    ],
    "ingredients": [
      {
        "name": "banana",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "berries",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "yogurt",
        "quantity": 0.75,
        "unit": "cup"
      },
      {
        "name": "granola",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "honey",
        "quantity": 1,
        "unit": "tbsp"
      },
      {
        "name": "chia seeds",
        "quantity": 1,
        "unit": "tbsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "peanut butter",
        "quantity": 1,
        "unit": "tbsp"
      }
    ],
    "steps": [
      "Blend banana, berries, and yogurt.",
      "Pour into a bowl.",
      "Top with granola, honey, and chia seeds.",
      "Serve cold."
    ],
    "cookingTime": 0,
    "preparationTime": 8,
    "difficulty": "Easy",
    "servings": 1,
    "calories": 390,
    "protein": 16,
    "carbohydrates": 65,
    "fat": 9,
    "allergies": [
      "Dairy",
      "Gluten"
    ],
    "image": "images/smoothie-bowl.jpg",
    "keywords": [
      "smoothie",
      "breakfast",
      "fruit"
    ],
    "totalTime": 8,
    "sugar": 34,
    "vegetableServings": 0,
    "fibre": 8,
    "addedSugar": 6,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "banana",
        "displayName": "Banana",
        "displayText": "1 piece banana",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "berries",
        "displayName": "Berries",
        "displayText": "1 cup berries",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": "frozen",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "yogurt",
        "displayName": "Yogurt",
        "displayText": "0.75 cup yogurt",
        "quantity": 0.75,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "yogurt",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "granola",
        "displayName": "Granola",
        "displayText": "0.5 cup granola",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "honey",
        "displayName": "Honey",
        "displayText": "1 tbsp honey",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "sweeteners",
        "substituteGroup": "sweetener",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "chia-seeds",
        "displayName": "Chia seeds",
        "displayText": "1 tbsp chia seeds",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "other",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "peanut-butter",
        "displayName": "Peanut butter",
        "displayText": "1 tbsp peanut butter",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": true,
        "category": "condiments-sauces",
        "substituteGroup": "nut-butter",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "avocado-toast",
    "name": "Avocado Toast",
    "category": "Brunch",
    "subcategory": "Quick Meals",
    "cuisine": "American",
    "dietaryTags": [
      "Vegetarian"
    ],
    "ingredients": [
      {
        "name": "bread",
        "quantity": 2,
        "unit": "slices"
      },
      {
        "name": "avocado",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "lemon",
        "quantity": 0.5,
        "unit": "piece"
      },
      {
        "name": "olive oil",
        "quantity": 1,
        "unit": "tsp"
      },
      {
        "name": "salt",
        "quantity": 0.25,
        "unit": "tsp"
      },
      {
        "name": "black pepper",
        "quantity": 0.25,
        "unit": "tsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "egg",
        "quantity": 1,
        "unit": "piece"
      }
    ],
    "steps": [
      "Toast the bread.",
      "Mash avocado with lemon, salt, and pepper.",
      "Spread avocado over toast.",
      "Drizzle with olive oil and serve."
    ],
    "cookingTime": 3,
    "preparationTime": 7,
    "difficulty": "Easy",
    "servings": 1,
    "calories": 330,
    "protein": 8,
    "carbohydrates": 34,
    "fat": 19,
    "allergies": [
      "Gluten"
    ],
    "image": "images/avocado-toast.jpg",
    "keywords": [
      "avocado",
      "toast",
      "breakfast"
    ],
    "totalTime": 10,
    "sugar": 3,
    "vegetableServings": 0.5,
    "fibre": 8,
    "addedSugar": 0,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "bread",
        "displayName": "Bread",
        "displayText": "2 slices bread",
        "quantity": 2,
        "quantityMax": null,
        "unit": "slice",
        "optional": false,
        "category": "bakery",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "avocado",
        "displayName": "Avocado",
        "displayText": "1 piece avocado",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "lemon",
        "displayName": "Lemon",
        "displayText": "0.5 piece lemon",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "olive-oil",
        "displayName": "Olive oil",
        "displayText": "1 tsp olive oil",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tsp",
        "optional": false,
        "category": "oils-fats",
        "substituteGroup": "cooking-oil",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "salt",
        "displayName": "Salt",
        "displayText": "0.25 tsp salt",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "tsp",
        "optional": false,
        "category": "herbs-spices",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "black-pepper",
        "displayName": "Black pepper",
        "displayText": "0.25 tsp black pepper",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "tsp",
        "optional": false,
        "category": "herbs-spices",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "egg",
        "displayName": "Egg",
        "displayText": "1 piece egg",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": true,
        "category": "eggs",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "turkey-sandwich",
    "name": "Turkey Sandwich",
    "category": "Lunch",
    "subcategory": "Quick Meals",
    "cuisine": "American",
    "dietaryTags": [
      "High Protein"
    ],
    "ingredients": [
      {
        "name": "bread",
        "quantity": 2,
        "unit": "slices"
      },
      {
        "name": "turkey",
        "quantity": 3,
        "unit": "slices"
      },
      {
        "name": "lettuce",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "tomato",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "mustard",
        "quantity": 1,
        "unit": "tbsp"
      },
      {
        "name": "cheddar",
        "quantity": 1,
        "unit": "slice"
      }
    ],
    "optionalIngredients": [
      {
        "name": "pickle",
        "quantity": 2,
        "unit": "slices"
      }
    ],
    "steps": [
      "Toast bread if desired.",
      "Layer turkey, lettuce, tomato, and cheddar.",
      "Spread mustard on the bread.",
      "Close sandwich and slice."
    ],
    "cookingTime": 0,
    "preparationTime": 8,
    "difficulty": "Easy",
    "servings": 1,
    "calories": 410,
    "protein": 29,
    "carbohydrates": 38,
    "fat": 15,
    "allergies": [
      "Gluten",
      "Dairy"
    ],
    "image": "images/turkey-sandwich.jpg",
    "keywords": [
      "turkey",
      "sandwich",
      "lunch"
    ],
    "totalTime": 8,
    "sugar": 5,
    "vegetableServings": 0.5,
    "fibre": 4,
    "addedSugar": 1,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "bread",
        "displayName": "Bread",
        "displayText": "2 slices bread",
        "quantity": 2,
        "quantityMax": null,
        "unit": "slice",
        "optional": false,
        "category": "bakery",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "turkey",
        "displayName": "Turkey",
        "displayText": "3 slices turkey",
        "quantity": 3,
        "quantityMax": null,
        "unit": "slice",
        "optional": false,
        "category": "meat",
        "substituteGroup": "poultry",
        "form": "cooked",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "lettuce",
        "displayName": "Lettuce",
        "displayText": "0.5 cup lettuce",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": "leafy-greens",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "tomato",
        "displayName": "Tomato",
        "displayText": "1 piece tomato",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "mustard",
        "displayName": "Mustard",
        "displayText": "1 tbsp mustard",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "cheddar",
        "displayName": "Cheddar",
        "displayText": "1 slice cheddar",
        "quantity": 1,
        "quantityMax": null,
        "unit": "slice",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "cheese",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "pickle",
        "displayName": "Pickle",
        "displayText": "2 slices pickle",
        "quantity": 2,
        "quantityMax": null,
        "unit": "slice",
        "optional": true,
        "category": "condiments-sauces",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    },
    "preparationMethods": [
      {
        "id": "ready-to-assemble",
        "methodType": "ready-to-assemble",
        "requiredApplianceIds": [],
        "totalTimeMinutes": 10,
        "activeTimeMinutes": 10,
        "validated": true
      }
    ]
  },
  {
    "id": "tomato-soup",
    "name": "Tomato Soup",
    "category": "Lunch",
    "subcategory": "Vegetarian",
    "cuisine": "American",
    "dietaryTags": [
      "Vegetarian"
    ],
    "ingredients": [
      {
        "name": "tomato",
        "quantity": 4,
        "unit": "pieces"
      },
      {
        "name": "onion",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "garlic",
        "quantity": 2,
        "unit": "cloves"
      },
      {
        "name": "vegetable stock",
        "quantity": 3,
        "unit": "cups"
      },
      {
        "name": "cream",
        "quantity": 0.25,
        "unit": "cup"
      },
      {
        "name": "basil",
        "quantity": 2,
        "unit": "tbsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "croutons",
        "quantity": 0.25,
        "unit": "cup"
      }
    ],
    "steps": [
      "Saute onion and garlic.",
      "Add tomatoes and stock.",
      "Simmer until tomatoes are soft.",
      "Blend with cream and basil."
    ],
    "cookingTime": 25,
    "preparationTime": 10,
    "difficulty": "Easy",
    "servings": 4,
    "calories": 220,
    "protein": 6,
    "carbohydrates": 28,
    "fat": 10,
    "allergies": [
      "Dairy"
    ],
    "image": "images/tomato-soup.jpg",
    "keywords": [
      "tomato",
      "soup",
      "vegetarian",
      "soups"
    ],
    "totalTime": 35,
    "sugar": 10,
    "vegetableServings": 2,
    "fibre": 5,
    "addedSugar": 2,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "tomato",
        "displayName": "Tomato",
        "displayText": "4 pieces tomato",
        "quantity": 4,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "onion",
        "displayName": "Onion",
        "displayText": "1 piece onion",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "garlic",
        "displayName": "Garlic",
        "displayText": "2 cloves garlic",
        "quantity": 2,
        "quantityMax": null,
        "unit": "clove",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": "fresh",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "vegetable-stock",
        "displayName": "Vegetable stock",
        "displayText": "3 cups vegetable stock",
        "quantity": 3,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "other",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "cream",
        "displayName": "Cream",
        "displayText": "0.25 cup cream",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "basil",
        "displayName": "Basil",
        "displayText": "2 tbsp basil",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "herbs-spices",
        "substituteGroup": "fresh-herbs",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "croutons",
        "displayName": "Croutons",
        "displayText": "0.25 cup croutons",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "cup",
        "optional": true,
        "category": "bakery",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "quinoa-salad",
    "name": "Quinoa Salad",
    "category": "Lunch",
    "subcategory": "Vegan",
    "cuisine": "Mediterranean",
    "dietaryTags": [
      "Vegetarian",
      "Vegan",
      "Gluten-Free",
      "Dairy-Free"
    ],
    "ingredients": [
      {
        "name": "quinoa",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "cucumber",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "tomato",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "chickpeas",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "lemon",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "olive oil",
        "quantity": 2,
        "unit": "tbsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "parsley",
        "quantity": 2,
        "unit": "tbsp"
      }
    ],
    "steps": [
      "Cook quinoa and cool it.",
      "Chop cucumber and tomato.",
      "Mix quinoa with chickpeas and vegetables.",
      "Dress with lemon and olive oil."
    ],
    "cookingTime": 15,
    "preparationTime": 12,
    "difficulty": "Easy",
    "servings": 3,
    "calories": 360,
    "protein": 13,
    "carbohydrates": 52,
    "fat": 12,
    "allergies": [
      "None"
    ],
    "image": "images/quinoa-salad.jpg",
    "keywords": [
      "quinoa",
      "salad",
      "vegan",
      "salads"
    ],
    "totalTime": 27,
    "sugar": 6,
    "vegetableServings": 2,
    "fibre": 8,
    "addedSugar": 0,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "quinoa",
        "displayName": "Quinoa",
        "displayText": "1 cup quinoa",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": "grains",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "cucumber",
        "displayName": "Cucumber",
        "displayText": "1 cup cucumber",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "tomato",
        "displayName": "Tomato",
        "displayText": "1 cup tomato",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "chickpeas",
        "displayName": "Chickpeas",
        "displayText": "1 cup chickpeas",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "legumes",
        "substituteGroup": "legumes",
        "form": "canned",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "lemon",
        "displayName": "Lemon",
        "displayText": "1 piece lemon",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "olive-oil",
        "displayName": "Olive oil",
        "displayText": "2 tbsp olive oil",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "oils-fats",
        "substituteGroup": "cooking-oil",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "parsley",
        "displayName": "Parsley",
        "displayText": "2 tbsp parsley",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": true,
        "category": "herbs-spices",
        "substituteGroup": "fresh-herbs",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "shrimp-tacos",
    "name": "Shrimp Tacos",
    "category": "Dinner",
    "subcategory": "Seafood",
    "cuisine": "Mexican",
    "dietaryTags": [
      "Pescatarian",
      "High Protein"
    ],
    "ingredients": [
      {
        "name": "shrimp",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "tortilla",
        "quantity": 4,
        "unit": "pieces"
      },
      {
        "name": "cabbage",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "lime",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "yogurt sauce",
        "quantity": 3,
        "unit": "tbsp"
      },
      {
        "name": "chili powder",
        "quantity": 1,
        "unit": "tsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "avocado",
        "quantity": 0.5,
        "unit": "piece"
      }
    ],
    "steps": [
      "Season shrimp with chili powder.",
      "Cook shrimp until pink.",
      "Warm tortillas.",
      "Fill tortillas with cabbage, shrimp, lime, and sauce."
    ],
    "cookingTime": 10,
    "preparationTime": 12,
    "difficulty": "Easy",
    "servings": 2,
    "calories": 430,
    "protein": 31,
    "carbohydrates": 42,
    "fat": 14,
    "allergies": [
      "Shellfish",
      "Gluten",
      "Dairy"
    ],
    "image": "images/shrimp-tacos.jpg",
    "keywords": [
      "shrimp",
      "tacos",
      "seafood"
    ],
    "totalTime": 22,
    "sugar": 5,
    "vegetableServings": 1.5,
    "fibre": 4,
    "addedSugar": 1,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "shrimp",
        "displayName": "Shrimp",
        "displayText": "1 cup shrimp",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "seafood",
        "substituteGroup": "seafood",
        "form": "cooked",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "tortilla",
        "displayName": "Tortilla",
        "displayText": "4 pieces tortilla",
        "quantity": 4,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "bakery",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "cabbage",
        "displayName": "Cabbage",
        "displayText": "1 cup cabbage",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "lime",
        "displayName": "Lime",
        "displayText": "1 piece lime",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "yogurt-sauce",
        "displayName": "Yogurt sauce",
        "displayText": "3 tbsp yogurt sauce",
        "quantity": 3,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "yogurt-sauce",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "chili-powder",
        "displayName": "Chili powder",
        "displayText": "1 tsp chili powder",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tsp",
        "optional": false,
        "category": "herbs-spices",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "avocado",
        "displayName": "Avocado",
        "displayText": "0.5 piece avocado",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "piece",
        "optional": true,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "banana-muffins",
    "name": "Banana Muffins",
    "category": "Desserts",
    "subcategory": "Snacks, Dessert",
    "cuisine": "American",
    "dietaryTags": [
      "Vegetarian"
    ],
    "ingredients": [
      {
        "name": "banana",
        "quantity": 3,
        "unit": "pieces"
      },
      {
        "name": "flour",
        "quantity": 1.5,
        "unit": "cups"
      },
      {
        "name": "egg",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "sugar",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "butter",
        "quantity": 0.25,
        "unit": "cup"
      },
      {
        "name": "baking powder",
        "quantity": 1,
        "unit": "tsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "walnuts",
        "quantity": 0.5,
        "unit": "cup"
      }
    ],
    "steps": [
      "Mash bananas.",
      "Mix wet ingredients with sugar.",
      "Fold in flour and baking powder.",
      "Bake until golden."
    ],
    "cookingTime": 20,
    "preparationTime": 12,
    "difficulty": "Easy",
    "servings": 8,
    "calories": 210,
    "protein": 4,
    "carbohydrates": 34,
    "fat": 7,
    "allergies": [
      "Gluten",
      "Egg",
      "Dairy"
    ],
    "image": "images/banana-muffins.jpg",
    "keywords": [
      "banana",
      "muffins",
      "dessert",
      "desserts"
    ],
    "totalTime": 32,
    "sugar": 16,
    "vegetableServings": 0,
    "fibre": 3,
    "addedSugar": 12,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "banana",
        "displayName": "Banana",
        "displayText": "3 pieces banana",
        "quantity": 3,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "flour",
        "displayName": "Flour",
        "displayText": "1.5 cups flour",
        "quantity": 1.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": null,
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "egg",
        "displayName": "Egg",
        "displayText": "1 piece egg",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "eggs",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "sugar",
        "displayName": "Sugar",
        "displayText": "0.5 cup sugar",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "sweeteners",
        "substituteGroup": "sweetener",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "butter",
        "displayName": "Butter",
        "displayText": "0.25 cup butter",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "cooking-fat",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "baking-powder",
        "displayName": "Baking powder",
        "displayText": "1 tsp baking powder",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tsp",
        "optional": false,
        "category": "bakery",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "walnuts",
        "displayName": "Walnuts",
        "displayText": "0.5 cup walnuts",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": true,
        "category": "other",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "berry-smoothie",
    "name": "Berry Smoothie",
    "category": "Drinks",
    "subcategory": "Breakfast, Drink",
    "cuisine": "American",
    "dietaryTags": [
      "Vegetarian"
    ],
    "ingredients": [
      {
        "name": "berries",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "banana",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "yogurt",
        "quantity": 0.75,
        "unit": "cup"
      },
      {
        "name": "milk",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "honey",
        "quantity": 1,
        "unit": "tbsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "chia seeds",
        "quantity": 1,
        "unit": "tbsp"
      }
    ],
    "steps": [
      "Add fruit to blender.",
      "Add yogurt, milk, and honey.",
      "Blend until smooth.",
      "Serve cold."
    ],
    "cookingTime": 0,
    "preparationTime": 5,
    "difficulty": "Easy",
    "servings": 1,
    "calories": 280,
    "protein": 12,
    "carbohydrates": 50,
    "fat": 5,
    "allergies": [
      "Dairy"
    ],
    "image": "images/berry-smoothie.jpg",
    "keywords": [
      "smoothie",
      "berries",
      "drink",
      "drinks"
    ],
    "totalTime": 5,
    "sugar": 32,
    "vegetableServings": 0,
    "fibre": 6,
    "addedSugar": 7,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "berries",
        "displayName": "Berries",
        "displayText": "1 cup berries",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": "frozen",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "banana",
        "displayName": "Banana",
        "displayText": "1 piece banana",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "yogurt",
        "displayName": "Yogurt",
        "displayText": "0.75 cup yogurt",
        "quantity": 0.75,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "yogurt",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "milk",
        "displayName": "Milk",
        "displayText": "0.5 cup milk",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "milk",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "honey",
        "displayName": "Honey",
        "displayText": "1 tbsp honey",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "sweeteners",
        "substituteGroup": "sweetener",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "chia-seeds",
        "displayName": "Chia seeds",
        "displayText": "1 tbsp chia seeds",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": true,
        "category": "other",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "lentil-stew",
    "name": "Lentil Stew",
    "category": "Dinner",
    "subcategory": "Vegan",
    "cuisine": "Middle Eastern",
    "dietaryTags": [
      "Vegetarian",
      "Vegan",
      "Dairy-Free"
    ],
    "ingredients": [
      {
        "name": "lentils",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "carrots",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "onion",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "tomato",
        "quantity": 2,
        "unit": "pieces"
      },
      {
        "name": "vegetable stock",
        "quantity": 4,
        "unit": "cups"
      },
      {
        "name": "cumin",
        "quantity": 1,
        "unit": "tsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "spinach",
        "quantity": 1,
        "unit": "cup"
      }
    ],
    "steps": [
      "Saute onion and carrots.",
      "Add lentils, tomatoes, stock, and cumin.",
      "Simmer until lentils are tender.",
      "Stir in spinach if using."
    ],
    "cookingTime": 35,
    "preparationTime": 10,
    "difficulty": "Easy",
    "servings": 4,
    "calories": 340,
    "protein": 18,
    "carbohydrates": 58,
    "fat": 5,
    "allergies": [
      "None"
    ],
    "image": "images/lentil-stew.jpg",
    "keywords": [
      "lentils",
      "stew",
      "vegan"
    ],
    "totalTime": 45,
    "sugar": 8,
    "vegetableServings": 2,
    "fibre": 12,
    "addedSugar": 0,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "lentils",
        "displayName": "Lentils",
        "displayText": "1 cup lentils",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "legumes",
        "substituteGroup": "legumes",
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "carrots",
        "displayName": "Carrots",
        "displayText": "1 cup carrots",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "onion",
        "displayName": "Onion",
        "displayText": "1 piece onion",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "tomato",
        "displayName": "Tomato",
        "displayText": "2 pieces tomato",
        "quantity": 2,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "vegetable-stock",
        "displayName": "Vegetable stock",
        "displayText": "4 cups vegetable stock",
        "quantity": 4,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "other",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "cumin",
        "displayName": "Cumin",
        "displayText": "1 tsp cumin",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tsp",
        "optional": false,
        "category": "herbs-spices",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "spinach",
        "displayName": "Spinach",
        "displayText": "1 cup spinach",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": true,
        "category": "produce",
        "substituteGroup": "leafy-greens",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "chicken-noodle-soup",
    "name": "Chicken Noodle Soup",
    "category": "Lunch",
    "subcategory": "Chicken",
    "cuisine": "American",
    "dietaryTags": [
      "High Protein"
    ],
    "ingredients": [
      {
        "name": "chicken",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "noodles",
        "quantity": 1.5,
        "unit": "cups"
      },
      {
        "name": "carrots",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "celery",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "onion",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "chicken stock",
        "quantity": 4,
        "unit": "cups"
      }
    ],
    "optionalIngredients": [
      {
        "name": "parsley",
        "quantity": 2,
        "unit": "tbsp"
      }
    ],
    "steps": [
      "Saute onion, carrots, and celery.",
      "Add stock and bring to a simmer.",
      "Add chicken and noodles.",
      "Cook until noodles are tender."
    ],
    "cookingTime": 25,
    "preparationTime": 12,
    "difficulty": "Easy",
    "servings": 4,
    "calories": 360,
    "protein": 24,
    "carbohydrates": 42,
    "fat": 9,
    "allergies": [
      "Gluten"
    ],
    "image": "images/chicken-noodle-soup.jpg",
    "keywords": [
      "chicken",
      "noodle",
      "soup",
      "soups"
    ],
    "totalTime": 37,
    "sugar": 5,
    "vegetableServings": 1.5,
    "fibre": 4,
    "addedSugar": 1,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "chicken",
        "displayName": "Chicken",
        "displayText": "1 cup chicken",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "meat",
        "substituteGroup": "poultry",
        "form": "cooked",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "noodles",
        "displayName": "Noodles",
        "displayText": "1.5 cups noodles",
        "quantity": 1.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": "noodles",
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "carrots",
        "displayName": "Carrots",
        "displayText": "1 cup carrots",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "celery",
        "displayName": "Celery",
        "displayText": "1 cup celery",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "onion",
        "displayName": "Onion",
        "displayText": "1 piece onion",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "chicken-stock",
        "displayName": "Chicken stock",
        "displayText": "4 cups chicken stock",
        "quantity": 4,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "other",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "parsley",
        "displayName": "Parsley",
        "displayText": "2 tbsp parsley",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": true,
        "category": "herbs-spices",
        "substituteGroup": "fresh-herbs",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "beef-burrito-bowl",
    "name": "Beef Burrito Bowl",
    "category": "Dinner",
    "subcategory": "Beef",
    "cuisine": "Mexican",
    "dietaryTags": [
      "High Protein"
    ],
    "ingredients": [
      {
        "name": "beef",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "rice",
        "quantity": 1.5,
        "unit": "cups"
      },
      {
        "name": "black beans",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "corn",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "salsa",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "cheddar",
        "quantity": 0.25,
        "unit": "cup"
      }
    ],
    "optionalIngredients": [
      {
        "name": "avocado",
        "quantity": 0.5,
        "unit": "piece"
      }
    ],
    "steps": [
      "Cook beef until browned.",
      "Warm rice, beans, and corn.",
      "Layer everything in a bowl.",
      "Top with salsa and cheddar."
    ],
    "cookingTime": 18,
    "preparationTime": 10,
    "difficulty": "Easy",
    "servings": 2,
    "calories": 620,
    "protein": 36,
    "carbohydrates": 72,
    "fat": 20,
    "allergies": [
      "Dairy"
    ],
    "image": "images/beef-burrito-bowl.jpg",
    "keywords": [
      "beef",
      "rice",
      "bowl"
    ],
    "totalTime": 28,
    "sugar": 6,
    "vegetableServings": 1.5,
    "fibre": 9,
    "addedSugar": 1,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "beef",
        "displayName": "Beef",
        "displayText": "1 cup beef",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "meat",
        "substituteGroup": "beef",
        "form": "cooked",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "rice",
        "displayName": "Rice",
        "displayText": "1.5 cups rice",
        "quantity": 1.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": "rice",
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "black-beans",
        "displayName": "Black beans",
        "displayText": "1 cup black beans",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "legumes",
        "substituteGroup": "legumes",
        "form": "canned",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "corn",
        "displayName": "Corn",
        "displayText": "0.5 cup corn",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": "frozen",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "salsa",
        "displayName": "Salsa",
        "displayText": "0.5 cup salsa",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": "salsa",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "cheddar",
        "displayName": "Cheddar",
        "displayText": "0.25 cup cheddar",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "cheese",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "avocado",
        "displayName": "Avocado",
        "displayText": "0.5 piece avocado",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "piece",
        "optional": true,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "veggie-pizza",
    "name": "Veggie Pizza",
    "category": "Dinner",
    "subcategory": "Vegetarian",
    "cuisine": "Italian",
    "dietaryTags": [
      "Vegetarian"
    ],
    "ingredients": [
      {
        "name": "pizza dough",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "tomato sauce",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "mozzarella",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "bell pepper",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "mushrooms",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "olive oil",
        "quantity": 1,
        "unit": "tbsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "olives",
        "quantity": 0.25,
        "unit": "cup"
      }
    ],
    "steps": [
      "Spread sauce over dough.",
      "Add cheese and vegetables.",
      "Drizzle with olive oil.",
      "Bake until crust is golden."
    ],
    "cookingTime": 18,
    "preparationTime": 12,
    "difficulty": "Medium",
    "servings": 3,
    "calories": 540,
    "protein": 22,
    "carbohydrates": 66,
    "fat": 20,
    "allergies": [
      "Gluten",
      "Dairy"
    ],
    "image": "images/veggie-pizza.jpg",
    "keywords": [
      "pizza",
      "vegetarian",
      "dinner"
    ],
    "totalTime": 30,
    "sugar": 8,
    "vegetableServings": 1.5,
    "fibre": 5,
    "addedSugar": 2,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "pizza-dough",
        "displayName": "Pizza dough",
        "displayText": "1 piece pizza dough",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "bakery",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "tomato-sauce",
        "displayName": "Tomato sauce",
        "displayText": "0.5 cup tomato sauce",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": "tomato-sauce",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "mozzarella",
        "displayName": "Mozzarella",
        "displayText": "1 cup mozzarella",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "cheese",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "bell-pepper",
        "displayName": "Bell pepper",
        "displayText": "1 piece bell pepper",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "mushrooms",
        "displayName": "Mushrooms",
        "displayText": "0.5 cup mushrooms",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "olive-oil",
        "displayName": "Olive oil",
        "displayText": "1 tbsp olive oil",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "oils-fats",
        "substituteGroup": "cooking-oil",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "olives",
        "displayName": "Olives",
        "displayText": "0.25 cup olives",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "cup",
        "optional": true,
        "category": "condiments-sauces",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "chickpea-curry",
    "name": "Chickpea Curry",
    "category": "Dinner",
    "subcategory": "Vegan",
    "cuisine": "Indian-inspired",
    "dietaryTags": [
      "Vegetarian",
      "Vegan",
      "Dairy-Free"
    ],
    "ingredients": [
      {
        "name": "chickpeas",
        "quantity": 1.5,
        "unit": "cups"
      },
      {
        "name": "coconut milk",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "tomato",
        "quantity": 2,
        "unit": "pieces"
      },
      {
        "name": "onion",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "garlic",
        "quantity": 2,
        "unit": "cloves"
      },
      {
        "name": "curry powder",
        "quantity": 2,
        "unit": "tbsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "spinach",
        "quantity": 1,
        "unit": "cup"
      }
    ],
    "steps": [
      "Saute onion and garlic.",
      "Add curry powder and tomatoes.",
      "Stir in chickpeas and coconut milk.",
      "Simmer until thick."
    ],
    "cookingTime": 25,
    "preparationTime": 10,
    "difficulty": "Easy",
    "servings": 3,
    "calories": 480,
    "protein": 16,
    "carbohydrates": 54,
    "fat": 22,
    "allergies": [
      "None"
    ],
    "image": "images/chickpea-curry.jpg",
    "keywords": [
      "chickpeas",
      "curry",
      "vegan"
    ],
    "totalTime": 35,
    "sugar": 9,
    "vegetableServings": 1.5,
    "fibre": 10,
    "addedSugar": 1,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "chickpeas",
        "displayName": "Chickpeas",
        "displayText": "1.5 cups chickpeas",
        "quantity": 1.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "legumes",
        "substituteGroup": "legumes",
        "form": "canned",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "coconut-milk",
        "displayName": "Coconut milk",
        "displayText": "1 cup coconut milk",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy-alternatives",
        "substituteGroup": "plant-milk",
        "form": "canned",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "tomato",
        "displayName": "Tomato",
        "displayText": "2 pieces tomato",
        "quantity": 2,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "onion",
        "displayName": "Onion",
        "displayText": "1 piece onion",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "garlic",
        "displayName": "Garlic",
        "displayText": "2 cloves garlic",
        "quantity": 2,
        "quantityMax": null,
        "unit": "clove",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": "fresh",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "curry-powder",
        "displayName": "Curry powder",
        "displayText": "2 tbsp curry powder",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "herbs-spices",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "spinach",
        "displayName": "Spinach",
        "displayText": "1 cup spinach",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": true,
        "category": "produce",
        "substituteGroup": "leafy-greens",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "egg-salad",
    "name": "Egg Salad",
    "category": "Lunch",
    "subcategory": "Salads",
    "cuisine": "American",
    "dietaryTags": [
      "Vegetarian"
    ],
    "ingredients": [
      {
        "name": "egg",
        "quantity": 4,
        "unit": "pieces"
      },
      {
        "name": "mayonnaise",
        "quantity": 3,
        "unit": "tbsp"
      },
      {
        "name": "mustard",
        "quantity": 1,
        "unit": "tbsp"
      },
      {
        "name": "celery",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "green onion",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "bread",
        "quantity": 2,
        "unit": "slices"
      }
    ],
    "optionalIngredients": [
      {
        "name": "paprika",
        "quantity": 0.25,
        "unit": "tsp"
      }
    ],
    "steps": [
      "Boil and chop eggs.",
      "Mix mayonnaise and mustard.",
      "Fold in celery and green onion.",
      "Serve on bread or lettuce."
    ],
    "cookingTime": 10,
    "preparationTime": 10,
    "difficulty": "Easy",
    "servings": 2,
    "calories": 390,
    "protein": 18,
    "carbohydrates": 24,
    "fat": 24,
    "allergies": [
      "Egg",
      "Gluten"
    ],
    "image": "images/egg-salad.jpg",
    "keywords": [
      "egg",
      "salad",
      "lunch"
    ],
    "totalTime": 20,
    "sugar": 3,
    "vegetableServings": 1,
    "fibre": 3,
    "addedSugar": 1,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "egg",
        "displayName": "Egg",
        "displayText": "4 pieces egg",
        "quantity": 4,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "eggs",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "mayonnaise",
        "displayName": "Mayonnaise",
        "displayText": "3 tbsp mayonnaise",
        "quantity": 3,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "mustard",
        "displayName": "Mustard",
        "displayText": "1 tbsp mustard",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "celery",
        "displayName": "Celery",
        "displayText": "0.5 cup celery",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "green-onion",
        "displayName": "Green onion",
        "displayText": "1 piece green onion",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "bread",
        "displayName": "Bread",
        "displayText": "2 slices bread",
        "quantity": 2,
        "quantityMax": null,
        "unit": "slice",
        "optional": false,
        "category": "bakery",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "paprika",
        "displayName": "Paprika",
        "displayText": "0.25 tsp paprika",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "tsp",
        "optional": true,
        "category": "herbs-spices",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "apple-oatmeal",
    "name": "Apple Oatmeal",
    "category": "Breakfast",
    "subcategory": "Vegetarian",
    "cuisine": "American",
    "dietaryTags": [
      "Vegetarian"
    ],
    "ingredients": [
      {
        "name": "oats",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "milk",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "apple",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "cinnamon",
        "quantity": 1,
        "unit": "tsp"
      },
      {
        "name": "honey",
        "quantity": 1,
        "unit": "tbsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "walnuts",
        "quantity": 2,
        "unit": "tbsp"
      }
    ],
    "steps": [
      "Simmer oats with milk.",
      "Dice apple.",
      "Stir in apple, cinnamon, and honey.",
      "Cook until creamy."
    ],
    "cookingTime": 8,
    "preparationTime": 5,
    "difficulty": "Easy",
    "servings": 1,
    "calories": 340,
    "protein": 12,
    "carbohydrates": 58,
    "fat": 8,
    "allergies": [
      "Dairy"
    ],
    "image": "images/apple-oatmeal.jpg",
    "keywords": [
      "oats",
      "apple",
      "breakfast"
    ],
    "totalTime": 13,
    "sugar": 24,
    "vegetableServings": 0,
    "fibre": 7,
    "addedSugar": 8,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "oats",
        "displayName": "Oats",
        "displayText": "1 cup oats",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": "grains",
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "milk",
        "displayName": "Milk",
        "displayText": "1 cup milk",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "milk",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "apple",
        "displayName": "Apple",
        "displayText": "1 piece apple",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "cinnamon",
        "displayName": "Cinnamon",
        "displayText": "1 tsp cinnamon",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tsp",
        "optional": false,
        "category": "herbs-spices",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "honey",
        "displayName": "Honey",
        "displayText": "1 tbsp honey",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "sweeteners",
        "substituteGroup": "sweetener",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "walnuts",
        "displayName": "Walnuts",
        "displayText": "2 tbsp walnuts",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": true,
        "category": "other",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "garlic-butter-salmon",
    "name": "Garlic Butter Salmon",
    "category": "Dinner",
    "subcategory": "Seafood",
    "cuisine": "American",
    "dietaryTags": [
      "Pescatarian",
      "High Protein",
      "Gluten-Free"
    ],
    "ingredients": [
      {
        "name": "salmon",
        "quantity": 2,
        "unit": "fillets"
      },
      {
        "name": "garlic",
        "quantity": 3,
        "unit": "cloves"
      },
      {
        "name": "butter",
        "quantity": 2,
        "unit": "tbsp"
      },
      {
        "name": "lemon",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "green beans",
        "quantity": 2,
        "unit": "cups"
      },
      {
        "name": "rice",
        "quantity": 1.5,
        "unit": "cups"
      }
    ],
    "optionalIngredients": [
      {
        "name": "parsley",
        "quantity": 1,
        "unit": "tbsp"
      }
    ],
    "steps": [
      "Season salmon with garlic and lemon.",
      "Sear salmon in butter.",
      "Steam green beans.",
      "Serve salmon with rice and beans."
    ],
    "cookingTime": 18,
    "preparationTime": 10,
    "difficulty": "Medium",
    "servings": 2,
    "calories": 590,
    "protein": 42,
    "carbohydrates": 48,
    "fat": 24,
    "allergies": [
      "Fish",
      "Dairy"
    ],
    "image": "images/garlic-butter-salmon.jpg",
    "keywords": [
      "salmon",
      "seafood",
      "dinner"
    ],
    "totalTime": 28,
    "sugar": 4,
    "vegetableServings": 1,
    "fibre": 5,
    "addedSugar": 0,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "salmon",
        "displayName": "Salmon",
        "displayText": "2 fillets salmon",
        "quantity": 2,
        "quantityMax": null,
        "unit": "fillet",
        "optional": false,
        "category": "seafood",
        "substituteGroup": "seafood",
        "form": "cooked",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "garlic",
        "displayName": "Garlic",
        "displayText": "3 cloves garlic",
        "quantity": 3,
        "quantityMax": null,
        "unit": "clove",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": "fresh",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "butter",
        "displayName": "Butter",
        "displayText": "2 tbsp butter",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "cooking-fat",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "lemon",
        "displayName": "Lemon",
        "displayText": "1 piece lemon",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "green-beans",
        "displayName": "Green beans",
        "displayText": "2 cups green beans",
        "quantity": 2,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "rice",
        "displayName": "Rice",
        "displayText": "1.5 cups rice",
        "quantity": 1.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": "rice",
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "parsley",
        "displayName": "Parsley",
        "displayText": "1 tbsp parsley",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": true,
        "category": "herbs-spices",
        "substituteGroup": "fresh-herbs",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "mac-and-cheese",
    "name": "Mac and Cheese",
    "category": "Dinner",
    "subcategory": "Pasta",
    "cuisine": "American",
    "dietaryTags": [
      "Vegetarian"
    ],
    "ingredients": [
      {
        "name": "macaroni",
        "quantity": 2,
        "unit": "cups"
      },
      {
        "name": "cheddar",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "milk",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "butter",
        "quantity": 2,
        "unit": "tbsp"
      },
      {
        "name": "flour",
        "quantity": 2,
        "unit": "tbsp"
      },
      {
        "name": "black pepper",
        "quantity": 0.25,
        "unit": "tsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "breadcrumbs",
        "quantity": 0.25,
        "unit": "cup"
      }
    ],
    "steps": [
      "Cook macaroni.",
      "Make a sauce with butter, flour, and milk.",
      "Melt cheddar into the sauce.",
      "Stir in macaroni and serve."
    ],
    "cookingTime": 20,
    "preparationTime": 8,
    "difficulty": "Easy",
    "servings": 3,
    "calories": 560,
    "protein": 22,
    "carbohydrates": 68,
    "fat": 22,
    "allergies": [
      "Gluten",
      "Dairy"
    ],
    "image": "images/mac-and-cheese.jpg",
    "keywords": [
      "pasta",
      "cheese",
      "comfort food"
    ],
    "totalTime": 28,
    "sugar": 7,
    "vegetableServings": 0,
    "fibre": 3,
    "addedSugar": 0,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "macaroni",
        "displayName": "Macaroni",
        "displayText": "2 cups macaroni",
        "quantity": 2,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": "pasta",
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "cheddar",
        "displayName": "Cheddar",
        "displayText": "1 cup cheddar",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "cheese",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "milk",
        "displayName": "Milk",
        "displayText": "1 cup milk",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "milk",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "butter",
        "displayName": "Butter",
        "displayText": "2 tbsp butter",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "cooking-fat",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "flour",
        "displayName": "Flour",
        "displayText": "2 tbsp flour",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "grains",
        "substituteGroup": null,
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "black-pepper",
        "displayName": "Black pepper",
        "displayText": "0.25 tsp black pepper",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "tsp",
        "optional": false,
        "category": "herbs-spices",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "breadcrumbs",
        "displayName": "Breadcrumbs",
        "displayText": "0.25 cup breadcrumbs",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "cup",
        "optional": true,
        "category": "bakery",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "granola-bars",
    "name": "Granola Bars",
    "category": "Desserts",
    "subcategory": "Desserts",
    "cuisine": "American",
    "dietaryTags": [
      "Vegetarian"
    ],
    "ingredients": [
      {
        "name": "oats",
        "quantity": 2,
        "unit": "cups"
      },
      {
        "name": "honey",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "peanut butter",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "chia seeds",
        "quantity": 2,
        "unit": "tbsp"
      },
      {
        "name": "chocolate chips",
        "quantity": 0.25,
        "unit": "cup"
      }
    ],
    "optionalIngredients": [
      {
        "name": "dried cranberries",
        "quantity": 0.25,
        "unit": "cup"
      }
    ],
    "steps": [
      "Warm honey and peanut butter.",
      "Mix with oats and chia seeds.",
      "Press into a pan with chocolate chips.",
      "Chill and slice into bars."
    ],
    "cookingTime": 0,
    "preparationTime": 15,
    "difficulty": "Easy",
    "servings": 8,
    "calories": 230,
    "protein": 7,
    "carbohydrates": 30,
    "fat": 11,
    "allergies": [
      "Peanut"
    ],
    "image": "images/granola-bars.jpg",
    "keywords": [
      "snack",
      "oats",
      "granola",
      "snacks",
      "dessert"
    ],
    "totalTime": 15,
    "sugar": 13,
    "vegetableServings": 0,
    "fibre": 5,
    "addedSugar": 10,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "oats",
        "displayName": "Oats",
        "displayText": "2 cups oats",
        "quantity": 2,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": "grains",
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "honey",
        "displayName": "Honey",
        "displayText": "0.5 cup honey",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "sweeteners",
        "substituteGroup": "sweetener",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "peanut-butter",
        "displayName": "Peanut butter",
        "displayText": "0.5 cup peanut butter",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": "nut-butter",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "chia-seeds",
        "displayName": "Chia seeds",
        "displayText": "2 tbsp chia seeds",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "other",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "chocolate-chips",
        "displayName": "Chocolate chips",
        "displayText": "0.25 cup chocolate chips",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "sweeteners",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "dried-cranberries",
        "displayName": "Dried cranberries",
        "displayText": "0.25 cup dried cranberries",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "cup",
        "optional": true,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "mango-lassi",
    "name": "Mango Lassi",
    "category": "Drinks",
    "subcategory": "Vegetarian, Drink",
    "cuisine": "Indian",
    "dietaryTags": [
      "Vegetarian"
    ],
    "ingredients": [
      {
        "name": "mango",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "yogurt",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "milk",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "honey",
        "quantity": 1,
        "unit": "tbsp"
      },
      {
        "name": "cardamom",
        "quantity": 0.25,
        "unit": "tsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "ice",
        "quantity": 0.5,
        "unit": "cup"
      }
    ],
    "steps": [
      "Add mango, yogurt, milk, and honey to blender.",
      "Blend until smooth.",
      "Add cardamom.",
      "Serve chilled."
    ],
    "cookingTime": 0,
    "preparationTime": 5,
    "difficulty": "Easy",
    "servings": 2,
    "calories": 220,
    "protein": 9,
    "carbohydrates": 42,
    "fat": 4,
    "allergies": [
      "Dairy"
    ],
    "image": "images/mango-lassi.jpg",
    "keywords": [
      "mango",
      "drink",
      "smoothie",
      "drinks"
    ],
    "totalTime": 5,
    "sugar": 31,
    "vegetableServings": 0,
    "fibre": 3,
    "addedSugar": 8,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "mango",
        "displayName": "Mango",
        "displayText": "1 cup mango",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": "frozen",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "yogurt",
        "displayName": "Yogurt",
        "displayText": "1 cup yogurt",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "yogurt",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "milk",
        "displayName": "Milk",
        "displayText": "0.5 cup milk",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "milk",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "honey",
        "displayName": "Honey",
        "displayText": "1 tbsp honey",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "sweeteners",
        "substituteGroup": "sweetener",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "cardamom",
        "displayName": "Cardamom",
        "displayText": "0.25 tsp cardamom",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "tsp",
        "optional": false,
        "category": "herbs-spices",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "ice",
        "displayName": "Ice",
        "displayText": "0.5 cup ice",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": true,
        "category": "beverages",
        "substituteGroup": null,
        "form": "frozen",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "vegan-buddha-bowl",
    "name": "Vegan Buddha Bowl",
    "category": "Lunch",
    "subcategory": "Vegan",
    "cuisine": "Fusion",
    "dietaryTags": [
      "Vegetarian",
      "Vegan",
      "Dairy-Free",
      "Gluten-Free"
    ],
    "ingredients": [
      {
        "name": "quinoa",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "chickpeas",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "sweet potato",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "spinach",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "tahini",
        "quantity": 2,
        "unit": "tbsp"
      },
      {
        "name": "lemon",
        "quantity": 1,
        "unit": "piece"
      }
    ],
    "optionalIngredients": [
      {
        "name": "sesame seeds",
        "quantity": 1,
        "unit": "tsp"
      }
    ],
    "steps": [
      "Roast sweet potato.",
      "Cook quinoa.",
      "Warm chickpeas.",
      "Assemble with spinach, tahini, and lemon."
    ],
    "cookingTime": 25,
    "preparationTime": 12,
    "difficulty": "Medium",
    "servings": 2,
    "calories": 520,
    "protein": 18,
    "carbohydrates": 76,
    "fat": 17,
    "allergies": [
      "Sesame"
    ],
    "image": "images/vegan-buddha-bowl.jpg",
    "keywords": [
      "vegan",
      "quinoa",
      "lunch"
    ],
    "totalTime": 37,
    "sugar": 9,
    "vegetableServings": 2.5,
    "fibre": 12,
    "addedSugar": 0,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "quinoa",
        "displayName": "Quinoa",
        "displayText": "1 cup quinoa",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": "grains",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "chickpeas",
        "displayName": "Chickpeas",
        "displayText": "1 cup chickpeas",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "legumes",
        "substituteGroup": "legumes",
        "form": "canned",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "sweet-potato",
        "displayName": "Sweet potato",
        "displayText": "1 piece sweet potato",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "spinach",
        "displayName": "Spinach",
        "displayText": "1 cup spinach",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": "leafy-greens",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "tahini",
        "displayName": "Tahini",
        "displayText": "2 tbsp tahini",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "lemon",
        "displayName": "Lemon",
        "displayText": "1 piece lemon",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "sesame-seeds",
        "displayName": "Sesame seeds",
        "displayText": "1 tsp sesame seeds",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tsp",
        "optional": true,
        "category": "other",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "chicken-quesadilla",
    "name": "Chicken Quesadilla",
    "category": "Lunch",
    "subcategory": "Chicken",
    "cuisine": "Mexican",
    "dietaryTags": [
      "High Protein"
    ],
    "ingredients": [
      {
        "name": "chicken",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "tortilla",
        "quantity": 2,
        "unit": "pieces"
      },
      {
        "name": "cheddar",
        "quantity": 0.75,
        "unit": "cup"
      },
      {
        "name": "bell pepper",
        "quantity": 0.5,
        "unit": "piece"
      },
      {
        "name": "onion",
        "quantity": 0.5,
        "unit": "piece"
      },
      {
        "name": "salsa",
        "quantity": 0.25,
        "unit": "cup"
      }
    ],
    "optionalIngredients": [
      {
        "name": "sour cream",
        "quantity": 2,
        "unit": "tbsp"
      }
    ],
    "steps": [
      "Layer chicken, cheese, pepper, and onion on a tortilla.",
      "Top with another tortilla.",
      "Cook in a skillet until crisp.",
      "Slice and serve with salsa."
    ],
    "cookingTime": 10,
    "preparationTime": 8,
    "difficulty": "Easy",
    "servings": 2,
    "calories": 540,
    "protein": 34,
    "carbohydrates": 42,
    "fat": 24,
    "allergies": [
      "Gluten",
      "Dairy"
    ],
    "image": "images/chicken-quesadilla.jpg",
    "keywords": [
      "chicken",
      "quesadilla",
      "quick lunch"
    ],
    "totalTime": 18,
    "sugar": 4,
    "vegetableServings": 0.5,
    "fibre": 4,
    "addedSugar": 1,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "chicken",
        "displayName": "Chicken",
        "displayText": "1 cup chicken",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "meat",
        "substituteGroup": "poultry",
        "form": "cooked",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "tortilla",
        "displayName": "Tortilla",
        "displayText": "2 pieces tortilla",
        "quantity": 2,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "bakery",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "cheddar",
        "displayName": "Cheddar",
        "displayText": "0.75 cup cheddar",
        "quantity": 0.75,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "cheese",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "bell-pepper",
        "displayName": "Bell pepper",
        "displayText": "0.5 piece bell pepper",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "onion",
        "displayName": "Onion",
        "displayText": "0.5 piece onion",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "salsa",
        "displayName": "Salsa",
        "displayText": "0.25 cup salsa",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": "salsa",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "sour-cream",
        "displayName": "Sour cream",
        "displayText": "2 tbsp sour cream",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": true,
        "category": "dairy",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "spaghetti-bolognese",
    "name": "Spaghetti Bolognese",
    "category": "Dinner",
    "subcategory": "Pasta",
    "cuisine": "Italian",
    "dietaryTags": [
      "High Protein"
    ],
    "ingredients": [
      {
        "name": "spaghetti",
        "quantity": 2,
        "unit": "cups"
      },
      {
        "name": "beef",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "tomato sauce",
        "quantity": 1.5,
        "unit": "cups"
      },
      {
        "name": "onion",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "garlic",
        "quantity": 2,
        "unit": "cloves"
      },
      {
        "name": "parmesan",
        "quantity": 0.25,
        "unit": "cup"
      }
    ],
    "optionalIngredients": [
      {
        "name": "basil",
        "quantity": 2,
        "unit": "tbsp"
      }
    ],
    "steps": [
      "Cook spaghetti.",
      "Brown beef with onion and garlic.",
      "Add tomato sauce and simmer.",
      "Serve sauce over spaghetti with parmesan."
    ],
    "cookingTime": 30,
    "preparationTime": 10,
    "difficulty": "Medium",
    "servings": 3,
    "calories": 680,
    "protein": 36,
    "carbohydrates": 82,
    "fat": 22,
    "allergies": [
      "Gluten",
      "Dairy"
    ],
    "image": "images/spaghetti-bolognese.jpg",
    "keywords": [
      "spaghetti",
      "beef",
      "pasta"
    ],
    "totalTime": 40,
    "sugar": 9,
    "vegetableServings": 1,
    "fibre": 5,
    "addedSugar": 1,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "spaghetti",
        "displayName": "Spaghetti",
        "displayText": "2 cups spaghetti",
        "quantity": 2,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": "pasta",
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "beef",
        "displayName": "Beef",
        "displayText": "1 cup beef",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "meat",
        "substituteGroup": "beef",
        "form": "cooked",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "tomato-sauce",
        "displayName": "Tomato sauce",
        "displayText": "1.5 cups tomato sauce",
        "quantity": 1.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": "tomato-sauce",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "onion",
        "displayName": "Onion",
        "displayText": "1 piece onion",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "garlic",
        "displayName": "Garlic",
        "displayText": "2 cloves garlic",
        "quantity": 2,
        "quantityMax": null,
        "unit": "clove",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": "fresh",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "parmesan",
        "displayName": "Parmesan",
        "displayText": "0.25 cup parmesan",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "cheese",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "basil",
        "displayName": "Basil",
        "displayText": "2 tbsp basil",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": true,
        "category": "herbs-spices",
        "substituteGroup": "fresh-herbs",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  },
  {
    "id": "caprese-salad",
    "name": "Caprese Salad",
    "category": "Lunch",
    "subcategory": "Vegetarian",
    "cuisine": "Italian",
    "dietaryTags": [
      "Vegetarian",
      "Gluten-Free"
    ],
    "ingredients": [
      {
        "name": "tomato",
        "quantity": 2,
        "unit": "pieces"
      },
      {
        "name": "mozzarella",
        "quantity": 1,
        "unit": "cup"
      },
      {
        "name": "basil",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "olive oil",
        "quantity": 1,
        "unit": "tbsp"
      },
      {
        "name": "balsamic vinegar",
        "quantity": 1,
        "unit": "tbsp"
      },
      {
        "name": "black pepper",
        "quantity": 0.25,
        "unit": "tsp"
      }
    ],
    "optionalIngredients": [
      {
        "name": "avocado",
        "quantity": 0.5,
        "unit": "piece"
      }
    ],
    "steps": [
      "Slice tomatoes and mozzarella.",
      "Layer with basil.",
      "Drizzle with olive oil and balsamic.",
      "Season with black pepper."
    ],
    "cookingTime": 0,
    "preparationTime": 10,
    "difficulty": "Easy",
    "servings": 2,
    "calories": 300,
    "protein": 16,
    "carbohydrates": 10,
    "fat": 22,
    "allergies": [
      "Dairy"
    ],
    "image": "images/caprese-salad.jpg",
    "keywords": [
      "tomato",
      "mozzarella",
      "salad",
      "salads"
    ],
    "totalTime": 10,
    "sugar": 4,
    "vegetableServings": 1.5,
    "fibre": 3,
    "addedSugar": 1,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "tomato",
        "displayName": "Tomato",
        "displayText": "2 pieces tomato",
        "quantity": 2,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "mozzarella",
        "displayName": "Mozzarella",
        "displayText": "1 cup mozzarella",
        "quantity": 1,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "dairy",
        "substituteGroup": "cheese",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "basil",
        "displayName": "Basil",
        "displayText": "0.5 cup basil",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "herbs-spices",
        "substituteGroup": "fresh-herbs",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "olive-oil",
        "displayName": "Olive oil",
        "displayText": "1 tbsp olive oil",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "oils-fats",
        "substituteGroup": "cooking-oil",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "balsamic-vinegar",
        "displayName": "Balsamic vinegar",
        "displayText": "1 tbsp balsamic vinegar",
        "quantity": 1,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "black-pepper",
        "displayName": "Black pepper",
        "displayText": "0.25 tsp black pepper",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "tsp",
        "optional": false,
        "category": "herbs-spices",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "avocado",
        "displayName": "Avocado",
        "displayText": "0.5 piece avocado",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "piece",
        "optional": true,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    },
    "preparationMethods": [
      {
        "id": "serve-cold",
        "methodType": "serve-cold",
        "requiredApplianceIds": [],
        "totalTimeMinutes": 10,
        "activeTimeMinutes": 10,
        "validated": true
      }
    ]
  },
  {
    "id": "peanut-noodles",
    "name": "Peanut Noodles",
    "category": "Lunch",
    "subcategory": "Vegetarian",
    "cuisine": "Thai-inspired",
    "dietaryTags": [
      "Vegetarian"
    ],
    "ingredients": [
      {
        "name": "noodles",
        "quantity": 2,
        "unit": "cups"
      },
      {
        "name": "peanut butter",
        "quantity": 0.25,
        "unit": "cup"
      },
      {
        "name": "soy sauce",
        "quantity": 2,
        "unit": "tbsp"
      },
      {
        "name": "lime",
        "quantity": 1,
        "unit": "piece"
      },
      {
        "name": "carrots",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "name": "cucumber",
        "quantity": 0.5,
        "unit": "cup"
      }
    ],
    "optionalIngredients": [
      {
        "name": "cilantro",
        "quantity": 2,
        "unit": "tbsp"
      }
    ],
    "steps": [
      "Cook noodles.",
      "Whisk peanut butter, soy sauce, and lime.",
      "Toss noodles with sauce.",
      "Top with carrots and cucumber."
    ],
    "cookingTime": 10,
    "preparationTime": 10,
    "difficulty": "Easy",
    "servings": 2,
    "calories": 520,
    "protein": 18,
    "carbohydrates": 66,
    "fat": 22,
    "allergies": [
      "Peanut",
      "Soy",
      "Gluten"
    ],
    "image": "images/peanut-noodles.jpg",
    "keywords": [
      "noodles",
      "peanut",
      "quick meal"
    ],
    "totalTime": 20,
    "sugar": 10,
    "vegetableServings": 1,
    "fibre": 6,
    "addedSugar": 3,
    "ingredientSchemaVersion": 1,
    "structuredIngredients": [
      {
        "ingredientId": "noodles",
        "displayName": "Noodles",
        "displayText": "2 cups noodles",
        "quantity": 2,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "grains",
        "substituteGroup": "noodles",
        "form": "dry",
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "peanut-butter",
        "displayName": "Peanut butter",
        "displayText": "0.25 cup peanut butter",
        "quantity": 0.25,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": "nut-butter",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "soy-sauce",
        "displayName": "Soy sauce",
        "displayText": "2 tbsp soy sauce",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": false,
        "category": "condiments-sauces",
        "substituteGroup": "soy-sauce",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "lime",
        "displayName": "Lime",
        "displayText": "1 piece lime",
        "quantity": 1,
        "quantityMax": null,
        "unit": "piece",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "carrots",
        "displayName": "Carrots",
        "displayText": "0.5 cup carrots",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      },
      {
        "ingredientId": "cucumber",
        "displayName": "Cucumber",
        "displayText": "0.5 cup cucumber",
        "quantity": 0.5,
        "quantityMax": null,
        "unit": "cup",
        "optional": false,
        "category": "produce",
        "substituteGroup": null,
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "main",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "structuredOptionalIngredients": [
      {
        "ingredientId": "cilantro",
        "displayName": "Cilantro",
        "displayText": "2 tbsp cilantro",
        "quantity": 2,
        "quantityMax": null,
        "unit": "tbsp",
        "optional": true,
        "category": "herbs-spices",
        "substituteGroup": "fresh-herbs",
        "form": null,
        "preparation": null,
        "packageSize": null,
        "amountText": null,
        "section": "optional",
        "notes": null,
        "measurementStatus": "exact",
        "resolutionStatus": "resolved"
      }
    ],
    "batchCooking": {
      "supported": false
    },
    "leftovers": {
      "supported": false
    }
  }
];
