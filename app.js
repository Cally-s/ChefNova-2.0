/* Chef Nova front-end application. All personal data is stored locally in the browser. */
(function () {
  "use strict";

  const KEYS = { users: "chefNovaUsers", oldUsers: "chefNova.users", session: "chefNovaCurrentUser", oldSession: "chefNova.session", favorites: "chefNovaFavorites", oldFavorites: "chefNova.favorites", pantry: "chefNova.pantry", plans: "chefNovaMealPlan", oldPlans: "chefNova.mealPlans", notifications: "chefNovaNotifications", nutritionHistory: "chefNovaNutritionHistory" };
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const MEALS = ["Breakfast", "Lunch", "Dinner"];
  const BUILT_IN_RECIPES = Array.isArray(window.CHEF_NOVA_RECIPES) ? window.CHEF_NOVA_RECIPES : [];
  const ingredientAliases = {
    egg: ["eggs"],
    tomato: ["tomatoes"],
    potato: ["potatoes"],
    scallion: ["green onion", "spring onion"],
    chicken: ["chicken breast", "chicken thigh"],
    "bell pepper": ["pepper", "sweet pepper"],
    noodle: ["noodles"],
    pasta: ["spaghetti", "macaroni"],
    bread: ["toast"],
    shrimp: ["prawns"],
    chickpea: ["chickpeas"],
    lentil: ["lentils"],
    berry: ["berries"]
  };
  const STARTER = {
    recipes: BUILT_IN_RECIPES,
    users: [{ id: "demo", name: "Nova Cook", email: "demo@chefnova.local", password: "demo123", age: 28, gender: "Prefer not to say", phone: "", dietaryPreference: "No preference", allergies: [] }],
    pantry: [],
    mealPlans: {}
  };
  const INSTRUCTION_STEPS = [
    {
      id: 1,
      title: "Create an Account",
      shortDescription: "Save your cooking profile and food needs.",
      detailHtml: `<div class="instruction-detail-section"><h3>What this feature does</h3><p>Saves your profile, preferences, and long-term Chef Nova progress when you use an account.</p></div>
    <div class="instruction-detail-section"><h3>Getting Started</h3><ol><li>When Chef Nova opens, only the Welcome page is shown.</li><li>The main application becomes available after logging in, creating an account, or continuing as a guest.</li><li>Returning users with an active session skip the Welcome page automatically.</li><li>Select the Log In tab to access an existing account and load saved progress.</li><li>Select the Sign Up tab to create a new account.</li><li>Only one form is shown at a time.</li><li>Use Continue Without an Account to enter guest mode.</li><li>Guests can explore Chef Nova, but their progress is not permanently saved.</li><li>Guest progress stays temporary during the current tab or browser session and is cleared when exiting guest mode.</li><li>Logging out returns the user to the Welcome page with the Log In tab selected.</li></ol></div>
    <div class="instruction-detail-section"><h3>Creating an account</h3><ol><li>Open the Sign Up tab.</li><li>Complete the required fields.</li><li>Enter the same password in Password and Confirm password.</li><li>Chef Nova checks whether the email is already registered.</li><li>Email addresses are saved in lowercase without spaces around them.</li><li>After account creation, Chef Nova logs the user in automatically.</li><li>Registered accounts are saved in the browser for this school project.</li></ol><p>Chef Nova's local account system is for demonstration only. Passwords stored in localStorage are not secure for a real website.</p></div>
    <div class="instruction-detail-section"><h3>Login sessions</h3><ol><li>Chef Nova saves only the signed-in user's ID as the current session.</li><li>The current-session key is chefNovaCurrentUser.</li><li>Full account details remain in chefNovaUsers.</li><li>Refreshing the page restores the matching account automatically.</li><li>Logging out removes the current session but does not delete the account.</li><li>Guest users do not receive a permanent current-user session.</li></ol></div>
    <div class="instruction-detail-section"><h3>Registered-user storage</h3><p>Chef Nova stores each account separately using the signed-in user's ID, so every registered account has its own saved progress.</p><ul><li>chefNovaFavorites_user-001</li><li>chefNovaPantry_user-001</li><li>chefNovaMealPlan_user-001</li><li>chefNovaShoppingList_user-001</li><li>chefNovaNutritionHistory_user-001</li><li>chefNovaCookingHistory_user-001</li></ul><p>Signing into another account loads only that account's data. Guest data remains temporary and separate.</p></div>
    <div class="instruction-detail-section"><h3>Personal Nutrition Setup</h3><p>After creating a new account, Chef Nova may show an optional Personal Nutrition Setup. Height, Current weight, Desired weight, Activity level, and Goal are optional, and users may leave fields blank. Blank values do not block Chef Nova. Users can choose Kilograms and centimetres or Pounds and feet/inches, select Skip for Now, and edit the information later from Profile. Desired weight appears only when Gradually change my weight is selected. Reason for the goal and Preferred pace are optional. Safe pace choices are No specific pace, Slow and gradual, and Discussed with a healthcare professional. Chef Nova does not support rapid-loss or extreme-deficit goals, and users under 18 receive additional safety protections. When information is missing, Chef Nova provides general balanced-eating suggestions instead of calculated targets. Chef Nova uses this only for estimated goals and meal suggestions, and it is not medical advice.</p><p>The Nutrition Profile stores the information users enter. The Daily Nutrition Target is stored separately and contains only derived estimated ranges for calories, protein, carbohydrates, and fat. Chef Nova recalculates the target when body information, Activity level, or relevant goal information changes.</p><p>Workout Support appears when the goal is Support my workouts. All workout questions are optional. Workout information changes general meal and recipe suggestions, but it does not diagnose nutritional needs, create exact sports-nutrition prescriptions, or double-count the Activity level used by the energy-estimation function. Chef Nova prioritizes ordinary foods rather than supplements. People who participate regularly in intense activity may benefit from speaking with a registered dietitian for individualized nutrition recommendations.</p><p>Chef Nova returns an estimated range, not one exact calorie target. The estimate may use Age, Height, Current weight, and Activity level. Goal may make only a small adjustment for adults, estimates are general, and actual needs may differ. Users under 18 receive a maintenance estimate only, and Chef Nova does not automatically subtract calories for minors. Intentional weight change for teenagers should involve a parent or qualified healthcare professional. Incomplete profiles receive general balanced-eating suggestions.</p><p>BMI is not a diagnosis. Chef Nova does not classify users as underweight, overweight, or obese. Adult BMI may be used only as an optional demonstration reference, and adult BMI categories are not used for users under 18. Teen body measurements require age- and sex-specific professional interpretation. Meal planning focuses on balanced meals, variety, activity support, and consistent habits, and meal plans do not depend only on BMI.</p></div>
    <div class="instruction-detail-section"><h3>Privacy Controls</h3><p>Your body and nutrition information is stored only on this device. Chef Nova stores only the information needed for optional nutrition estimates and privacy controls. Height and weight are stored in normalized measurement units, while your preferred display unit is remembered for editing and summaries. Calculated nutrition estimates are stored separately from the raw Personal Nutrition Profile. Registered Daily Nutrition Targets are account-specific, and guest Daily Nutrition Targets remain in sessionStorage only. Full name, email, password, medical records, and exact birth date are not part of the Nutrition Profile or Daily Nutrition Target. Each registered account has its own local profile key, and guests use sessionStorage only. Registered workout information remains account-specific inside the Nutrition Profile. Guest workout information remains only in sessionStorage. BMI is not stored in localStorage or sessionStorage. From Profile, users can Edit Nutrition Profile, Hide Weight Information, Reset Nutrition Goals, or Delete Nutrition Profile. Deleting removes body and nutrition profile information plus the derived target; Pantry, Meal Planner, Shopping List, and Favorites are unaffected.</p></div>
    <div class="instruction-detail-section"><h3>Navigation by account mode</h3><p>Chef Nova changes the navigation automatically after login, sign-up, guest selection, logout, or exiting guest mode.</p><h4>Registered-user navigation</h4><ul><li>Home</li><li>Find Recipes</li><li>Pantry</li><li>Meal Planner</li><li>Favorites</li><li>Shopping List</li><li>Weekly Nutrition</li><li>Cooking Rules</li><li>Profile</li><li>Log Out</li></ul><h4>Guest navigation</h4><ul><li>Home</li><li>Find Recipes</li><li>Pantry</li><li>Meal Planner</li><li>Shopping List</li><li>Weekly Nutrition</li><li>Cooking Rules</li><li>Instructions</li><li>Sign Up</li><li>Log In</li><li>Exit Guest Mode</li></ul><p>Favorites may remain visible to guests, but saving Favorites requires an account.</p></div>
    <div class="instruction-detail-section"><h3>Logging out</h3><ol><li>Select Log Out from the registered-user navigation.</li><li>Chef Nova removes the active login session.</li><li>The main website closes.</li><li>The Welcome Authentication page appears.</li><li>Chef Nova displays: You have been logged out.</li><li>Favorites, Pantry, Meal Plans, Shopping Lists, Nutrition History, Cooking History, and profile information remain saved.</li><li>Log in again to restore the account's progress.</li></ol><p>Logging out does not delete the account or saved progress.</p></div>
    <div class="instruction-detail-section"><h3>Account switching protection</h3><p>When logging out or changing accounts, Chef Nova clears the currently displayed personal content before loading the next account.</p><p>Chef Nova clears visible Favorites, Pantry, Meal Planner, Shopping List, Weekly Nutrition, Nutrition History, Cooking History, Profile, and dashboard counts. Saved progress is not deleted.</p><p>The new account's data is then loaded using that account's user-specific storage keys. This prevents the previous user's information from briefly appearing.</p></div>
    <div class="instruction-detail-section"><h3>Sign-Up validation</h3><p>Chef Nova checks that the name is completed, the email is valid, the email is not already registered, the password contains at least 8 characters, Confirm Password matches, age is valid, and required selections are completed.</p><h3>Login validation</h3><p>Chef Nova checks that email and password are completed and that the credentials match a saved account.</p><p>For security, an invalid login always displays: Incorrect email or password.</p><p>Chef Nova does not reveal whether the email or password was incorrect.</p></div>
    <div class="instruction-detail-section"><h3>Account and guest safety</h3><p>Chef Nova supports registered account persistence, temporary Guest Mode, protected account-only saves, safe guest exit, multiple separate accounts, and optional transfer of guest Pantry, Meal Plan, and Shopping List during registration.</p></div>
    <div class="instruction-detail-section"><h3>Guest Mode</h3><ol><li>Select Continue Without an Account on the Welcome page.</li><li>Chef Nova starts a temporary guest session using sessionStorage.</li><li>The guest-mode key is chefNovaGuestMode and its active value is "true".</li><li>Temporary guest data may remain after refreshing the same tab.</li><li>Closing the tab or browser session removes guest progress.</li><li>Create an account or log in to save progress permanently.</li><li>Use Exit Guest Mode to clear the temporary guest session and return to the Welcome page.</li></ol><p>You are using Chef Nova as a guest. Create an account to save your progress.</p><p>When guests attempt to permanently save progress, Chef Nova displays an Account Required popup.</p><h4>Account Required popup buttons</h4><ul><li>Sign Up</li><li>Log In</li><li>Continue as Guest</li></ul><p>Choosing Continue as Guest closes the popup and lets guests continue exploring without saving permanently.</p><h4>Exiting Guest Mode</h4><ol><li>Select Exit Guest Mode.</li><li>Chef Nova asks: Temporary guest progress will be lost. Exit guest mode?</li><li>Select Exit Guest Mode to confirm.</li><li>Chef Nova clears temporary guest session data.</li><li>The Welcome Authentication page appears.</li></ol><p>Cancel keeps guest mode active. Temporary Pantry, Meal Planner, and Shopping List data are deleted only after confirmation. Registered accounts and registered-user progress are not affected. Exiting guest mode is different from logging out of a registered account.</p><h4>Guests can use</h4><ul><li>Recipe search</li><li>Recipe details</li><li>Recipe filters</li><li>Cooking Rules</li><li>Instructions</li><li>Temporary Pantry</li><li>Temporary Meal Planner</li><li>Weekly Nutrition</li></ul><h4>Guests cannot permanently save</h4><ul><li>Favorites</li><li>Pantry items</li><li>Meal plans</li><li>Shopping lists</li><li>Nutrition history</li><li>Cooking history</li><li>Profile information</li></ul></div>
    <div class="instruction-detail-section"><h3>Staying logged in</h3><ol><li>Chef Nova stores the signed-in user's ID in chefNovaCurrentUser.</li><li>When Chef Nova opens, it looks for that ID in chefNovaUsers.</li><li>If a matching account exists, Chef Nova skips the Welcome page.</li><li>The dashboard opens automatically.</li><li>The user's saved progress is loaded.</li><li>If the ID does not match an account, Chef Nova removes the invalid session and returns to the Welcome page.</li><li>Logging out removes the current session but does not delete the account.</li></ol></div>
    <div class="instruction-detail-section"><h3>How to use it</h3><p>Click Create Account, enter name, email, password, confirm password, age, gender, optional phone number, dietary preference, and allergies. Or choose Log In if you already created an account.</p></div>
    <div class="instruction-example"><h3>Example</h3><p>If your allergy is peanuts, type "peanuts" in the allergies field.</p></div>
    <div class="instruction-detail-section"><h3>Editing Your Profile</h3><ol><li>Open the Profile or Account page.</li><li>Click Edit Profile.</li><li>Update your personal information, dietary preference, or allergies.</li><li>Click Save Changes.</li><li>Use Change Password if you need to update your password.</li><li>Click Cancel to discard unsaved changes.</li></ol></div>
    <div class="instruction-detail-section"><h3>Helpful tip</h3><p>Keep your dietary preference and allergy information updated so Chef Nova can provide safer and more useful recipe suggestions.</p></div>`
    },
    {
      id: 2,
      title: "Search for Recipes",
      shortDescription: "Find recipes from ingredients you already have.",
      detailHtml: `<div class="instruction-detail-section"><h3>What this feature does</h3><p>Finds recipes based on ingredients you already have. Recipe cards can also show neutral nutrition tags, planning-match reasons, and a Recipe Details section that estimates how selected servings fit your optional Daily Nutrition Target.</p></div>
    <div class="instruction-detail-section"><h3>How to use it</h3><ol><li>Go to AI Recipe Finder.</li><li>Enter ingredients separated by commas.</li><li>Use the regular filters for category, cuisine, difficulty, cooking time, dietary preference, and allergy hiding.</li><li>Optionally select one or more Personalized Filters.</li><li>Open View Details to adjust selected servings and review How This Recipe Fits Your Plan.</li></ol></div>
    <div class="instruction-detail-section"><h3>Personalized Filters</h3><p>Personalized filters are optional. Multiple selected filters use AND matching, so a recipe must meet every selected personalized filter.</p><ul><li>Allergy safety and dietary preference compatibility are checked before personalized filtering or ranking.</li><li>Fits my nutrition range uses estimated nutrition ranges and planned Meal Planner information.</li><li>Weekly remaining values are based only on meals entered in Chef Nova.</li><li>Snacks, drinks, restaurant meals, changed portions, and other foods may be missing.</li><li>Low meal-data coverage limits remaining-nutrient personalization.</li><li>Higher protein, Vegetable-rich, Higher fibre, and Lower added sugar depend on available recipe nutrition data.</li><li>Lower added sugar requires added-sugar data and does not use total sugar as a substitute.</li><li>Quick meal means 30 minutes or less.</li><li>Workout-friendly uses general training-focus information and is most personalized when Support my workouts is selected.</li><li>Pantry matches improve ranking but do not guarantee every ingredient is available.</li><li>Personalized match scores are planning tools, not medical ratings.</li><li>Filters do not diagnose needs or guarantee weight loss, muscle gain, or performance.</li><li>Match scores and remaining-nutrient calculations are not permanently stored.</li></ul><p>Personalized suggestions are based on meals entered in Chef Nova and may not include snacks, drinks, restaurant meals, portion changes, or foods eaten outside the Meal Planner.</p></div>
    <div class="instruction-detail-section"><h3>Nutrition, pantry, and privacy</h3><p>Chef Nova may consider user goals, pantry ingredients, cooking time, meal-plan data, and recipe nutrition, but this never overrides allergy safety. Remaining planned nutrient calculations must not be presented as exact amounts the user is required to eat. Guest personalization uses session data only, and account users receive account-specific recommendations.</p></div>
    <div class="instruction-example"><h3>Example</h3><p>Enter chicken, rice, eggs. Then choose Higher protein and Quick meal to show recipes that meet both filters.</p></div>
    <div class="instruction-detail-section"><h3>Helpful tip</h3><p>Add more ingredients for better recipe matches. Use Clear personalized filters to remove only the optional personalized filters while keeping your ingredient search and standard filters.</p></div>`
    },
    { id: 3, title: "Track Pantry Items", shortDescription: "Keep ingredient quantities and expiry dates organized.", whatItDoes: "Keeps track of ingredients, quantities, categories, and expiry dates.", howToUse: "Go to Pantry Tracker, enter ingredient name, number quantity, category, and expiration date.", example: "Milk, Quantity 1, Dairy, July 20.", tip: "Check the Expiring Soon label before cooking." },
    {
      id: 4,
      title: "Create a Meal Plan",
      shortDescription: "Plan breakfast, lunch, and dinner by day.",
      detailHtml: `<div class="instruction-detail-section"><h3>What this feature does</h3><p>Helps plan breakfast, lunch, and dinner for each day. You can enter meals manually or use Generate Suggested Meal Plan to create an optional preview.</p></div>
    <div class="instruction-detail-section"><h3>How to use it</h3><ol><li>Go to Meal Planner.</li><li>Choose a day button.</li><li>Add or edit breakfast, lunch, and dinner.</li><li>Use Meal Plan Preferences if you want to guide suggestions.</li><li>Select Generate Suggested Meal Plan.</li><li>Choose Fill Empty Slots or Replace Entire Plan.</li><li>Review the Suggested Meal Plan Preview.</li><li>Select Apply Suggested Plan only when you want to save it.</li></ol></div>
    <div class="instruction-detail-section"><h3>Personalized suggestions</h3><p>Suggested meal plans are general planning tools and are not medical advice or precise nutrition prescriptions.</p><ul><li>generatePersonalizedMealPlan creates a temporary preview first.</li><li>Allergies are required safety checks and are not optional scoring points.</li><li>Dietary preferences are applied before recipe ranking.</li><li>Eligible recipes are grouped by meal type before Chef Nova fills slots.</li><li>Recipes receive up to 100 planning points across Diet Match, Nutrition Fit, Pantry Match, Goal Match, Recipe Variety, and Cooking-Time Match.</li><li>Daily totals are recalculated after meals are selected, and missing nutrition data is not treated as zero.</li><li>The generator may replace generated recipes to improve flexible balance or food variety.</li><li>The app avoids excessive repetition and does not choose meals by calories alone.</li><li>The preview is not saved until the user selects Apply Suggested Plan.</li><li>Suggested plans aim for multiple protein sources, vegetables and fruit, carbohydrate sources, sources of unsaturated fats, and different recipes.</li><li>Estimated nutrition is based only on recipes and servings entered in Chef Nova.</li><li>Snacks, drinks, restaurant meals, added ingredients, substitutions, and portion changes may be missing.</li><li>Users can edit every generated meal after applying it.</li><li>Missing ingredients are not added to the Shopping List without permission.</li><li>Generated meal scores and rejected-recipe details are not permanently stored.</li><li>Guest Mode plans remain in sessionStorage.</li></ul></div>
    <div class="instruction-example"><h3>Example</h3><p>Choose Fill Empty Slots to keep Monday Breakfast: Omelette and let Chef Nova suggest the remaining empty meals.</p></div>
    <div class="instruction-detail-section"><h3>Helpful tip</h3><p>Save your weekly plan after editing. Workout suggestions are general food ideas, not exact sports-nutrition prescriptions.</p></div>`
    },
    { id: 5, title: "Use Favorites", shortDescription: "Save recipes you want to find again quickly.", whatItDoes: "Saves recipes you like.", howToUse: "Click Favorite on any recipe card. Go to Favorites to view saved recipes.", example: "Save Chicken Curry so you can find it quickly later.", tip: "Remove favorites you no longer need." },
    { id: 6, title: "Learn Cooking Rules", shortDescription: "Review safety, hygiene, storage, and cooking tips.", whatItDoes: "Teaches safety, hygiene, storage, and cooking tips.", howToUse: "Go to Cooking Rules, choose a category, then click View Details on a rule.", example: "Safety rules explain how to handle raw chicken safely.", tip: "Read rules before trying a new cooking skill." },
    { id: 7, title: "Use the Shopping List", shortDescription: "Track ingredients you still need to buy.", whatItDoes: "Helps track ingredients you still need to buy.", howToUse: "Add items manually or add missing ingredients from a recipe.", example: "If a recipe needs soy sauce and you do not have it, add it to the shopping list.", tip: "Check off items after buying them." },
    {
      id: 8,
      title: "Notifications",
      modalTitle: "Step 8 - Notifications",
      shortDescription: "Stay informed with important updates, reminders, warnings, and activity throughout Chef Nova.",
      detailHtml: `<div class="instruction-detail-section"><h3>What does this feature do?</h3><p>The Notifications page helps you stay informed about important activity in Chef Nova.</p><p>Whenever you perform important actions, Chef Nova displays a small notification. Important notifications are also saved so you can review them later.</p><p>Notifications are grouped into four types to help you quickly understand what each message means.</p></div>
    <div class="instruction-detail-section"><h3>Success (Green)</h3><p><b>Purpose:</b> Confirms that an action was completed successfully.</p><p><b>Examples:</b></p><ul><li>Account created successfully</li><li>Login successful</li><li>Recipe added to Favorites</li><li>Pantry item saved</li><li>Meal plan updated</li><li>Shopping item removed</li></ul></div>
    <div class="instruction-detail-section"><h3>Error (Red)</h3><p><b>Purpose:</b> Indicates that something went wrong or needs to be corrected before continuing.</p><p><b>Examples:</b></p><ul><li>Invalid email or password</li><li>Please enter a valid quantity</li><li>Required fields are missing</li><li>Recipe not found</li></ul></div>
    <div class="instruction-detail-section"><h3>Warning (Orange)</h3><p><b>Purpose:</b> Alerts you about something important that may require your attention.</p><p><b>Examples:</b></p><ul><li>This recipe contains one or more of your allergies</li><li>Pantry item expires soon</li><li>Shopping item already exists</li><li>No matching recipes found</li></ul></div>
    <div class="instruction-detail-section"><h3>Information (Blue)</h3><p><b>Purpose:</b> Provides useful updates, reminders, and general information.</p><p><b>Examples:</b></p><ul><li>Welcome back</li><li>Recipes loaded successfully</li><li>Filters reset</li><li>New recipes available</li></ul></div>
    <div class="instruction-detail-section"><h3>How to use it</h3><ol><li>Open the Notifications page from the navigation menu.</li><li>Review your unread notifications.</li><li>Use the notification filters to display specific notification types.</li><li>Click Mark as Read after reviewing a notification.</li><li>Delete notifications you no longer need.</li><li>Use Mark All as Read to quickly mark every notification as read.</li><li>Use Clear All if you want to remove your notification history.</li></ol></div>
    <div class="instruction-example"><h3>Helpful tip</h3><p><b>Green = Success:</b> Confirms an action was completed successfully.</p><p><b>Red = Error:</b> Something needs to be fixed before continuing.</p><p><b>Orange = Warning:</b> Alerts you to something important that may need your attention.</p><p><b>Blue = Information:</b> Provides helpful updates and reminders.</p><p>Checking the Notifications page regularly helps you stay informed about your Chef Nova activity.</p></div>`
    },
    {
      id: 9,
      title: "Weekly Nutrition",
      modalTitle: "Step 9 - Weekly Nutrition",
      shortDescription: "Review estimated calories, protein, sugar, vegetable servings, and nutrition coverage from your weekly meal plan.",
      detailHtml: `<div class="instruction-detail-section"><h3>What does this feature do?</h3><p>The Weekly Nutrition page summarizes the estimated nutrition from Chef Nova recipes saved in your Meal Planner. Nutrition values are multiplied by the number of servings you plan to eat.</p></div>
    <div class="instruction-detail-section"><h3>How to use it</h3><ol><li>Add recipes to the Meal Planner.</li><li>Enter the number of servings you plan to eat.</li><li>Open Weekly Nutrition from the navigation menu.</li><li>Review your weekly totals and daily breakdown.</li><li>Check whether any custom meals are missing nutrition data.</li></ol></div>
    <div class="instruction-detail-section"><h3>How totals work</h3><ul><li>Chef Nova recipes contribute nutrition totals.</li><li>Custom meals are counted but not included in nutrition totals.</li><li>Average daily values are calculated across seven days.</li><li>Nutrition values are estimates per serving.</li></ul></div>
    <div class="instruction-detail-section"><h3>Estimated daily and weekly ranges</h3><ul><li>Chef Nova shows estimated ranges, not one exact calorie or macronutrient target.</li><li>The raw Nutrition Profile and the calculated Daily Nutrition Target are stored separately.</li><li>The energy estimate may use Age, Height, Current weight, and Activity level from the optional Nutrition Profile.</li><li>The Daily Nutrition Target stores only rounded derived ranges and estimateOnly: true.</li><li>Targets are recalculated when body information, Activity level, or relevant goal information changes.</li><li>Registered targets use account-specific storage, while guest targets remain temporary in sessionStorage.</li><li>Deleting the Nutrition Profile also deletes the derived target.</li><li>Recipe Details use the active Daily Nutrition Target to show approximate selected-serving percentages for calories, protein, carbohydrates, and fat.</li><li>Recipe percentages update when the selected serving amount changes, but they are not saved back into recipes, Favorites, Meal Planner, Shopping List, Nutrition Profile, or Daily Nutrition Target data.</li><li>If no valid Daily Nutrition Target is available, Chef Nova still shows recipe nutrition and neutral nutrition tags, then asks the user to complete the optional Nutrition Profile for personalized comparison.</li><li>Neutral recipe tags may include Higher protein, Vegetable-rich, Higher fibre, Carbohydrate-rich, Lower added sugar, Contains unsaturated fat, Balanced meal option, or Workout-supporting.</li><li>Lower added sugar appears only when added sugar data is available. Total sugar is not treated as added sugar.</li><li>Recipe tags and percentages are planning hints only. They do not label foods as allowed, forbidden, guaranteed, or perfect.</li><li>The Your Estimated Weekly Range section multiplies estimated daily calorie, protein, carbohydrate, and fat ranges by seven.</li><li>Weekly Nutrition measures planned recipes and custom meals entered into Chef Nova. It is not a complete food diary.</li><li>This comparison is based only on meals entered in Chef Nova and may not represent everything you eat.</li><li>Planned totals come from meals added to the Meal Planner, and planned servings are included in the calculations.</li><li>Update servings when planned portions change to improve the comparison.</li><li>Weekly Nutrition may exclude snacks, drinks, restaurant meals, portion changes, custom meals without nutrition information, ingredients added during cooking, and recipe substitutions.</li><li>Weekly Nutrition may also include meals that were planned but not eaten.</li><li>Meals without nutrition data reduce the coverage percentage and are not treated as zero-nutrition meals.</li><li>Nutrition-data coverage shows how much of the planned meal data is available inside Chef Nova.</li><li>Within estimated range means the planned total falls inside the estimated range.</li><li>Below estimated range means the planned total is below the range.</li><li>Above estimated range means the planned total is above the range.</li><li>Not enough meal data means too few planned meals include nutrition data.</li><li>Comparison statuses are general planning references. They do not diagnose health or apply judgmental labels to meals.</li><li>Do not use Weekly Nutrition alone to make food-quantity decisions.</li><li>Users under 18 receive maintenance-focused comparisons intended to support regular balanced meals and activity.</li><li>Goal may make only a small adjustment for adults.</li><li>Every energy range includes: This is a general estimate. Your actual needs may differ.</li><li>Carbohydrates use 45-65% of estimated energy, fat uses 20-35%, and protein uses 10-35%.</li><li>These reference ranges are associated with adequate nutrient intake and reduced chronic-disease risk, not precise personal prescriptions.</li><li>Macronutrient calculations are rounded to understandable gram ranges.</li><li>The upper end of every macronutrient range is not intended to be used simultaneously. The ranges show flexible possible distributions within the estimated energy range.</li><li>Fibre, vegetables and fruit, and water currently use general guidance.</li><li>Incomplete profiles receive general food suggestions instead of a stored target.</li></ul></div>
    <div class="instruction-detail-section"><h3>How recommendations work</h3><p>Chef Nova may suggest adding more vegetables when the weekly vegetable rating is Low, adding protein sources when the weekly protein rating is Low, choosing lower-sugar options when the weekly sugar rating is High, using Chef Nova recipes when meals are missing nutrition data, or planning more meals when the weekly plan is mostly empty.</p><p>Recommendations only use meals with available nutrition data. These are simple app suggestions and are not medical advice.</p></div>
    <div class="instruction-detail-section"><h3>Daily nutrition breakdown</h3><ul><li>Chef Nova shows nutrition totals for Monday through Sunday.</li><li>Each day includes calories, protein, vegetable servings, and sugar.</li><li>Recipe nutrition is multiplied by the servings selected in the Meal Planner.</li><li>Custom meals without nutrition data are not included in the totals.</li><li>A day may show zero nutrition if no valid Chef Nova recipes are planned.</li></ul></div>
    <div class="instruction-detail-section"><h3>Nutrition progress bars</h3><ul><li>Protein progress compares the weekly total with 350 g.</li><li>Vegetable progress compares the weekly total with 21 servings.</li><li>Sugar progress compares the weekly total with the 350 g reference range.</li><li>Protein and vegetable bars show progress toward Chef Nova's simple app targets.</li><li>The sugar bar shows how close the total is to the reference range.</li><li>A warning appears when sugar is above 350 g.</li><li>Progress only uses meals with available nutrition data.</li></ul><p>The progress bars are simple app estimates and are not medical advice.</p></div>
    <div class="instruction-detail-section"><h3>Nutrition accuracy</h3><ul><li>Nutrition values are estimated using the recipe nutrition data and the servings selected in the Meal Planner.</li><li>Custom meals may not have nutrition information and may be excluded from calculations.</li><li>Weekly summaries, ratings, recommendations, progress bars, and daily breakdowns are estimates only.</li><li>The Weekly Nutrition feature is designed to help with meal planning rather than provide medical or professional dietary advice.</li></ul></div>
    <div class="instruction-detail-section"><h3>Automatic updates</h3><p>The Weekly Nutrition page automatically recalculates when you add a meal, edit a meal, delete a meal, change servings, clear the meal plan, or load a saved meal plan.</p><p>A notification appears when the weekly nutrition summary has been updated. The page also recalculates silently when Chef Nova first loads or when Weekly Nutrition is opened.</p></div>
    <div class="instruction-detail-section"><h3>Saving weekly history</h3><ol><li>Complete or update your Meal Planner.</li><li>Open Weekly Nutrition.</li><li>Select Save This Week.</li><li>Chef Nova saves the estimated totals for the current Monday-to-Sunday week.</li><li>Saving the same week again updates the existing entry.</li><li>Saved summaries can be deleted later.</li></ol><p>Weekly history is optional and is only saved when you select Save This Week.</p><p>Saved summaries contain estimated nutrition values and may exclude custom meals.</p></div>
    <div class="instruction-example"><h3>Helpful tip</h3><p>Use Chef Nova recipes in the Meal Planner when you want complete nutrition estimates. Custom meals will appear as meals without nutrition data.</p></div>`
    }
  ];

  const MEAL_CATEGORIES = ["Breakfast", "Brunch", "Lunch", "Dinner", "Desserts", "Drinks"];
  const DIFFICULTIES = ["Easy", "Medium", "Hard"];
  const DIETARY_PREFERENCES = ["Vegetarian", "Vegan", "Pescatarian", "Dairy-Free", "Gluten-Free", "Halal-Friendly", "High Protein", "Low Carb"];
  const MIN_PASSWORD_LENGTH = 8;
  const GUEST_KEYS = { mode: "chefNovaGuestMode", session: "chefNovaGuestSession", favorites: "chefNovaGuestFavorites", pantry: "chefNovaGuestPantry", mealPlans: "chefNovaGuestMealPlan", mealPlanPreferences: "chefNovaGuestMealPlanPreferences", shoppingList: "chefNovaGuestShoppingList", notifications: "chefNovaGuestNotifications", cookingHistory: "chefNovaGuestCookingHistory" };
  const GUEST_TEMPORARY_MESSAGE = "Guest progress is temporary and will not be saved after your session ends.";
  const USER_FEATURE_PREFIXES = { Favorites: "chefNovaFavorites", Pantry: "chefNovaPantry", MealPlan: "chefNovaMealPlan", ShoppingList: "chefNovaShoppingList", NutritionHistory: "chefNovaNutritionHistory", CookingHistory: "chefNovaCookingHistory", Notifications: "chefNovaNotifications" };
  const LEGACY_SHARED_KEYS = { Favorites: ["chefNovaFavorites", "chefNova.favorites"], Pantry: ["chefNovaPantry", "chefNova.pantry"], MealPlan: ["chefNovaMealPlan", "chefNova.mealPlans"], ShoppingList: ["chefNovaShoppingList"], NutritionHistory: ["chefNovaNutritionHistory"], CookingHistory: ["chefNovaCookingHistory"], Notifications: ["chefNovaNotifications"] };
  const REGISTERED_NAV_ITEMS = ["home", "recipes", "pantry", "mealPlanner", "favorites", "shoppingList", "weeklyNutrition", "cookingRules", "profile", "logout"];
  const GUEST_NAV_ITEMS = ["home", "recipes", "pantry", "mealPlanner", "shoppingList", "weeklyNutrition", "cookingRules", "instructions", "signup", "login", "exitGuest"];
  const NAV_PAGE_ITEMS = { home: "home", recipes: "recipes", pantry: "pantry", planner: "mealPlanner", favorites: "favorites", "shopping-list": "shoppingList", "weekly-nutrition": "weeklyNutrition", notifications: "notifications", learn: "cookingRules", guide: "instructions", account: "profile" };
  const ACTIVITY_VALUE_MAP = { mostly_inactive: "mostly-inactive", "mostly-inactive": "mostly-inactive", lightly_active: "lightly-active", "lightly-active": "lightly-active", moderately_active: "moderately-active", "moderately-active": "moderately-active", very_active: "very-active", "very-active": "very-active", athlete_intense: "athlete-or-intense-training", "athlete-or-intense-training": "athlete-or-intense-training" };
  const GOAL_VALUE_MAP = { maintain_weight: "maintain-current-weight", "maintain-current-weight": "maintain-current-weight", build_muscle: "build-muscle", "build-muscle": "build-muscle", improve_eating_habits: "improve-eating-habits", "improve-eating-habits": "improve-eating-habits", support_workouts: "support-workouts", "support-workouts": "support-workouts", gradual_weight_change: "gradual-weight-change", "gradual-weight-change": "gradual-weight-change", prefer_not_to_choose: "prefer-not-to-choose", "prefer-not-to-choose": "prefer-not-to-choose" };
  const PACE_VALUE_MAP = { no_specific_pace: "no-specific-pace", "no-specific-pace": "no-specific-pace", slow_gradual: "slow-and-gradual", "slow-and-gradual": "slow-and-gradual", healthcare_professional: "discussed-with-healthcare-professional", "discussed-with-healthcare-professional": "discussed-with-healthcare-professional" };
  const WORKOUT_LENGTH_VALUE_MAP = { less_than_30: "less-than-30-minutes", "less-than-30-minutes": "less-than-30-minutes", "30_to_59": "30-to-59-minutes", "30-to-59-minutes": "30-to-59-minutes", "60_to_89": "60-to-89-minutes", "60-to-89-minutes": "60-to-89-minutes", "90_or_longer": "90-minutes-or-longer", "90-minutes-or-longer": "90-minutes-or-longer" };
  const TRAINING_FOCUS_VALUE_MAP = { general_fitness: "general-fitness", "general-fitness": "general-fitness", strength_training: "strength-training", "strength-training": "strength-training", endurance: "endurance", team_sport: "team-sport", "team-sport": "team-sport", mixed_training: "mixed-training", "mixed-training": "mixed-training" };
  const ACTIVITY_DISPLAY_LABELS = { "mostly-inactive": "Mostly inactive", "lightly-active": "Lightly active", "moderately-active": "Moderately active", "very-active": "Very active", "athlete-or-intense-training": "Athlete or intense training" };
  const GOAL_DISPLAY_LABELS = { "maintain-current-weight": "Maintain my current weight", "build-muscle": "Build muscle", "improve-eating-habits": "Improve my eating habits", "support-workouts": "Support my workouts", "gradual-weight-change": "Gradually change my weight", "prefer-not-to-choose": "Prefer not to choose" };
  const PACE_DISPLAY_LABELS = { "no-specific-pace": "No specific pace", "slow-and-gradual": "Slow and gradual", "discussed-with-healthcare-professional": "Discussed with a healthcare professional" };
  const WORKOUT_LENGTH_DISPLAY_LABELS = { "less-than-30-minutes": "Less than 30 minutes", "30-to-59-minutes": "30–59 minutes", "60-to-89-minutes": "60–89 minutes", "90-minutes-or-longer": "90 minutes or longer" };
  const TRAINING_FOCUS_DISPLAY_LABELS = { "general-fitness": "General fitness", "strength-training": "Strength training", endurance: "Endurance", "team-sport": "Team sport", "mixed-training": "Mixed training" };
  const NUTRITION_ACTIVITY_LABELS = ACTIVITY_DISPLAY_LABELS;
  const NUTRITION_GOAL_LABELS = GOAL_DISPLAY_LABELS;
  const NUTRITION_UNIT_LABELS = { metric: "Kilograms and centimetres", imperial: "Pounds and feet/inches" };
  const NUTRITION_PACE_LABELS = PACE_DISPLAY_LABELS;
  const BODY_MEASUREMENT_SAFETY_MESSAGE = "Body measurements are only one part of health. Chef Nova focuses on balanced meals, variety, activity support, and consistent habits.";
  const TEEN_BODY_MEASUREMENT_MESSAGE = "For teenagers, height and weight need to be interpreted using age- and sex-specific growth patterns by a healthcare professional.";
  const UNKNOWN_AGE_NUTRITION_MESSAGE = "Add your age only if you are comfortable doing so. Without it, Chef Nova will provide general nutrition suggestions rather than body-based estimates.";
  const ENERGY_ACTIVITY_MULTIPLIERS = {
    "mostly-inactive": 1.2,
    "lightly-active": 1.35,
    "moderately-active": 1.5,
    "very-active": 1.7,
    "athlete-or-intense-training": 1.85
  };
  const ADULT_ENERGY_GOAL_ADJUSTMENTS = {
    "maintain-current-weight": 0,
    "improve-eating-habits": 0,
    "support-workouts": 100,
    "build-muscle": 150,
    "prefer-not-to-choose": 0
  };
  const MACRONUTRIENT_PERCENT_RANGES = {
    carbohydrates: { minimum: 0.45, maximum: 0.65 },
    fat: { minimum: 0.20, maximum: 0.35 },
    protein: { minimum: 0.10, maximum: 0.35 }
  };
  const MINIMUM_WEEKLY_NUTRITION_DATA_COVERAGE = 70;
  const MINIMUM_MEALS_WITH_NUTRITION_DATA = 3;
  const WEEKLY_COMPARISON_LIMITATION_MESSAGE = "This comparison is based only on meals entered in Chef Nova and may not represent everything you eat.";
  const WEEKLY_COMPARISON_CONFIDENCE_LABELS = {
    unavailable: "Comparison unavailable",
    limited: "Limited comparison",
    partial: "Partial comparison",
    stronger: "More complete comparison"
  };
  const WEEKLY_COMPARISON_CONFIDENCE_DESCRIPTIONS = {
    unavailable: "There is not enough planned meal information for a useful comparison.",
    limited: "Only a small portion of the week includes nutrition information.",
    partial: "Some planned meals include nutrition information, but parts of the week may be missing.",
    stronger: "Most planned meals include nutrition information, but foods outside Chef Nova may still be missing."
  };
  const WEEKLY_NUTRITION_STATUS_LABELS = {
    "within-estimated-range": "Within estimated range",
    "below-estimated-range": "Below estimated range",
    "above-estimated-range": "Above estimated range",
    "not-enough-meal-data": "Not enough meal data"
  };
  const MAX_DISPLAYED_RECIPE_CONTRIBUTION = 999;
  const RECIPE_NUTRITION_TAG_RULES = {
    higherProteinGrams: 25,
    carbohydrateRichGrams: 45,
    higherFibreGrams: 6,
    vegetableRichServings: 1.5,
    lowerAddedSugarGrams: 5
  };
  const PERSONALIZED_RECIPE_FILTERS = {
    FITS_NUTRITION_RANGE: "fits-nutrition-range",
    HIGHER_PROTEIN: "higher-protein",
    BALANCED_MEAL: "balanced-meal",
    WORKOUT_FRIENDLY: "workout-friendly",
    VEGETABLE_RICH: "vegetable-rich",
    HIGHER_FIBRE: "higher-fibre",
    LOWER_ADDED_SUGAR: "lower-added-sugar",
    QUICK_MEAL: "quick-meal"
  };
  const MINIMUM_RECIPE_NUTRITION_FIT_SCORE = 55;
  const QUICK_MEAL_MAX_MINUTES = 30;
  const MEAL_PLAN_GENERATION_MODES = {
    FILL_EMPTY: "fill-empty-slots",
    REPLACE_ALL: "replace-entire-plan"
  };
  const DEFAULT_MAX_RECIPE_USES_PER_WEEK = 2;
  const MEAL_PLAN_RECIPE_SCORE_WEIGHTS = { dietMatch: 25, nutritionFit: 25, pantryMatch: 20, goalMatch: 15, recipeVariety: 10, cookingTimeMatch: 5 };
  const DEFAULT_RECIPE_USE_LIMITS = { breakfast: 3, lunch: 2, dinner: 2, snack: 3 };
  const MINIMUM_REPLACEMENT_SCORE_IMPROVEMENT = 5;
  const MEAL_PLAN_PREFERENCES_VERSION = 1;
  const CALORIES_PER_GRAM = {
    carbohydrates: 4,
    protein: 4,
    fat: 9
  };
  const GUEST_PERMISSIONS = {
    searchRecipes: true,
    viewRecipeDetails: true,
    useRecipeFilters: true,
    readCookingRules: true,
    viewInstructions: true,
    useTemporaryPantry: true,
    useTemporaryMealPlanner: true,
    viewNutrition: true,
    saveFavoritesPermanently: false,
    savePantryPermanently: false,
    saveMealPlansPermanently: false,
    saveShoppingListsPermanently: false,
    saveNutritionHistoryPermanently: false,
    saveCookingHistoryPermanently: false,
    saveProfileInformation: false
  };
  const state = { recipes: [], users: [], pantry: [], favorites: [], mealPlans: {}, currentUser: null, authMode: "login", guestMode: false, ruleFilter: "All", notificationFilter: "All", activeMealDay: "Monday", isEditingProfile: false, isChangingPassword: false, profileMenuOpen: false, recipeFilters: { category: "All", cuisine: "All", difficulty: "All", maxTime: "", dietary: "All", hideAllergies: false }, personalizedRecipeFilters: createEmptyPersonalizedRecipeFilterState() };
  let guestSessionData = { favorites: [], pantry: [], mealPlans: {}, shoppingList: [], nutritionHistory: [], notifications: [] };
  let accountRequiredLastFocus = null;
  let exitGuestModeLastFocus = null;
  let nutritionConfirmLastFocus = null;
  let pendingNutritionConfirmAction = null;
  let isSwitchingAccount = false;
  let isCreatingAccount = false;
  let isLoggingIn = false;
  let pendingGuestUpgradeUser = null;
  let nutritionSetupSource = "onboarding";
  let pendingGeneratedMealPlan = null;
  let mealPlanGenerationLastFocus = null;
  const recentToasts = new Map();
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const read = (key, fallback) => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch (_) { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  function isAuthenticatedUser() {
    return Boolean(getCurrentUser()) && !state.guestMode;
  }

  // Guests may explore Chef Nova and use temporary session features.
  // Guest progress must stay in sessionStorage and must never be written
  // to registered-user localStorage keys.
  function canUseFeature(featureName) {
    if (isAuthenticatedUser()) return true;
    if (state.guestMode || isGuestMode()) return Boolean(GUEST_PERMISSIONS[featureName]);
    return false;
  }

  function canSavePermanently() {
    return isAuthenticatedUser();
  }

  function canCurrentUserSaveProgress() {
    return canSavePermanently();
  }

  function getGuestStorageKey(featureName) {
    return GUEST_KEYS[featureName] || "";
  }

  function getStorageForCurrentMode() {
    if (isAuthenticatedUser()) return localStorage;
    if (state.guestMode || isGuestMode()) return sessionStorage;
    return null;
  }

  function getActiveStorage() {
    return getStorageForCurrentMode();
  }

  // Guests may explore Chef Nova without an account.
  // Permanent save actions call requireAccount()
  // to encourage registration before saving progress.
  function requireAccount(actionName) {
    if (!getCurrentUser()) {
      showAccountRequiredModal(actionName);
      return false;
    }

    return true;
  }

  function showGuestSaveRestriction() {
    showAccountRequiredModal("save your progress");
  }

  function requireAuthenticatedSave(actionName) {
    return requireAccount(actionName || "save your progress");
  }

  function showGuestSaveMessage() {
    showGuestSaveRestriction();
  }

  function createGuestSessionData() {
    return { favorites: [], pantry: [], mealPlans: createEmptyMealPlan(), shoppingList: [], nutritionHistory: [], notifications: [] };
  }

  function resetGuestSessionData() {
    guestSessionData = createGuestSessionData();
    state.favorites = guestSessionData.favorites;
    state.pantry = guestSessionData.pantry;
    state.mealPlans = guestSessionData.mealPlans;
  }

  function readGuestStorage(key, fallback) {
    try {
      const value = sessionStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeGuestStorage(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  function isGuestMode() {
    try {
      const session = readGuestSession();
      if (session?.isGuest === true) return true;
      const value = sessionStorage.getItem(GUEST_KEYS.mode);
      if (value === "true") return true;
      if (value != null) sessionStorage.removeItem(GUEST_KEYS.mode);
      return false;
    } catch (error) {
      console.error("Unable to read guest mode:", error);
      return false;
    }
  }

  function createGuestSessionId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function readGuestSession() {
    try {
      const rawSession = sessionStorage.getItem(GUEST_KEYS.session);
      return rawSession ? JSON.parse(rawSession) : null;
    } catch (error) {
      console.error("Invalid Chef Nova guest session:", error);
      sessionStorage.removeItem(GUEST_KEYS.session);
      return null;
    }
  }

  function initializeGuestData() {
    const defaults = {
      [GUEST_KEYS.favorites]: [],
      [GUEST_KEYS.pantry]: [],
      [GUEST_KEYS.mealPlans]: createEmptyMealPlan(),
      [GUEST_KEYS.shoppingList]: [],
      "chefNovaGuestNutritionHistory": [],
      [GUEST_KEYS.notifications]: [],
      [GUEST_KEYS.cookingHistory]: []
    };
    Object.entries(defaults).forEach(([key, defaultValue]) => {
      if (sessionStorage.getItem(key) === null) writeGuestStorage(key, defaultValue);
    });
  }

  function initializeGuestModeSession() {
    // Guest mode uses sessionStorage so the temporary guest session
    // ends when the browser tab or session closes. Guest mode must not
    // be stored in localStorage or treated as a registered account.
    clearCurrentUserSession();
    sessionStorage.setItem(GUEST_KEYS.session, JSON.stringify({ isGuest: true, sessionId: createGuestSessionId(), startedAt: new Date().toISOString() }));
    sessionStorage.setItem(GUEST_KEYS.mode, "true");
    initializeGuestData();
  }

  function clearGuestSessionData() {
    try {
      [GUEST_KEYS.mode, GUEST_KEYS.session, GUEST_KEYS.favorites, GUEST_KEYS.pantry, GUEST_KEYS.mealPlans, GUEST_KEYS.mealPlanPreferences, GUEST_KEYS.shoppingList, GUEST_KEYS.notifications, getGuestNutritionProfileKey(), getGuestNutritionTargetsKey(), "chefNovaGuestNutritionHistory", GUEST_KEYS.cookingHistory].forEach((key) => sessionStorage.removeItem(key));
    } catch (error) {
      console.error("Unable to clear guest session data:", error);
    }
  }

  function clearGuestMode() {
    clearGuestSessionData();
    state.guestMode = false;
    resetGuestSessionData();
    hideGuestBanner();
  }

  function hasGuestUpgradeSession() {
    if (isGuestMode()) return true;
    return [GUEST_KEYS.pantry, GUEST_KEYS.mealPlans, GUEST_KEYS.shoppingList].some((key) => sessionStorage.getItem(key));
  }

  function getUserStorageKeyForUser(feature, userOrId) {
    const userId = typeof userOrId === "string" ? userOrId : userOrId?.id;
    return userId ? `chefNova${feature}_${userId}` : "";
  }

  function createEmptyPantry() {
    return [];
  }

  function createEmptyShoppingList() {
    return [];
  }

  function initializeNewUserStorage(user) {
    const defaults = {
      Favorites: [],
      Pantry: createEmptyPantry(),
      MealPlan: createEmptyMealPlan(),
      ShoppingList: createEmptyShoppingList(),
      NutritionHistory: [],
      CookingHistory: []
    };
    Object.entries(defaults).forEach(([feature, value]) => {
      const key = getUserStorageKeyForUser(feature, user);
      if (key && localStorage.getItem(key) === null) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });
    const nutritionKey = getNutritionProfileKey(typeof user === "string" ? user : user?.id);
    if (nutritionKey && localStorage.getItem(nutritionKey) === null) {
      localStorage.setItem(nutritionKey, JSON.stringify(createEmptyNutritionProfile()));
    }
  }

  function getNutritionProfileKey(userId) {
    if (!userId) return null;
    return `chefNovaNutritionProfile_${userId}`;
  }

  function getGuestNutritionProfileKey() {
    return "chefNovaGuestNutritionProfile";
  }

  function getNutritionTargetsKey(userId = getCurrentUserId()) {
    if (!userId) return null;
    return `chefNovaNutritionTargets_${userId}`;
  }

  function getGuestNutritionTargetsKey() {
    return "chefNovaGuestNutritionTargets";
  }

  function createEmptyNutritionProfile() {
    return {
      version: 1,
      age: null,
      heightCm: null,
      currentWeightKg: null,
      desiredWeightKg: null,
      activityLevel: null,
      goal: null,
      unitSystem: "metric",
      weightGoalReason: null,
      preferredPace: null,
      setupCompleted: false,
      setupSkipped: false,
      profileCompleteness: "limited",
      ageSafetyStatus: "unknown",
      hideWeightInformation: false,
      workoutProfile: null,
      updatedAt: null,
    };
  }

  function getCurrentDateString() {
    return new Date().toISOString().slice(0, 10);
  }

  function getCurrentIsoString() {
    return new Date().toISOString();
  }

  function roundToOneDecimal(value) {
    return Math.round(value * 10) / 10;
  }

  function poundsToKilograms(pounds) {
    if (!Number.isFinite(pounds)) return null;
    return roundToOneDecimal(pounds / 2.2046226218);
  }

  function kilogramsToPounds(kilograms) {
    if (!Number.isFinite(kilograms)) return null;
    return roundToOneDecimal(kilograms * 2.2046226218);
  }

  function feetAndInchesToCentimetres(feet, inches) {
    if (!Number.isFinite(feet)) return null;
    const safeInches = Number.isFinite(inches) ? inches : 0;
    return roundToOneDecimal(((feet * 12) + safeInches) * 2.54);
  }

  function centimetresToFeetAndInches(centimetres) {
    if (!Number.isFinite(centimetres)) return { feet: null, inches: null };
    const totalInches = centimetres / 2.54;
    let feet = Math.floor(totalInches / 12);
    let inches = Math.round(totalInches - (feet * 12));
    if (inches === 12) {
      feet += 1;
      inches = 0;
    }
    return { feet, inches };
  }

  function normalizeActivityLevel(value) {
    if (!value) return null;
    return ACTIVITY_VALUE_MAP[value] || null;
  }

  function normalizeNutritionGoal(value) {
    if (!value) return null;
    return GOAL_VALUE_MAP[value] || null;
  }

  function normalizePreferredPace(value) {
    if (!value) return null;
    return PACE_VALUE_MAP[value] || null;
  }

  function normalizeWorkoutLength(value) {
    if (!value) return null;
    return WORKOUT_LENGTH_VALUE_MAP[value] || null;
  }

  function normalizeTrainingFocus(value) {
    if (!value) return null;
    return TRAINING_FOCUS_VALUE_MAP[value] || null;
  }

  function normalizeOptionalText(value, maximumLength) {
    const text = String(value ?? "").trim();
    if (!text) return null;
    return text.slice(0, maximumLength);
  }

  function normalizePositiveNumber(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) return null;
    return Math.round(number);
  }

  function normalizeEstimateType(value) {
    const estimateType = String(value || "").trim();
    const allowedTypes = ["maintenance", "adult-general-goal-adjusted", "general-guidance"];
    return allowedTypes.includes(estimateType) ? estimateType : "general-guidance";
  }

  function normalizeAgeSafetyStatus(value) {
    const status = String(value || "").trim();
    return ["adult", "minor", "unknown"].includes(status) ? status : "unknown";
  }

  function normalizeDateString(value) {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    const timestamp = Date.parse(trimmed);
    return Number.isFinite(timestamp) ? trimmed : null;
  }

  function getAgeSafetyStatus(age) {
    if (!Number.isInteger(age)) return "unknown";
    return age < 18 ? "minor" : "adult";
  }

  function normalizeWorkoutProfile(value) {
    if (!value || typeof value !== "object") return null;
    const mainActivity = normalizeOptionalText(value.mainActivity ?? value.main_activity, 80);
    const daysValue = value.workoutDaysPerWeek ?? value.workout_days ?? value.workoutDays;
    const workoutDaysPerWeek = daysValue === null || daysValue === undefined || daysValue === "" ? null : Number(daysValue);
    const safeDays = Number.isInteger(workoutDaysPerWeek) && workoutDaysPerWeek >= 0 && workoutDaysPerWeek <= 7 ? workoutDaysPerWeek : null;
    const typicalWorkoutLength = normalizeWorkoutLength(value.typicalWorkoutLength ?? value.workout_length);
    const trainingFocus = normalizeTrainingFocus(value.trainingFocus ?? value.training_focus);
    const hasInformation = Boolean(mainActivity) || safeDays !== null || Boolean(typicalWorkoutLength) || Boolean(trainingFocus);
    if (!hasInformation) return null;
    return { mainActivity, workoutDaysPerWeek: safeDays, typicalWorkoutLength, trainingFocus };
  }

  function normalizeStoredNutritionProfile(stored) {
    if (!stored || typeof stored !== "object") return null;
    if (stored.version !== 1 || stored.data || stored.preferences || "completed" in stored || "skipped" in stored || "status" in stored) {
      return migrateNutritionProfile(stored);
    }
    const empty = createEmptyNutritionProfile();
    const age = Number.isInteger(stored.age) ? stored.age : null;
    const normalized = {
      ...empty,
      version: 1,
      age,
      heightCm: Number.isFinite(stored.heightCm) ? roundToOneDecimal(stored.heightCm) : null,
      currentWeightKg: Number.isFinite(stored.currentWeightKg) ? roundToOneDecimal(stored.currentWeightKg) : null,
      desiredWeightKg: Number.isFinite(stored.desiredWeightKg) ? roundToOneDecimal(stored.desiredWeightKg) : null,
      activityLevel: normalizeActivityLevel(stored.activityLevel),
      goal: normalizeNutritionGoal(stored.goal),
      unitSystem: stored.unitSystem === "imperial" ? "imperial" : "metric",
      weightGoalReason: normalizeOptionalText(stored.weightGoalReason, 300),
      preferredPace: normalizePreferredPace(stored.preferredPace),
      setupCompleted: stored.setupCompleted === true,
      setupSkipped: stored.setupSkipped === true,
      ageSafetyStatus: getAgeSafetyStatus(age),
      hideWeightInformation: stored.hideWeightInformation === true,
      workoutProfile: normalizeNutritionGoal(stored.goal) === "support-workouts" ? normalizeWorkoutProfile(stored.workoutProfile ?? stored.workout_profile) : null,
      updatedAt: normalizeDateString(stored.updatedAt) || (stored.setupCompleted === true || stored.setupSkipped === true ? getCurrentIsoString() : null)
    };
    if (normalized.goal !== "gradual-weight-change") {
      normalized.desiredWeightKg = null;
      normalized.weightGoalReason = null;
      normalized.preferredPace = null;
    }
    if (normalized.goal !== "support-workouts") normalized.workoutProfile = null;
    normalized.profileCompleteness = evaluateNutritionProfileCompleteness(normalized);
    return normalized;
  }

  function migrateNutritionProfile(oldProfile) {
    const data = oldProfile?.data || {};
    const unitSystem = data.unitSystem === "imperial" || oldProfile?.unitSystem === "imperial" ? "imperial" : "metric";
    const age = Number.isInteger(oldProfile?.age) ? oldProfile.age : (Number.isInteger(data.age) ? data.age : null);
    let heightCm = Number.isFinite(oldProfile?.heightCm) ? oldProfile.heightCm : null;
    let currentWeightKg = Number.isFinite(oldProfile?.currentWeightKg) ? oldProfile.currentWeightKg : null;
    let desiredWeightKg = Number.isFinite(oldProfile?.desiredWeightKg) ? oldProfile.desiredWeightKg : null;
    if (heightCm === null && data.height) {
      if (data.height.unit === "ft_in" || "feet" in data.height) heightCm = feetAndInchesToCentimetres(Number(data.height.feet), Number(data.height.inches));
      else heightCm = Number.isFinite(data.height.value) ? data.height.value : null;
    }
    if (currentWeightKg === null && data.weight) {
      currentWeightKg = data.weight.unit === "lb" ? poundsToKilograms(Number(data.weight.value)) : (Number.isFinite(data.weight.value) ? data.weight.value : null);
    }
    const legacyWeightGoal = data.weightGoal || {};
    if (desiredWeightKg === null && legacyWeightGoal.desiredWeight) {
      desiredWeightKg = legacyWeightGoal.desiredWeight.unit === "lb" ? poundsToKilograms(Number(legacyWeightGoal.desiredWeight.value)) : (Number.isFinite(legacyWeightGoal.desiredWeight.value) ? legacyWeightGoal.desiredWeight.value : null);
    }
    const migrated = {
      ...createEmptyNutritionProfile(),
      version: 1,
      age,
      heightCm: Number.isFinite(heightCm) ? roundToOneDecimal(heightCm) : null,
      currentWeightKg: Number.isFinite(currentWeightKg) ? roundToOneDecimal(currentWeightKg) : null,
      desiredWeightKg: Number.isFinite(desiredWeightKg) ? roundToOneDecimal(desiredWeightKg) : null,
      activityLevel: normalizeActivityLevel(oldProfile?.activityLevel || data.activityLevel),
      goal: normalizeNutritionGoal(oldProfile?.goal || data.generalGoal),
      unitSystem,
      weightGoalReason: normalizeOptionalText(oldProfile?.weightGoalReason ?? legacyWeightGoal.reason, 300),
      preferredPace: normalizePreferredPace(oldProfile?.preferredPace || legacyWeightGoal.preferredPace),
      setupCompleted: oldProfile?.setupCompleted === true || oldProfile?.completed === true || oldProfile?.status === "completed",
      setupSkipped: oldProfile?.setupSkipped === true || oldProfile?.skipped === true || oldProfile?.status === "skipped",
      hideWeightInformation: oldProfile?.hideWeightInformation === true || oldProfile?.preferences?.hideWeightInformation === true,
      workoutProfile: normalizeWorkoutProfile(oldProfile?.workoutProfile ?? oldProfile?.workout_profile ?? data.workoutProfile ?? data.workout_profile),
      updatedAt: normalizeDateString(oldProfile?.updatedAt) || getCurrentIsoString()
    };
    migrated.ageSafetyStatus = getAgeSafetyStatus(migrated.age);
    if (migrated.goal !== "gradual-weight-change") {
      migrated.desiredWeightKg = null;
      migrated.weightGoalReason = null;
      migrated.preferredPace = null;
    }
    if (migrated.goal !== "support-workouts") migrated.workoutProfile = null;
    migrated.profileCompleteness = evaluateNutritionProfileCompleteness(migrated);
    return migrated;
  }

  function getNutritionProfile(userId) {
    const key = getNutritionProfileKey(userId);
    if (!key) return null;
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      const normalized = normalizeStoredNutritionProfile(parsed);
      if (normalized && JSON.stringify(parsed) !== JSON.stringify(normalized)) localStorage.setItem(key, JSON.stringify(normalized));
      return normalized;
    } catch (error) {
      console.error("Unable to read nutrition profile:", error);
      return null;
    }
  }

  function writeNutritionProfile(userId, profile) {
    const key = getNutritionProfileKey(userId);
    if (!key) return false;
    const normalized = normalizeStoredNutritionProfile(profile) || createEmptyNutritionProfile();
    localStorage.setItem(key, JSON.stringify(normalized));
    return true;
  }

  function saveGuestNutritionProfile(profile) {
    const normalized = normalizeStoredNutritionProfile(profile) || createEmptyNutritionProfile();
    sessionStorage.setItem(getGuestNutritionProfileKey(), JSON.stringify(normalized));
  }

  function loadGuestNutritionProfile() {
    const stored = sessionStorage.getItem(getGuestNutritionProfileKey());
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      const normalized = normalizeStoredNutritionProfile(parsed);
      if (normalized && JSON.stringify(parsed) !== JSON.stringify(normalized)) sessionStorage.setItem(getGuestNutritionProfileKey(), JSON.stringify(normalized));
      return normalized;
    } catch (error) {
      console.error("Unable to read guest nutrition profile:", error);
      return null;
    }
  }

  function getActiveNutritionProfile() {
    if (isGuestMode()) return loadGuestNutritionProfile();
    const user = getCurrentUser();
    return user ? getNutritionProfile(user.id) : null;
  }

  function saveCurrentNutritionProfile(profile) {
    const normalizedProfile = normalizeStoredNutritionProfile(profile) || createEmptyNutritionProfile();
    if (isGuestMode()) {
      saveGuestNutritionProfile(normalizedProfile);
      return true;
    }
    const user = getCurrentUser();
    if (!user) return false;
    localStorage.setItem(getNutritionProfileKey(user.id), JSON.stringify(normalizedProfile));
    return true;
  }

  function createEmptyDailyNutritionTarget() {
    return {
      version: 1,
      calorieMin: null,
      calorieMax: null,
      proteinMin: null,
      proteinMax: null,
      carbohydrateMin: null,
      carbohydrateMax: null,
      fatMin: null,
      fatMax: null,
      goalType: null,
      estimateType: "general-guidance",
      ageSafetyStatus: "unknown",
      sourceProfileUpdatedAt: null,
      calculatedAt: null,
      estimateOnly: true
    };
  }

  function normalizeStoredNutritionTarget(stored) {
    if (!stored || typeof stored !== "object") return null;
    return {
      version: 1,
      calorieMin: normalizePositiveNumber(stored.calorieMin ?? stored.calorie_min),
      calorieMax: normalizePositiveNumber(stored.calorieMax ?? stored.calorie_max),
      proteinMin: normalizePositiveNumber(stored.proteinMin ?? stored.protein_min),
      proteinMax: normalizePositiveNumber(stored.proteinMax ?? stored.protein_max),
      carbohydrateMin: normalizePositiveNumber(stored.carbohydrateMin ?? stored.carbMin ?? stored.carbohydrate_min),
      carbohydrateMax: normalizePositiveNumber(stored.carbohydrateMax ?? stored.carbMax ?? stored.carbohydrate_max),
      fatMin: normalizePositiveNumber(stored.fatMin ?? stored.fat_min),
      fatMax: normalizePositiveNumber(stored.fatMax ?? stored.fat_max),
      goalType: normalizeNutritionGoal(stored.goalType ?? stored.goal),
      estimateType: normalizeEstimateType(stored.estimateType),
      ageSafetyStatus: normalizeAgeSafetyStatus(stored.ageSafetyStatus),
      sourceProfileUpdatedAt: normalizeDateString(stored.sourceProfileUpdatedAt),
      calculatedAt: normalizeDateString(stored.calculatedAt ?? stored.calculated_at),
      estimateOnly: stored.estimateOnly !== false
    };
  }

  function validateDailyNutritionTarget(target) {
    if (!target) return false;
    const numericFields = ["calorieMin", "calorieMax", "proteinMin", "proteinMax", "carbohydrateMin", "carbohydrateMax", "fatMin", "fatMax"];
    const validNumbers = numericFields.every((field) => Number.isFinite(target[field]) && target[field] > 0 && Number.isInteger(target[field]));
    if (!validNumbers) return false;
    if (
      target.calorieMax <= target.calorieMin ||
      target.proteinMax <= target.proteinMin ||
      target.carbohydrateMax <= target.carbohydrateMin ||
      target.fatMax <= target.fatMin
    ) {
      return false;
    }
    if (target.goalType !== null && !GOAL_DISPLAY_LABELS[target.goalType]) return false;
    if (target.estimateOnly !== true) return false;
    return true;
  }

  function buildDailyNutritionTarget(profile) {
    const energyEstimate = estimateDailyEnergyNeeds(profile);
    const macroEstimate = estimateDailyMacronutrientRanges(energyEstimate);
    if (!energyEstimate?.available || !macroEstimate?.available) return null;
    const target = {
      version: 1,
      calorieMin: energyEstimate.minimumCalories,
      calorieMax: energyEstimate.maximumCalories,
      proteinMin: macroEstimate.proteinGrams.minimum,
      proteinMax: macroEstimate.proteinGrams.maximum,
      carbohydrateMin: macroEstimate.carbohydrateGrams.minimum,
      carbohydrateMax: macroEstimate.carbohydrateGrams.maximum,
      fatMin: macroEstimate.fatGrams.minimum,
      fatMax: macroEstimate.fatGrams.maximum,
      goalType: normalizeNutritionGoal(profile?.goal) || null,
      estimateType: normalizeEstimateType(energyEstimate.estimateType),
      ageSafetyStatus: normalizeAgeSafetyStatus(profile?.ageSafetyStatus),
      sourceProfileUpdatedAt: normalizeDateString(profile?.updatedAt),
      calculatedAt: getCurrentIsoString(),
      estimateOnly: true
    };
    return validateDailyNutritionTarget(target) ? target : null;
  }

  function clearDailyNutritionTarget() {
    if (isGuestMode()) {
      sessionStorage.removeItem(getGuestNutritionTargetsKey());
      return;
    }
    const key = getNutritionTargetsKey();
    if (key) localStorage.removeItem(key);
  }

  function saveDailyNutritionTarget(target) {
    const normalizedTarget = normalizeStoredNutritionTarget(target);
    if (!validateDailyNutritionTarget(normalizedTarget)) {
      clearDailyNutritionTarget();
      return false;
    }
    const serialized = JSON.stringify(normalizedTarget);
    try {
      if (isGuestMode()) {
        sessionStorage.setItem(getGuestNutritionTargetsKey(), serialized);
        return true;
      }
      const key = getNutritionTargetsKey();
      if (!key) return false;
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error("Unable to save nutrition target.", error);
      return false;
    }
  }

  function loadDailyNutritionTarget() {
    try {
      let raw = null;
      if (isGuestMode()) {
        raw = sessionStorage.getItem(getGuestNutritionTargetsKey());
      } else {
        const key = getNutritionTargetsKey();
        if (!key) return null;
        raw = localStorage.getItem(key);
      }
      if (!raw) return null;
      const normalized = normalizeStoredNutritionTarget(JSON.parse(raw));
      if (!validateDailyNutritionTarget(normalized)) {
        clearDailyNutritionTarget();
        return null;
      }
      return normalized;
    } catch (error) {
      clearDailyNutritionTarget();
      console.error("Unable to load nutrition target.", error);
      return null;
    }
  }

  function createNutritionTargetInputSignature(profile) {
    return JSON.stringify({
      age: profile?.age || null,
      heightCm: profile?.heightCm || null,
      currentWeightKg: profile?.currentWeightKg || null,
      desiredWeightKg: profile?.desiredWeightKg || null,
      activityLevel: profile?.activityLevel || null,
      goal: profile?.goal || null,
      ageSafetyStatus: profile?.ageSafetyStatus || "unknown",
      profileCompleteness: profile?.profileCompleteness || "limited"
    });
  }

  function isDailyNutritionTargetCurrent(target, profile) {
    if (!target || !profile) return false;
    if (!validateDailyNutritionTarget(target)) return false;
    if (target.goalType !== (normalizeNutritionGoal(profile.goal) || null)) return false;
    if (!target.sourceProfileUpdatedAt || !profile.updatedAt) return false;
    if (target.sourceProfileUpdatedAt !== profile.updatedAt) return false;
    return true;
  }

  function recalculateDailyNutritionTarget(profile = getActiveNutritionProfile()) {
    const normalizedProfile = normalizeStoredNutritionProfile(profile);
    if (!normalizedProfile || !normalizedProfile.setupCompleted) {
      clearDailyNutritionTarget();
      return null;
    }
    const target = buildDailyNutritionTarget(normalizedProfile);
    if (!target) {
      clearDailyNutritionTarget();
      return null;
    }
    return saveDailyNutritionTarget(target) ? target : null;
  }

  function getCurrentDailyNutritionTarget(profile = getActiveNutritionProfile()) {
    const normalizedProfile = normalizeStoredNutritionProfile(profile);
    if (!normalizedProfile || !normalizedProfile.setupCompleted) {
      clearDailyNutritionTarget();
      return null;
    }
    const savedTarget = loadDailyNutritionTarget();
    if (isDailyNutritionTargetCurrent(savedTarget, normalizedProfile)) return savedTarget;
    return recalculateDailyNutritionTarget(normalizedProfile);
  }

  function normalizeWeeklyRangeValue(value) {
    return Number.isFinite(value) ? Math.round(value) : null;
  }

  function buildEstimatedWeeklyNutritionRange(dailyTarget) {
    if (!validateDailyNutritionTarget(dailyTarget)) return null;
    return {
      calories: {
        minimum: normalizeWeeklyRangeValue(dailyTarget.calorieMin * 7),
        maximum: normalizeWeeklyRangeValue(dailyTarget.calorieMax * 7)
      },
      protein: {
        minimum: normalizeWeeklyRangeValue(dailyTarget.proteinMin * 7),
        maximum: normalizeWeeklyRangeValue(dailyTarget.proteinMax * 7)
      },
      carbohydrates: {
        minimum: normalizeWeeklyRangeValue(dailyTarget.carbohydrateMin * 7),
        maximum: normalizeWeeklyRangeValue(dailyTarget.carbohydrateMax * 7)
      },
      fat: {
        minimum: normalizeWeeklyRangeValue(dailyTarget.fatMin * 7),
        maximum: normalizeWeeklyRangeValue(dailyTarget.fatMax * 7)
      },
      estimateOnly: true
    };
  }

  function calculateNutritionDataCoverage(mealsWithNutritionData, totalPlannedMeals) {
    const plannedMeals = Number(totalPlannedMeals);
    if (!Number.isFinite(plannedMeals) || plannedMeals <= 0) {
      return {
        percentage: 0,
        available: false,
        mealsWithNutritionData: 0,
        totalPlannedMeals: 0
      };
    }
    const rawValidMeals = Number(mealsWithNutritionData);
    const validMeals = Number.isFinite(rawValidMeals) ? Math.max(0, Math.min(rawValidMeals, plannedMeals)) : 0;
    return {
      percentage: Math.round((validMeals / plannedMeals) * 100),
      available: true,
      mealsWithNutritionData: validMeals,
      totalPlannedMeals: plannedMeals
    };
  }

  function getWeeklyComparisonConfidence(weeklyData) {
    const totalPlannedMeals = weeklyData?.totalPlannedMeals || 0;
    const mealsWithNutritionData = weeklyData?.mealsWithNutritionData || 0;
    const coveragePercentage = weeklyData?.coveragePercentage || 0;
    const daysWithPlannedMeals = weeklyData?.daysWithPlannedMeals || 0;
    if (totalPlannedMeals === 0 || mealsWithNutritionData === 0) return "unavailable";
    if (mealsWithNutritionData < 3 || coveragePercentage < 50) return "limited";
    if (coveragePercentage < 80 || daysWithPlannedMeals < 5) return "partial";
    return "stronger";
  }

  function getWeeklyNutritionDataScope() {
    return {
      includes: [
        "planned recipes with nutrition data",
        "custom meals with valid nutrition data",
        "planned servings"
      ],
      mayExclude: [
        "snacks not entered",
        "drinks not entered",
        "restaurant meals",
        "portion changes",
        "custom meals without nutrition data",
        "ingredients added during cooking",
        "recipe substitutions",
        "foods eaten outside the planner"
      ]
    };
  }

  function getWeeklyNutritionRangeStatus(plannedAmount, estimatedRange, coverage) {
    if (
      !coverage?.available ||
      coverage.percentage < MINIMUM_WEEKLY_NUTRITION_DATA_COVERAGE ||
      coverage.mealsWithNutritionData < MINIMUM_MEALS_WITH_NUTRITION_DATA
    ) {
      return "not-enough-meal-data";
    }
    if (
      !Number.isFinite(plannedAmount) ||
      !estimatedRange ||
      !Number.isFinite(estimatedRange.minimum) ||
      !Number.isFinite(estimatedRange.maximum)
    ) {
      return "not-enough-meal-data";
    }
    if (plannedAmount < estimatedRange.minimum) return "below-estimated-range";
    if (plannedAmount > estimatedRange.maximum) return "above-estimated-range";
    return "within-estimated-range";
  }

  function getOverallWeeklyNutritionStatus(nutrientComparisons, coverage) {
    if (
      !coverage?.available ||
      coverage.percentage < MINIMUM_WEEKLY_NUTRITION_DATA_COVERAGE ||
      coverage.mealsWithNutritionData < MINIMUM_MEALS_WITH_NUTRITION_DATA
    ) {
      return "not-enough-meal-data";
    }
    const statuses = Object.values(nutrientComparisons || {}).map((item) => item?.status).filter(Boolean);
    if (!statuses.length || statuses.includes("not-enough-meal-data")) return "not-enough-meal-data";
    if (statuses.every((status) => status === "within-estimated-range")) return "within-estimated-range";
    const belowCount = statuses.filter((status) => status === "below-estimated-range").length;
    const aboveCount = statuses.filter((status) => status === "above-estimated-range").length;
    if (belowCount > aboveCount) return "below-estimated-range";
    if (aboveCount > belowCount) return "above-estimated-range";
    return "within-estimated-range";
  }

  function buildWeeklyNutritionComparison(plannedTotals, dailyTarget, mealData) {
    const weeklyRange = buildEstimatedWeeklyNutritionRange(dailyTarget);
    const coverage = calculateNutritionDataCoverage(mealData?.mealsWithNutritionData, mealData?.totalPlannedMeals);
    const confidence = getWeeklyComparisonConfidence({
      totalPlannedMeals: coverage.totalPlannedMeals,
      mealsWithNutritionData: coverage.mealsWithNutritionData,
      coveragePercentage: coverage.percentage,
      daysWithPlannedMeals: mealData?.daysWithPlannedMeals || 0
    });
    if (!weeklyRange) {
      return {
        available: false,
        weeklyRange: null,
        coverage,
        confidence,
        limitationMessage: WEEKLY_COMPARISON_LIMITATION_MESSAGE,
        goalType: dailyTarget?.goalType || null,
        nutrients: null,
        overallStatus: "not-enough-meal-data"
      };
    }
    const hasPlannedMeals = coverage.totalPlannedMeals > 0;
    const nutrients = {
      calories: { planned: hasPlannedMeals ? normalizeWeeklyRangeValue(plannedTotals?.calories) : null, estimatedRange: weeklyRange.calories },
      protein: { planned: hasPlannedMeals ? normalizeWeeklyRangeValue(plannedTotals?.protein) : null, estimatedRange: weeklyRange.protein },
      carbohydrates: { planned: hasPlannedMeals ? normalizeWeeklyRangeValue(plannedTotals?.carbohydrates) : null, estimatedRange: weeklyRange.carbohydrates },
      fat: { planned: hasPlannedMeals ? normalizeWeeklyRangeValue(plannedTotals?.fat) : null, estimatedRange: weeklyRange.fat }
    };
    Object.values(nutrients).forEach((nutrient) => {
      nutrient.status = getWeeklyNutritionRangeStatus(nutrient.planned, nutrient.estimatedRange, coverage);
    });
    return {
      available: true,
      weeklyRange,
      coverage,
      confidence,
      limitationMessage: WEEKLY_COMPARISON_LIMITATION_MESSAGE,
      goalType: dailyTarget?.goalType || null,
      nutrients,
      overallStatus: getOverallWeeklyNutritionStatus(nutrients, coverage)
    };
  }

  function updateNutritionTargetStatus(message = "") {
    const status = $("#nutritionTargetStatus");
    if (status) status.textContent = message;
  }

  function copyGuestProgressToUser(user) {
    if (!user || !user.id) return;
    const pantry = readGuestStorage(GUEST_KEYS.pantry, []);
    const mealPlan = normalizeMealPlan(readGuestStorage(GUEST_KEYS.mealPlans, {}));
    const shoppingList = readGuestStorage(GUEST_KEYS.shoppingList, []);
    localStorage.setItem(getUserStorageKeyForUser("Pantry", user), JSON.stringify(Array.isArray(pantry) ? pantry : []));
    localStorage.setItem(getUserStorageKeyForUser("MealPlan", user), JSON.stringify(mealPlan));
    localStorage.setItem(getUserStorageKeyForUser("ShoppingList", user), JSON.stringify(Array.isArray(shoppingList) ? shoppingList : []));
  }

  function loadGuestProgress() {
    guestSessionData = {
      favorites: readGuestStorage(GUEST_KEYS.favorites, []),
      pantry: readGuestStorage(GUEST_KEYS.pantry, []),
      mealPlans: normalizeMealPlan(readGuestStorage(GUEST_KEYS.mealPlans, {})),
      shoppingList: readGuestStorage(GUEST_KEYS.shoppingList, []),
      nutritionHistory: [],
      notifications: readGuestStorage(GUEST_KEYS.notifications, [])
    };
    state.favorites = Array.isArray(guestSessionData.favorites) ? guestSessionData.favorites : [];
    state.pantry = Array.isArray(guestSessionData.pantry) ? guestSessionData.pantry.map((item) => ({ ...item, quantity: Math.max(1, parseInt(item.quantity, 10) || 1) })) : [];
    state.mealPlans = normalizeMealPlan(guestSessionData.mealPlans);
  }

  function persistGuestProgress() {
    if (!state.guestMode || isSwitchingAccount) return;
    try {
      writeGuestStorage(GUEST_KEYS.favorites, guestSessionData.favorites);
      writeGuestStorage(GUEST_KEYS.pantry, guestSessionData.pantry);
      writeGuestStorage(GUEST_KEYS.mealPlans, guestSessionData.mealPlans);
      writeGuestStorage(GUEST_KEYS.shoppingList, guestSessionData.shoppingList);
      writeGuestStorage(GUEST_KEYS.notifications, guestSessionData.notifications);
    } catch (error) {
      console.error("Unable to save temporary guest progress:", error);
      showToast("Unable to save temporary guest progress.", "error");
    }
  }

  function loadPersistentProgress() {
    state.favorites = loadFavorites();
    state.pantry = loadPantryFromStorage(createEmptyPantry());
    state.mealPlans = loadMealPlan(createEmptyMealPlan());
  }

  function loadCurrentUserProgress(user) {
    if (!user || !user.id) return;
    loadPersistentProgress();
  }

  function getActiveUserId() {
    return state.currentUser && !state.guestMode ? state.currentUser.id : "";
  }

  // Every registered Chef Nova account stores its own data
  // using the authenticated user's ID.
  // This prevents multiple accounts from sharing progress.
  function getUserStorageKey(feature) {
    const user = getCurrentUser();

    if (!user) {
      return null;
    }

    return `chefNova${feature}_${user.id}`;
  }

  function normalizeStorageFeature(featureOrKey) {
    const value = String(featureOrKey || "");
    if (USER_FEATURE_PREFIXES[value]) return value;
    return Object.keys(USER_FEATURE_PREFIXES).find((feature) => USER_FEATURE_PREFIXES[feature] === value || (LEGACY_SHARED_KEYS[feature] || []).includes(value)) || "";
  }

  function loadUserData(feature) {
    if (state.guestMode || isGuestMode()) return null;
    const normalizedFeature = normalizeStorageFeature(feature);
    if (!normalizedFeature) return null;
    const key = getUserStorageKey(normalizedFeature);
    if (!key) return null;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error(`Unable to load ${key}`, error);
      return null;
    }
  }

  function saveUserData(feature, value) {
    if (isSwitchingAccount) return false;
    if (state.guestMode || isGuestMode()) return false;
    const normalizedFeature = normalizeStorageFeature(feature);
    if (!normalizedFeature) return false;
    const key = getUserStorageKey(normalizedFeature);
    if (!key) return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Unable to save ${key}`, error);
      return false;
    }
  }

  function removeUserData(feature) {
    if (state.guestMode || isGuestMode()) return false;
    const normalizedFeature = normalizeStorageFeature(feature);
    if (!normalizedFeature) return false;
    const key = getUserStorageKey(normalizedFeature);
    if (!key) return false;
    localStorage.removeItem(key);
    return true;
  }

  function getStorageConfig(feature) {
    const normalizedFeature = normalizeStorageFeature(feature);
    if (!normalizedFeature) return null;
    if (!state.guestMode && getCurrentUser()) return { storage: localStorage, key: getUserStorageKey(normalizedFeature), temporary: false };
    if (state.guestMode || isGuestMode()) {
      const guestKeys = { Pantry: GUEST_KEYS.pantry, MealPlan: GUEST_KEYS.mealPlans, ShoppingList: GUEST_KEYS.shoppingList };
      return guestKeys[normalizedFeature] ? { storage: sessionStorage, key: guestKeys[normalizedFeature], temporary: true } : null;
    }
    return null;
  }

  function userStorageKey(baseKey) {
    const feature = normalizeStorageFeature(baseKey);
    return feature ? getUserStorageKey(feature) : null;
  }

  function readUserStorage(baseKey, fallback) {
    const value = loadUserData(baseKey);
    return value == null ? fallback : value;
  }

  function writeUserStorage(baseKey, value) {
    return saveUserData(baseKey, value);
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
  }

  function isValidAge(value) {
    const age = Number(value);
    return Number.isInteger(age) && age >= 1 && age <= 120;
  }

  function findUserByEmail(email) {
    const normalizedEmail = normalizeEmail(email);
    return state.users.find((user) => normalizeEmail(user.email) === normalizedEmail) || null;
  }

  function normalizeUserAccount(user = {}, users = []) {
    const normalizedEmail = normalizeEmail(user.email);
    if (!normalizedEmail) return null;
    return {
      id: String(user.id || generateUserId(users)),
      name: String(user.name || "").trim(),
      email: normalizedEmail,
      password: String(user.password || ""),
      age: Number(user.age) || 0,
      gender: String(user.gender || "").trim(),
      phone: String(user.phone || "").trim(),
      dietaryPreference: String(user.dietaryPreference || "No preference").trim(),
      allergies: normalizeAllergies(user.allergies)
    };
  }

  function getRegisteredUsers(fallbackUsers = []) {
    try {
      const savedUsers = localStorage.getItem(KEYS.users);
      const parsedUsers = savedUsers ? JSON.parse(savedUsers) : [];
      const currentUsers = Array.isArray(parsedUsers) ? parsedUsers : [];
      const oldUsers = read(KEYS.oldUsers, []);
      const combinedUsers = [...(Array.isArray(fallbackUsers) ? fallbackUsers : []), ...(Array.isArray(oldUsers) ? oldUsers : []), ...currentUsers];
      const usersByEmail = new Map();
      combinedUsers.forEach((user) => {
        const normalizedUser = normalizeUserAccount(user, Array.from(usersByEmail.values()));
        if (!normalizedUser) return;
        usersByEmail.set(normalizedUser.email, { ...usersByEmail.get(normalizedUser.email), ...normalizedUser });
      });
      const users = Array.from(usersByEmail.values());
      if (!savedUsers || (Array.isArray(oldUsers) && oldUsers.length)) saveRegisteredUsers(users);
      return users;
    } catch (error) {
      console.error("Unable to read registered users:", error);
      return [];
    }
  }

  function saveRegisteredUsers(users) {
    if (!Array.isArray(users)) return false;
    localStorage.setItem(KEYS.users, JSON.stringify(users.map((user) => normalizeUserAccount(user, users)).filter(Boolean)));
    return true;
  }

  function generateUserId(users = []) {
    const highestNumber = users.reduce((highest, user) => {
      const match = /^user-(\d+)$/.exec(String(user.id || ""));
      return match ? Math.max(highest, Number(match[1])) : highest;
    }, 0);
    return `user-${String(highestNumber + 1).padStart(3, "0")}`;
  }

  function getCurrentUserId() {
    const userId = localStorage.getItem(KEYS.session);
    return userId ? userId.trim() : null;
  }

  function setCurrentUserId(userId) {
    if (typeof userId !== "string" || !userId.trim()) throw new Error("A valid user ID is required.");
    // Save only the authenticated user's ID as the active session.
    // The full account profile remains in chefNovaUsers to avoid
    // duplicating personal information across localStorage keys.
    localStorage.setItem(KEYS.session, userId.trim());
  }

  function clearCurrentUserSession() {
    localStorage.removeItem(KEYS.session);
    localStorage.removeItem(KEYS.oldSession);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("loggedInUser");
    sessionStorage.removeItem(KEYS.session);
    sessionStorage.removeItem(KEYS.oldSession);
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("loggedInUser");
  }

  function restoreCurrentUserSession() {
    const activeUserId = getCurrentUserId();
    if (activeUserId) {
      const activeUser = state.users.find((user) => user.id === activeUserId);
      if (activeUser) {
        state.currentUser = activeUser;
        return activeUser;
      }
      clearCurrentUserSession();
      state.currentUser = null;
      return null;
    }
    const oldSession = read(KEYS.oldSession, null);
    if (!oldSession || typeof oldSession !== "object") {
      state.currentUser = null;
      return null;
    }
    const migratedUser = state.users.find((user) => user.id === oldSession.id) || state.users.find((user) => normalizeEmail(user.email) === normalizeEmail(oldSession.email));
    if (!migratedUser) {
      state.currentUser = null;
      return null;
    }
    setCurrentUserId(migratedUser.id);
    localStorage.removeItem(KEYS.oldSession);
    state.currentUser = migratedUser;
    return migratedUser;
  }

  async function loadStarter(path, fallback) {
    if (path === "data/recipes.json" && Array.isArray(window.CHEF_NOVA_RECIPES)) return window.CHEF_NOVA_RECIPES;
    if (location.protocol === "file:") return fallback;
    try { const response = await fetch(path); if (!response.ok) throw new Error("Unavailable"); return await response.json(); }
    catch (_) { return fallback; }
  }

  /* Load recipe data from recipes.json, with the same recipes built in for direct file opening. */
  async function loadRecipes() {
    return loadStarter("data/recipes.json", STARTER.recipes);
  }

  async function initialize() {
    const [recipes, users] = await Promise.all([
      loadRecipes(), loadStarter("data/users.json", STARTER.users)
    ]);
    state.recipes = recipes;
    state.users = getRegisteredUsers(users);
    state.pantry = loadPantryFromStorage(createEmptyPantry());
    state.favorites = loadFavorites();
    state.mealPlans = loadMealPlan(createEmptyMealPlan());
    state.currentUser = restoreCurrentUserSession();
    bindEvents(); initializeApp();
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const accountMenuToggle = event.target.closest("[data-account-menu-toggle]");
      if (accountMenuToggle) return toggleAccountMenu();
      if (!event.target.closest("#accountArea") && state.profileMenuOpen) closeAccountMenu();
      const mealSuggestion = event.target.closest("[data-meal-suggestion]");
      if (mealSuggestion) return selectMealSuggestion(mealSuggestion);
      if (!event.target.closest(".meal-combobox")) closeMealSuggestions();
      const notificationAction = event.target.closest("[data-notification-action]");
      if (notificationAction) return openNotificationAction(notificationAction.dataset.notificationAction);
      const notificationRead = event.target.closest("[data-notification-read]");
      if (notificationRead) return markNotificationAsRead(notificationRead.dataset.notificationRead);
      const notificationDelete = event.target.closest("[data-notification-delete]");
      if (notificationDelete) return deleteNotification(notificationDelete.dataset.notificationDelete);
      const notificationFilter = event.target.closest("[data-notification-filter]");
      if (notificationFilter) return filterNotifications(notificationFilter.dataset.notificationFilter);
      const profileEdit = event.target.closest("[data-profile-edit]");
      if (profileEdit) return showProfileEditor();
      const profileCancel = event.target.closest("[data-profile-cancel]");
      if (profileCancel) return cancelProfileEdit();
      const recommendationAction = event.target.closest("[data-weekly-recommendation-action]");
      if (recommendationAction) return handleWeeklyRecommendationAction(recommendationAction);
      const deleteNutritionHistoryButton = event.target.closest("[data-delete-nutrition-history]");
      if (deleteNutritionHistoryButton) return deleteNutritionHistoryEntry(deleteNutritionHistoryButton.dataset.deleteNutritionHistory);
      const passwordEdit = event.target.closest("[data-password-edit]");
      if (passwordEdit) return showPasswordEditor();
      const passwordCancel = event.target.closest("[data-password-cancel]");
      if (passwordCancel) return cancelPasswordEdit();
      const nutritionProfileEdit = event.target.closest("[data-nutrition-profile-edit]");
      if (nutritionProfileEdit) return openNutritionSetupFromProfile();
      const nutritionProfileDelete = event.target.closest("[data-nutrition-profile-delete]");
      if (nutritionProfileDelete) return deleteNutritionProfile();
      const bodyReferenceToggle = event.target.closest("[data-body-reference-toggle]");
      if (bodyReferenceToggle) return toggleBodyMeasurementReference(bodyReferenceToggle);
      const nutritionWeightToggle = event.target.closest("[data-nutrition-weight-toggle]");
      if (nutritionWeightToggle) return toggleWeightVisibility();
      const nutritionGoalsReset = event.target.closest("[data-nutrition-goals-reset]");
      if (nutritionGoalsReset) return resetNutritionGoals();
      const pageTarget = event.target.closest("[data-page]");
      if (pageTarget) { event.preventDefault(); closeAccountMenu(); navigate(pageTarget.dataset.page); }
      const instructionDetails = event.target.closest("[data-instruction-details]");
      if (instructionDetails) openInstructionModal(Number(instructionDetails.dataset.instructionDetails));
      const favorite = event.target.closest("[data-favorite]");
      if (favorite) toggleFavorite(favorite.dataset.favorite);
      const removeFavoriteButton = event.target.closest("[data-remove-favorite]");
      if (removeFavoriteButton) removeFavorite(removeFavoriteButton.dataset.removeFavorite);
      const favoriteStepsButton = event.target.closest("[data-favorite-steps]");
      if (favoriteStepsButton) openFavoriteRecipeModal(favoriteStepsButton.dataset.favoriteSteps);
      const recipeDetailsButton = event.target.closest("[data-recipe-details]");
      if (recipeDetailsButton) displayRecipeDetails(recipeDetailsButton.dataset.recipeDetails);
      const missingButton = event.target.closest("[data-add-missing]");
      if (missingButton) addMissingIngredientsToShoppingList(missingButton.dataset.addMissing);
      const toggleShoppingButton = event.target.closest("[data-toggle-shopping]");
      if (toggleShoppingButton) return toggleShoppingItem(toggleShoppingButton.dataset.toggleShopping);
      const removeShoppingButton = event.target.closest("[data-remove-shopping]");
      if (removeShoppingButton) return removeShoppingItem(removeShoppingButton.dataset.removeShopping);
      const remove = event.target.closest("[data-remove-pantry]");
      if (remove) removePantryItem(remove.dataset.removePantry);
      const ruleDetails = event.target.closest("[data-rule-details]");
      if (ruleDetails) openRuleModal(Number(ruleDetails.dataset.ruleDetails));
      const auth = event.target.closest("[data-auth]");
      if (auth && auth.dataset.auth === "logout") return logout();
      const passwordToggle = event.target.closest("[data-toggle-password]");
      if (passwordToggle) return togglePasswordVisibility(passwordToggle);
      const exitGuest = event.target.closest("[data-exit-guest]");
      if (exitGuest) return requestExitGuestMode();
      const guestAuth = event.target.closest("[data-guest-auth]");
      if (guestAuth) return openAuthFromGuest(guestAuth.dataset.guestAuth);
      const dashboardAuth = event.target.closest("[data-dashboard-auth]");
      if (dashboardAuth) return openDashboardAuth(dashboardAuth.dataset.dashboardAuth);
      const authMode = event.target.closest("[data-auth-mode]");
      if (authMode) { event.preventDefault(); showAuthMode(authMode.dataset.authMode); navigate("account"); }
      const generationMode = event.target.closest("[data-meal-generation-mode]");
      if (generationMode) return createSuggestedMealPlanPreview(generationMode.dataset.mealGenerationMode);
      const generationApply = event.target.closest("[data-apply-generated-plan]");
      if (generationApply) return applySuggestedMealPlan();
      const generationRegenerate = event.target.closest("[data-regenerate-meal-plan]");
      if (generationRegenerate) return regenerateSuggestedMealPlan();
      const generationCancel = event.target.closest("[data-cancel-generated-plan]");
      if (generationCancel) return cancelSuggestedMealPlanPreview();
      const generatedShopping = event.target.closest("[data-generated-shopping-list]");
      if (generatedShopping) return addGeneratedPlanMissingIngredientsToShoppingList();
    });
    $("#menuButton").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
    $$("[data-welcome-tab]").forEach((button) => {
      button.addEventListener("click", () => selectAuthTab(button.dataset.welcomeTab));
      button.addEventListener("keydown", handleAuthTabKeydown);
    });
    initializeGuestModeButton();
    $$("[data-welcome-back]").forEach((button) => button.addEventListener("click", resetWelcomeAuthPage));
    $$("[data-welcome-switch]").forEach((button) => button.addEventListener("click", () => {
      if (button.dataset.welcomeSwitch === "register") showSignUpForm();
      else showLoginForm();
    }));
    $("#startNutritionSetupButton")?.addEventListener("click", startNutritionSetup);
    $("#skipNutritionSetupButton")?.addEventListener("click", skipNutritionSetup);
    $("#nutritionProfileForm")?.addEventListener("submit", saveNutritionProfile);
    $$("input[name='nutritionUnitSystem']").forEach((input) => input.addEventListener("change", updateNutritionUnitFields));
    $("#nutritionAge")?.addEventListener("input", updateMinorWeightGoalNotice);
    $("#nutritionGeneralGoal")?.addEventListener("change", handleNutritionGoalChange);
    $("#nutritionProfileForm")?.addEventListener("input", clearNutritionFormErrors);
    $("#nutritionProfileForm")?.addEventListener("change", clearNutritionFormErrors);
    $("#returnNutritionSetupButton")?.addEventListener("click", handleNutritionFormBack);
    $("#skipNutritionSetupFromFormButton")?.addEventListener("click", handleNutritionFormSkip);
    $("#recipeSearchButton").addEventListener("click", () => searchRecipes({ requireIngredients: true, notify: true }));
    $("#recipeSearch").addEventListener("input", () => searchRecipes());
    $("#clearRecipeSearchButton").addEventListener("click", clearRecipeSearch);
    ["recipeCategoryFilter", "recipeCuisineFilter", "recipeDifficultyFilter", "recipeMaxTimeFilter", "recipeDietaryFilter", "hideAllergyRecipesFilter"].forEach((id) => {
      const element = $("#" + id);
      if (!element) return;
      element.addEventListener("input", updateRecipeFilters);
      element.addEventListener("change", updateRecipeFilters);
    });
    $$("[data-personalized-recipe-filter]").forEach((input) => input.addEventListener("change", updatePersonalizedRecipeFilters));
    $("#clearPersonalizedFiltersButton")?.addEventListener("click", clearPersonalizedRecipeFilters);
    $("#showPantryForm").addEventListener("click", () => $("#pantryForm input[name='name']").focus());
    $("#pantryForm").addEventListener("submit", addPantryItem);
    $("#saveWeeklyPlanButton").addEventListener("click", () => {
      saveMealPlan();
      updateWeeklyNutritionSummary({ showNotification: true });
      if (state.guestMode) showToast(`Meal plan saved for this session. ${GUEST_TEMPORARY_MESSAGE}`, "info");
      else showToast("Meal plan updated", "success", { saveToHistory: true, actionName: "View Meal Planner", actionTarget: "planner" });
    });
    $("#generateMealPlanButton")?.addEventListener("click", openMealPlanGenerationOptions);
    $("#clearMealPlanButton").addEventListener("click", clearMealPlan);
    $("#mealPlanMaxTimePreference")?.addEventListener("change", saveMealPlanningPreferencesFromForm);
    $("#mealPlanPreferredFoods")?.addEventListener("change", saveMealPlanningPreferencesFromForm);
    $("#mealPlanFoodsToAvoid")?.addEventListener("change", saveMealPlanningPreferencesFromForm);
    $$("[data-meal-style-preference]").forEach((input) => input.addEventListener("change", saveMealPlanningPreferencesFromForm));
    $("#saveNutritionHistoryButton").addEventListener("click", saveCurrentWeeklySummary);
    $("#clearNutritionHistoryButton").addEventListener("click", clearNutritionHistory);
    $("#mealPlanner").addEventListener("click", (event) => {
      const dayTab = event.target.closest("[data-meal-day]");
      if (dayTab) return setActiveMealDay(dayTab.dataset.mealDay);
      const action = event.target.closest("[data-meal-action]");
      if (!action) return;
      const { day, meal, mealAction } = action.dataset;
      if (mealAction === "add") addMeal(day, meal);
      if (mealAction === "delete") deleteMeal(day, meal);
    });
    $("#mealPlanner").addEventListener("input", (event) => {
      const input = event.target.closest("[data-meal-input]");
      if (input) {
        const selectedRecipe = findRecipeById(input.dataset.selectedRecipeId);
        if (!selectedRecipe || normalizeIngredient(selectedRecipe.name) !== normalizeIngredient(input.value)) input.dataset.selectedRecipeId = "";
        renderMealSuggestions(input);
      }
    });
    $("#mealPlanner").addEventListener("focusin", (event) => {
      const input = event.target.closest("[data-meal-input]");
      if (input) renderMealSuggestions(input);
    });
    $("#mealPlanner").addEventListener("keydown", (event) => {
      const input = event.target.closest("[data-meal-input]");
      if (input) handleMealComboboxKeydown(event, input);
    });
    $("#loginForm").addEventListener("submit", login);
    $("#registerForm").addEventListener("submit", createAccount);
    $("#welcomeLoginForm").addEventListener("submit", login);
    $("#welcomeRegisterForm").addEventListener("submit", createAccount);
    document.addEventListener("submit", (event) => {
      if (event.target.id === "profileEditForm") saveProfileChanges(event);
      if (event.target.id === "passwordChangeForm") savePasswordChange(event);
    });
    document.addEventListener("invalid", (event) => {
      if (event.target.closest("#profileEditForm, #passwordChangeForm")) notifyInvalidField(event.target);
    }, true);
    $("#markAllNotificationsReadButton").addEventListener("click", markAllNotificationsAsRead);
    $("#clearNotificationsButton").addEventListener("click", openClearNotificationsConfirm);
    $("#notificationConfirmClose").addEventListener("click", closeClearNotificationsConfirm);
    $("#cancelClearNotificationsButton").addEventListener("click", closeClearNotificationsConfirm);
    $("#confirmClearNotificationsButton").addEventListener("click", clearAllNotifications);
    $("#notificationConfirmModal").addEventListener("click", (event) => { if (event.target.id === "notificationConfirmModal") closeClearNotificationsConfirm(); });
    $("#nutritionConfirmClose")?.addEventListener("click", closeNutritionConfirm);
    $("#cancelNutritionConfirmButton")?.addEventListener("click", closeNutritionConfirm);
    $("#confirmNutritionActionButton")?.addEventListener("click", runNutritionConfirmAction);
    $("#nutritionConfirmModal")?.addEventListener("click", (event) => { if (event.target.id === "nutritionConfirmModal") closeNutritionConfirm(); });
    $("#mealPlanGenerationClose")?.addEventListener("click", closeMealPlanGenerationModal);
    $("#mealPlanGenerationModal")?.addEventListener("click", (event) => { if (event.target.id === "mealPlanGenerationModal") closeMealPlanGenerationModal(); });
    $("#accountRequiredClose").addEventListener("click", hideAccountRequiredModal);
    $("#accountRequiredContinue").addEventListener("click", hideAccountRequiredModal);
    $("#accountRequiredSignup").addEventListener("click", () => openAccountRequiredAuth("register"));
    $("#accountRequiredLogin").addEventListener("click", () => openAccountRequiredAuth("login"));
    $("#accountRequiredModal").addEventListener("click", (event) => { if (event.target.id === "accountRequiredModal") hideAccountRequiredModal(); });
    $("#confirmExitGuestModeButton").addEventListener("click", exitGuestMode);
    $("#cancelExitGuestModeButton").addEventListener("click", hideExitGuestModeDialog);
    $("#exitGuestModeModal").addEventListener("click", (event) => { if (event.target.id === "exitGuestModeModal") hideExitGuestModeDialog(); });
    $("#saveGuestProgressButton").addEventListener("click", () => completeGuestAccountUpgrade(true));
    $("#startFreshGuestProgressButton").addEventListener("click", () => completeGuestAccountUpgrade(false));
    ["loginForm", "registerForm", "welcomeLoginForm", "welcomeRegisterForm", "pantryForm"].forEach((id) => {
      const form = $("#" + id);
      if (!form) return;
      form.addEventListener("invalid", (event) => notifyInvalidField(event.target), true);
    });
    $("#ruleModalClose").addEventListener("click", closeRuleModal);
    $("#ruleModal").addEventListener("click", (event) => { if (event.target.id === "ruleModal") closeRuleModal(); });
    $("#favoriteRecipeModalClose").addEventListener("click", closeFavoriteRecipeModal);
    $("#favoriteRecipeModal").addEventListener("click", (event) => { if (event.target.id === "favoriteRecipeModal") closeFavoriteRecipeModal(); });
    $("#recipeDetailModalClose").addEventListener("click", closeRecipeDetailModal);
    $("#recipeDetailModal").addEventListener("click", (event) => { if (event.target.id === "recipeDetailModal") closeRecipeDetailModal(); });
    $("#recipeDetailModal").addEventListener("input", (event) => {
      const servingInput = event.target.closest("[data-recipe-detail-servings]");
      if (servingInput) updateRecipePlanFitSection(servingInput.dataset.recipeDetailServings);
    });
    $("#instructionModalClose").addEventListener("click", closeInstructionModal);
    $("#instructionModal").addEventListener("click", (event) => { if (event.target.id === "instructionModal") closeInstructionModal(); });
    document.addEventListener("keydown", (event) => { if (handleGuestUpgradeModalKeydown(event)) return; if (handleExitGuestModeModalKeydown(event)) return; if (handleAccountRequiredModalKeydown(event)) return; if (handleNutritionConfirmKeydown(event)) return; if (handleMealPlanGenerationKeydown(event)) return; if (event.key === "Escape") { closeRuleModal(); closeFavoriteRecipeModal(); closeInstructionModal(); closeRecipeDetailModal(); closeClearNotificationsConfirm(); closeNutritionConfirm(); closeMealPlanGenerationModal(); closeAccountMenu(); } });
    window.addEventListener("hashchange", () => navigate(location.hash.slice(1) || "home", false));
  }

  function navigate(page, updateHash = true) {
    if (!$("[data-page-section='" + page + "']")) page = "home";
    $$(".page").forEach((el) => el.classList.toggle("active", el.dataset.pageSection === page));
    setActiveNavigationItem(page);
    if (updateHash && location.hash !== "#" + page) history.pushState(null, "", "#" + page);
    $("#sidebar").classList.remove("open"); window.scrollTo(0, 0);
    if (page === "favorites") renderFavorites();
    if (page === "shopping-list") displayShoppingList();
    if (page === "account") renderAccountPage();
    if (page === "notifications") displayNotifications();
    if (page === "weekly-nutrition") displayWeeklyNutrition();
  }

  function initializeApp() {
    try {
      prepareInitialVisibility();
      clearCurrentPageData();
      const currentUser = restoreCurrentUserSession();
      if (currentUser) {
        clearGuestMode();
        state.currentUser = currentUser;
        state.guestMode = false;
        enterMainApp(currentUser, { restoredSession: true });
      } else if (isGuestMode()) {
        restoreGuestMode();
        enterMainApp(null, { restoredSession: true, mode: "guest" });
      } else {
        showAuthPage();
      }
    } catch (error) {
      console.error("Chef Nova initialization failed:", error);
      state.currentUser = null;
      clearCurrentUserSession();
      showAuthPage();
    }
  }

  function initializeAuthenticationState() {
    initializeApp();
  }

  function showAuthPage() {
    hideNutritionSetupIntro();
    state.guestMode = false;
    const welcome = $("#welcomeAuthPage");
    const app = $("#chefNovaApp");
    hideMainApp();
    hideNavigation();
    hideSidebar();
    hideGuestBanner();
    if (welcome) {
      welcome.hidden = false;
      welcome.removeAttribute("aria-hidden");
      welcome.classList.remove("hidden");
    }
    finishInitialVisibility();
    resetWelcomeAuthPage();
    const heading = $("#welcomeAuthTitle");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
  }

  function showWelcomeAuthPage() {
    showAuthPage();
  }

  function hideNutritionSetupIntro() {
    ["nutritionSetupIntro", "nutritionProfileFormScreen"].forEach((id) => {
      const screen = $("#" + id);
      if (!screen) return;
      screen.hidden = true;
      screen.setAttribute("aria-hidden", "true");
      screen.classList.add("hidden");
    });
  }

  function showNutritionSetupIntro(user) {
    if (!user) {
      enterMainApp(null);
      return;
    }
    hideMainApp();
    hideNavigation();
    hideSidebar();
    hideGuestBanner();
    const welcome = $("#welcomeAuthPage");
    if (welcome) {
      welcome.hidden = true;
      welcome.setAttribute("aria-hidden", "true");
      welcome.classList.add("hidden");
    }
    const formScreen = $("#nutritionProfileFormScreen");
    if (formScreen) {
      formScreen.hidden = true;
      formScreen.setAttribute("aria-hidden", "true");
      formScreen.classList.add("hidden");
    }
    const setupScreen = $("#nutritionSetupIntro");
    if (!setupScreen) {
      console.error("Personal Nutrition Setup screen was not found.");
      enterMainApp(user);
      return;
    }
    setupScreen.hidden = false;
    setupScreen.removeAttribute("aria-hidden");
    setupScreen.classList.remove("hidden");
    finishInitialVisibility();
    $("#nutritionSetupTitle")?.focus?.();
  }

  function showNutritionProfileForm(options = {}) {
    const user = getCurrentUser();
    const guest = state.guestMode || isGuestMode();
    if (!user && !guest) {
      showAuthPage();
      return;
    }
    nutritionSetupSource = options.source || "profile";
    hideNutritionSetupIntro();
    hideMainApp();
    hideNavigation();
    hideSidebar();
    const formScreen = $("#nutritionProfileFormScreen");
    if (!formScreen) return;
    formScreen.dataset.source = nutritionSetupSource;
    populateNutritionProfileForm(getActiveNutritionProfile() || createEmptyNutritionProfile());
    formScreen.hidden = false;
    formScreen.removeAttribute("aria-hidden");
    formScreen.classList.remove("hidden");
    updateNutritionUnitFields();
    finishInitialVisibility();
    $("#nutritionProfileFormTitle")?.focus?.();
  }

  function startNutritionSetup() {
    const user = getCurrentUser();
    if (!user && !(state.guestMode || isGuestMode())) {
      showAuthPage();
      return;
    }
    showNutritionProfileForm({ source: "onboarding" });
  }

  function skipNutritionSetup() {
    const user = getCurrentUser();
    if (!user && !(state.guestMode || isGuestMode())) return;
    saveCurrentNutritionProfile({
      ...createEmptyNutritionProfile(),
      setupCompleted: false,
      setupSkipped: true,
      profileCompleteness: "limited",
      updatedAt: getCurrentIsoString()
    });
    clearDailyNutritionTarget();
    hideNutritionSetupIntro();
    enterMainApp(user || { mode: "guest" });
    showToast("Nutrition setup skipped. You can complete it later from your Profile page.", "info");
  }

  function openNutritionSetupFromProfile() {
    const user = getCurrentUser();
    if (!user && !(state.guestMode || isGuestMode())) return;
    showNutritionProfileForm({ source: "profile" });
  }

  function getSelectedNutritionUnitSystem() {
    return $("input[name='nutritionUnitSystem']:checked")?.value || "";
  }

  function parseOptionalNumber(value) {
    const trimmed = String(value ?? "").trim();
    if (trimmed === "") return null;
    const number = Number(trimmed);
    return Number.isFinite(number) ? number : NaN;
  }

  function parseOptionalInteger(value) {
    const parsed = parseOptionalNumber(value);
    if (parsed === null) return null;
    return Number.isInteger(parsed) ? parsed : NaN;
  }

  function isOptionalNumberInRange(value, min, max) {
    return value === null || (Number.isFinite(value) && value >= min && value <= max);
  }

  function isOptionalIntegerInRange(value, min, max) {
    return value === null || (Number.isInteger(value) && value >= min && value <= max);
  }

  function updateNutritionUnitFields() {
    const unitSystem = getSelectedNutritionUnitSystem();
    const form = $("#nutritionProfileForm");
    const metricFields = $("#nutritionMetricFields");
    const imperialFields = $("#nutritionImperialFields");
    const previousUnitSystem = form?.dataset.activeUnit || "";
    const isMetric = unitSystem === "metric";
    const isImperial = unitSystem === "imperial";
    if (previousUnitSystem && unitSystem && previousUnitSystem !== unitSystem) {
      convertNutritionUnitValues(previousUnitSystem, unitSystem);
    }
    if (metricFields) metricFields.hidden = !isMetric;
    if (imperialFields) imperialFields.hidden = !isImperial;
    setNutritionUnitFieldRequirements(unitSystem);
    updateDesiredWeightUnitFields();
    updateDesiredWeightFields();
    if (form) form.dataset.activeUnit = unitSystem;
  }

  function setNutritionUnitFieldRequirements(unitSystem) {
    const metric = unitSystem === "metric";
    const imperial = unitSystem === "imperial";
    const fields = {
      nutritionHeightCm: metric,
      nutritionWeightKg: metric,
      nutritionHeightFeet: imperial,
      nutritionHeightInches: imperial,
      nutritionWeightLb: imperial
    };
    Object.entries(fields).forEach(([id, required]) => {
      const field = $("#" + id);
      if (!field) return;
      field.required = false;
      field.disabled = !required;
    });
  }

  function convertNutritionUnitValues(fromUnit, toUnit) {
    if (fromUnit === "metric" && toUnit === "imperial") {
      const heightCm = Number($("#nutritionHeightCm")?.value);
      const weightKg = Number($("#nutritionWeightKg")?.value);
      if (Number.isFinite(heightCm) && heightCm > 0) {
        const totalInches = Math.round(heightCm / 2.54);
        if ($("#nutritionHeightFeet")) $("#nutritionHeightFeet").value = Math.floor(totalInches / 12);
        if ($("#nutritionHeightInches")) $("#nutritionHeightInches").value = totalInches % 12;
      }
      if (Number.isFinite(weightKg) && weightKg > 0 && $("#nutritionWeightLb")) {
        $("#nutritionWeightLb").value = (weightKg * 2.2046226218).toFixed(1);
      }
      const desiredKg = Number($("#nutritionDesiredWeightKg")?.value);
      if (Number.isFinite(desiredKg) && desiredKg > 0 && $("#nutritionDesiredWeightLb")) {
        $("#nutritionDesiredWeightLb").value = (desiredKg * 2.2046226218).toFixed(1);
      }
    }
    if (fromUnit === "imperial" && toUnit === "metric") {
      const feet = Number($("#nutritionHeightFeet")?.value);
      const inches = Number($("#nutritionHeightInches")?.value);
      const weightLb = Number($("#nutritionWeightLb")?.value);
      if (Number.isInteger(feet) && Number.isInteger(inches) && feet > 0 && inches >= 0) {
        const heightCm = ((feet * 12) + inches) * 2.54;
        if ($("#nutritionHeightCm")) $("#nutritionHeightCm").value = heightCm.toFixed(1);
      }
      if (Number.isFinite(weightLb) && weightLb > 0 && $("#nutritionWeightKg")) {
        $("#nutritionWeightKg").value = (weightLb / 2.2046226218).toFixed(1);
      }
      const desiredLb = Number($("#nutritionDesiredWeightLb")?.value);
      if (Number.isFinite(desiredLb) && desiredLb > 0 && $("#nutritionDesiredWeightKg")) {
        $("#nutritionDesiredWeightKg").value = (desiredLb / 2.2046226218).toFixed(1);
      }
    }
  }

  function updateDesiredWeightFields() {
    const goal = normalizeNutritionGoal($("#nutritionGeneralGoal")?.value || "");
    const section = $("#desiredWeightSection");
    const shouldShow = goal === "gradual-weight-change";
    if (section) section.hidden = !shouldShow;
    setDesiredWeightRequirements(shouldShow);
    updateDesiredWeightUnitFields();
    updateMinorWeightGoalNotice();
    updateWorkoutSupportSection();
  }

  function handleNutritionGoalChange() {
    const form = $("#nutritionProfileForm");
    const goal = normalizeNutritionGoal($("#nutritionGeneralGoal")?.value || "");
    const hadWorkoutProfile = form?.dataset.hasSavedWorkoutProfile === "true";
    if (hadWorkoutProfile && goal !== "support-workouts" && form?.dataset.confirmedWorkoutClear !== "true") {
      if (!window.confirm("Changing this goal will remove the saved Workout Support information.")) {
        $("#nutritionGeneralGoal").value = "support-workouts";
        updateDesiredWeightFields();
        return;
      }
      form.dataset.confirmedWorkoutClear = "true";
      clearWorkoutSupportFields();
    }
    updateDesiredWeightFields();
  }

  function updateWorkoutSupportSection() {
    const section = $("#workoutSupportSection");
    const goal = normalizeNutritionGoal($("#nutritionGeneralGoal")?.value || "");
    const shouldShow = goal === "support-workouts";
    if (section) section.hidden = !shouldShow;
    ["nutritionMainActivity", "nutritionWorkoutDays", "nutritionWorkoutLength", "nutritionTrainingFocus"].forEach((id) => {
      const field = $("#" + id);
      if (field) field.disabled = !shouldShow;
    });
    updateMinorWorkoutSupportNotice();
  }

  function updateMinorWorkoutSupportNotice() {
    const notice = $("#minorWorkoutSupportNotice");
    const age = parseOptionalInteger($("#nutritionAge")?.value);
    const goal = normalizeNutritionGoal($("#nutritionGeneralGoal")?.value || "");
    if (notice) notice.hidden = !(Number.isInteger(age) && age < 18 && goal === "support-workouts");
  }

  function clearWorkoutSupportFields() {
    ["nutritionMainActivity", "nutritionWorkoutDays", "nutritionWorkoutLength", "nutritionTrainingFocus"].forEach((id) => {
      const field = $("#" + id);
      if (field) field.value = "";
    });
  }

  function updateDesiredWeightUnitFields() {
    const unitSystem = getSelectedNutritionUnitSystem();
    const section = $("#desiredWeightSection");
    const shouldShow = Boolean(section && !section.hidden);
    const metricField = $("#desiredWeightMetricField");
    const imperialField = $("#desiredWeightImperialField");
    if (metricField) metricField.hidden = !shouldShow || unitSystem !== "metric";
    if (imperialField) imperialField.hidden = !shouldShow || unitSystem !== "imperial";
  }

  function setDesiredWeightRequirements(shouldRequire) {
    const unitSystem = getSelectedNutritionUnitSystem();
    const desiredKg = $("#nutritionDesiredWeightKg");
    const desiredLb = $("#nutritionDesiredWeightLb");
    const reason = $("#nutritionWeightGoalReason");
    const pace = $("#nutritionPreferredPace");
    if (desiredKg) {
      desiredKg.required = false;
      desiredKg.disabled = !shouldRequire || unitSystem !== "metric";
    }
    if (desiredLb) {
      desiredLb.required = false;
      desiredLb.disabled = !shouldRequire || unitSystem !== "imperial";
    }
    [reason, pace].forEach((field) => {
      if (field) field.disabled = !shouldRequire;
    });
  }

  function updateMinorWeightGoalNotice() {
    const age = parseOptionalInteger($("#nutritionAge")?.value);
    const goal = normalizeNutritionGoal($("#nutritionGeneralGoal")?.value || "");
    const notice = $("#minorWeightGoalNotice");
    const shouldShow = Number.isInteger(age) && age < 18 && goal === "gradual-weight-change";
    if (notice) notice.hidden = !shouldShow;
    updateMinorWorkoutSupportNotice();
  }

  function populateNutritionProfileForm(profile) {
    const form = $("#nutritionProfileForm");
    if (!form) return;
    form.reset();
    form.dataset.activeUnit = "";
    clearNutritionFormErrors();
    const canonical = normalizeStoredNutritionProfile(profile) || createEmptyNutritionProfile();
    if ($("#nutritionAge")) $("#nutritionAge").value = canonical.age ?? "";
    $$("input[name='nutritionUnitSystem']").forEach((input) => {
      input.checked = input.value === canonical.unitSystem;
    });
    if (canonical.unitSystem === "metric") {
      if ($("#nutritionHeightCm")) $("#nutritionHeightCm").value = canonical.heightCm ?? "";
      if ($("#nutritionWeightKg")) $("#nutritionWeightKg").value = canonical.currentWeightKg ?? "";
      if ($("#nutritionDesiredWeightKg")) $("#nutritionDesiredWeightKg").value = canonical.desiredWeightKg ?? "";
    }
    if (canonical.unitSystem === "imperial") {
      const heightParts = centimetresToFeetAndInches(canonical.heightCm);
      if ($("#nutritionHeightFeet")) $("#nutritionHeightFeet").value = heightParts.feet ?? "";
      if ($("#nutritionHeightInches")) $("#nutritionHeightInches").value = heightParts.inches ?? "";
      if ($("#nutritionWeightLb")) $("#nutritionWeightLb").value = kilogramsToPounds(canonical.currentWeightKg) ?? "";
      if ($("#nutritionDesiredWeightLb")) $("#nutritionDesiredWeightLb").value = kilogramsToPounds(canonical.desiredWeightKg) ?? "";
    }
    if ($("#nutritionActivityLevel")) $("#nutritionActivityLevel").value = canonical.activityLevel || "";
    if ($("#nutritionGeneralGoal")) $("#nutritionGeneralGoal").value = canonical.goal || "";
    if ($("#nutritionWeightGoalReason")) $("#nutritionWeightGoalReason").value = canonical.weightGoalReason || "";
    if ($("#nutritionPreferredPace")) $("#nutritionPreferredPace").value = canonical.preferredPace || "";
    if ($("#nutritionMainActivity")) $("#nutritionMainActivity").value = canonical.workoutProfile?.mainActivity || "";
    if ($("#nutritionWorkoutDays")) $("#nutritionWorkoutDays").value = canonical.workoutProfile?.workoutDaysPerWeek ?? "";
    if ($("#nutritionWorkoutLength")) $("#nutritionWorkoutLength").value = canonical.workoutProfile?.typicalWorkoutLength || "";
    if ($("#nutritionTrainingFocus")) $("#nutritionTrainingFocus").value = canonical.workoutProfile?.trainingFocus || "";
    form.dataset.activeUnit = canonical.unitSystem || "";
    form.dataset.hasSavedWorkoutProfile = canonical.workoutProfile ? "true" : "false";
    form.dataset.confirmedWorkoutClear = "false";
    updateDesiredWeightFields();
  }

  function buildWorkoutProfileFromForm() {
    const mainActivity = normalizeOptionalText($("#nutritionMainActivity")?.value, 80);
    const workoutDaysPerWeek = parseOptionalInteger($("#nutritionWorkoutDays")?.value);
    const typicalWorkoutLength = normalizeWorkoutLength($("#nutritionWorkoutLength")?.value);
    const trainingFocus = normalizeTrainingFocus($("#nutritionTrainingFocus")?.value);
    const hasInformation = Boolean(mainActivity) || workoutDaysPerWeek !== null || Boolean(typicalWorkoutLength) || Boolean(trainingFocus);
    if (!hasInformation) return null;
    return { mainActivity, workoutDaysPerWeek, typicalWorkoutLength, trainingFocus };
  }

  function buildNutritionProfileFromForm(existingProfile = null) {
    const base = normalizeStoredNutritionProfile(existingProfile) || createEmptyNutritionProfile();
    const unitSystem = getSelectedNutritionUnitSystem() || base.unitSystem || "metric";
    let heightCm = null;
    let currentWeightKg = null;
    let desiredWeightKg = null;
    if (unitSystem === "metric") {
      heightCm = parseOptionalNumber($("#nutritionHeightCm")?.value);
      currentWeightKg = parseOptionalNumber($("#nutritionWeightKg")?.value);
      desiredWeightKg = parseOptionalNumber($("#nutritionDesiredWeightKg")?.value);
    }
    if (unitSystem === "imperial") {
      const feet = parseOptionalInteger($("#nutritionHeightFeet")?.value);
      const inches = parseOptionalInteger($("#nutritionHeightInches")?.value);
      const weightLb = parseOptionalNumber($("#nutritionWeightLb")?.value);
      const desiredLb = parseOptionalNumber($("#nutritionDesiredWeightLb")?.value);
      heightCm = feet === null ? null : feetAndInchesToCentimetres(feet, inches);
      currentWeightKg = weightLb === null ? null : poundsToKilograms(weightLb);
      desiredWeightKg = desiredLb === null ? null : poundsToKilograms(desiredLb);
    }
    const age = parseOptionalInteger($("#nutritionAge")?.value);
    const goal = normalizeNutritionGoal($("#nutritionGeneralGoal")?.value);
    if (goal !== "gradual-weight-change") desiredWeightKg = null;
    const profile = {
      version: 1,
      age,
      heightCm: Number.isFinite(heightCm) ? roundToOneDecimal(heightCm) : null,
      currentWeightKg: Number.isFinite(currentWeightKg) ? roundToOneDecimal(currentWeightKg) : null,
      desiredWeightKg: Number.isFinite(desiredWeightKg) ? roundToOneDecimal(desiredWeightKg) : null,
      activityLevel: normalizeActivityLevel($("#nutritionActivityLevel")?.value),
      goal,
      unitSystem,
      weightGoalReason: goal === "gradual-weight-change" ? normalizeOptionalText($("#nutritionWeightGoalReason")?.value, 300) : null,
      preferredPace: goal === "gradual-weight-change" ? normalizePreferredPace($("#nutritionPreferredPace")?.value) : null,
      workoutProfile: goal === "support-workouts" ? buildWorkoutProfileFromForm() : null,
      setupCompleted: true,
      setupSkipped: false,
      profileCompleteness: "limited",
      ageSafetyStatus: getAgeSafetyStatus(age),
      hideWeightInformation: base.hideWeightInformation === true,
      updatedAt: getCurrentIsoString()
    };
    profile.profileCompleteness = evaluateNutritionProfileCompleteness(profile);
    return profile;
  }

  function getNutritionFormData() {
    return buildNutritionProfileFromForm(getActiveNutritionProfile());
  }

  function evaluateNutritionProfileCompleteness(data) {
    const hasAge = Number.isInteger(data?.age);
    const hasHeight = Number.isFinite(data?.heightCm);
    const hasWeight = Number.isFinite(data?.currentWeightKg);
    const hasActivity = Boolean(data?.activityLevel);
    if (hasAge && hasHeight && hasWeight && hasActivity) return "sufficient-for-estimates";
    if (hasAge || hasHeight || hasWeight || hasActivity || data?.goal || Number.isFinite(data?.desiredWeightKg)) return "partial";
    return "limited";
  }

  function canCalculateNutritionEstimates(profile) {
    return Boolean(profile?.setupCompleted && Number.isInteger(profile?.age) && Number.isFinite(profile?.heightCm) && Number.isFinite(profile?.currentWeightKg) && profile?.activityLevel && canUseBodyBasedEstimate(profile));
  }

  function canUseBodyBasedEstimate(profile) {
    return Boolean(profile?.profileCompleteness === "sufficient-for-estimates" && profile?.ageSafetyStatus === "adult");
  }

  function shouldUseGeneralTeenGuidance(profile) {
    return profile?.ageSafetyStatus === "minor" || profile?.ageSafetyStatus === "unknown";
  }

  function canCalculateAdultBmi(profile) {
    return Boolean(
      profile?.ageSafetyStatus === "adult" &&
      Number.isFinite(profile?.heightCm) &&
      profile.heightCm > 0 &&
      Number.isFinite(profile?.currentWeightKg) &&
      profile.currentWeightKg > 0
    );
  }

  function calculateAdultBmi(profile) {
    if (!canCalculateAdultBmi(profile)) return null;
    const heightMetres = profile.heightCm / 100;
    const bmi = profile.currentWeightKg / (heightMetres * heightMetres);
    return Math.round(bmi * 10) / 10;
  }

  function buildNutritionPlanningContext(profile) {
    return {
      ageSafetyStatus: profile?.ageSafetyStatus || "unknown",
      activityLevel: profile?.activityLevel || null,
      goal: profile?.goal || null,
      profileCompleteness: profile?.profileCompleteness || "limited",
      energyEstimate: estimateDailyEnergyNeeds(profile),
      adultBmiReference: canCalculateAdultBmi(profile) ? calculateAdultBmi(profile) : null
    };
  }

  function canEstimateDailyEnergyNeeds(profile) {
    return Boolean(
      profile?.setupCompleted &&
      Number.isInteger(profile?.age) &&
      Number.isFinite(profile?.heightCm) &&
      profile.heightCm > 0 &&
      Number.isFinite(profile?.currentWeightKg) &&
      profile.currentWeightKg > 0 &&
      profile?.activityLevel &&
      profile?.profileCompleteness === "sufficient-for-estimates"
    );
  }

  function roundCaloriesToNearest50(value) {
    return Math.round(value / 50) * 50;
  }

  function isValidEnergyEstimate(value) {
    return Number.isFinite(value) && value > 0 && value <= 6000;
  }

  function isValidEnergyRange(minimumCalories, maximumCalories) {
    return Boolean(
      Number.isFinite(minimumCalories) &&
      Number.isFinite(maximumCalories) &&
      minimumCalories > 0 &&
      maximumCalories > minimumCalories &&
      maximumCalories <= 6000
    );
  }

  function getSafeAdultEnergyAdjustment(profile) {
    if (profile?.ageSafetyStatus !== "adult") return 0;
    if (profile.goal === "gradual-weight-change") {
      const current = profile.currentWeightKg;
      const desired = profile.desiredWeightKg;
      if (!Number.isFinite(current) || !Number.isFinite(desired)) return 0;
      if (desired > current) return 100;
      if (desired < current) return -100;
      return 0;
    }
    return ADULT_ENERGY_GOAL_ADJUSTMENTS[profile.goal] || 0;
  }

  function createUnavailableEnergyEstimate(profile, message, ageSafetyStatus = profile?.ageSafetyStatus || "unknown") {
    return {
      available: false,
      minimumCalories: null,
      maximumCalories: null,
      estimateType: "general-guidance",
      ageSafetyStatus,
      goalAdjustmentApplied: false,
      message
    };
  }

  function estimateDailyEnergyNeeds(profile) {
    if (profile?.ageSafetyStatus === "unknown") {
      return createUnavailableEnergyEstimate(profile, "Chef Nova needs age information to create an estimated energy range. General balanced-eating suggestions will be used instead.", "unknown");
    }
    if (!canEstimateDailyEnergyNeeds(profile)) {
      return createUnavailableEnergyEstimate(profile, "Chef Nova does not have enough information for an estimated energy range.");
    }
    const activityMultiplier = ENERGY_ACTIVITY_MULTIPLIERS[profile.activityLevel];
    if (!Number.isFinite(activityMultiplier)) {
      return createUnavailableEnergyEstimate(profile, "Chef Nova could not create a safe estimate from the selected activity level.");
    }
    // General software estimate only: this is not a clinical metabolism formula.
    const baselineEnergy = (10 * profile.currentWeightKg) + (6.25 * profile.heightCm) - (5 * profile.age);
    let centreEstimate = baselineEnergy * activityMultiplier;
    if (!isValidEnergyEstimate(centreEstimate)) {
      return createUnavailableEnergyEstimate(profile, "Chef Nova could not create a reliable estimate from the available information.");
    }
    const goalAdjustment = profile.ageSafetyStatus === "adult" ? getSafeAdultEnergyAdjustment(profile) : 0;
    centreEstimate += goalAdjustment;
    if (!isValidEnergyEstimate(centreEstimate)) {
      return createUnavailableEnergyEstimate(profile, "Chef Nova could not create a reliable estimate from the available information.");
    }
    const lowerGuard = profile.ageSafetyStatus === "minor" ? 1600 : 1200;
    let minimumCalories = roundCaloriesToNearest50(centreEstimate * 0.925);
    let maximumCalories = roundCaloriesToNearest50(centreEstimate * 1.075);
    if (minimumCalories === maximumCalories) {
      minimumCalories -= 50;
      maximumCalories += 50;
    }
    if (maximumCalories - minimumCalories < 200) {
      minimumCalories = roundCaloriesToNearest50(centreEstimate - 100);
      maximumCalories = roundCaloriesToNearest50(centreEstimate + 100);
    }
    if (minimumCalories < lowerGuard || maximumCalories > 6000 || !isValidEnergyRange(minimumCalories, maximumCalories)) {
      return createUnavailableEnergyEstimate(profile, "Chef Nova could not create a reliable estimate from the available information.");
    }
    return {
      available: true,
      minimumCalories,
      maximumCalories,
      estimateType: goalAdjustment !== 0 ? "adult-general-goal-adjusted" : "maintenance",
      ageSafetyStatus: profile.ageSafetyStatus,
      goalAdjustmentApplied: goalAdjustment !== 0,
      message: "This is a general estimate. Your actual needs may differ."
    };
  }

  function formatCalorieRange(result) {
    if (!result?.available) return null;
    return `${result.minimumCalories.toLocaleString()}\u2013${result.maximumCalories.toLocaleString()} calories`;
  }

  function roundMacroGrams(value) {
    return Math.round(value / 5) * 5;
  }

  function createReadableGramRange(minimumValue, maximumValue) {
    let minimum = roundMacroGrams(minimumValue);
    let maximum = roundMacroGrams(maximumValue);
    if (!Number.isFinite(minimum) || !Number.isFinite(maximum) || minimum <= 0 || maximum <= minimum) return null;
    if (maximum - minimum < 10) maximum = minimum + 10;
    return { minimum, maximum };
  }

  function createUnavailableMacronutrientEstimate(message) {
    return {
      available: false,
      calories: null,
      proteinGrams: null,
      carbohydrateGrams: null,
      fatGrams: null,
      fibreGuidance: "Include fibre-rich foods regularly",
      vegetablesAndFruitGuidance: "Include throughout the day",
      waterGuidance: "Drink regularly",
      message
    };
  }

  function estimateDailyMacronutrientRanges(energyEstimate) {
    if (!energyEstimate?.available || !Number.isFinite(energyEstimate.minimumCalories) || !Number.isFinite(energyEstimate.maximumCalories) || energyEstimate.minimumCalories <= 0 || energyEstimate.maximumCalories <= energyEstimate.minimumCalories) {
      return createUnavailableMacronutrientEstimate("Chef Nova does not have enough information to create estimated macronutrient ranges.");
    }
    const calories = {
      minimum: energyEstimate.minimumCalories,
      maximum: energyEstimate.maximumCalories
    };
    const carbohydrateGrams = createReadableGramRange(
      (calories.minimum * MACRONUTRIENT_PERCENT_RANGES.carbohydrates.minimum) / CALORIES_PER_GRAM.carbohydrates,
      (calories.maximum * MACRONUTRIENT_PERCENT_RANGES.carbohydrates.maximum) / CALORIES_PER_GRAM.carbohydrates
    );
    const fatGrams = createReadableGramRange(
      (calories.minimum * MACRONUTRIENT_PERCENT_RANGES.fat.minimum) / CALORIES_PER_GRAM.fat,
      (calories.maximum * MACRONUTRIENT_PERCENT_RANGES.fat.maximum) / CALORIES_PER_GRAM.fat
    );
    const proteinGrams = createReadableGramRange(
      (calories.minimum * MACRONUTRIENT_PERCENT_RANGES.protein.minimum) / CALORIES_PER_GRAM.protein,
      (calories.maximum * MACRONUTRIENT_PERCENT_RANGES.protein.maximum) / CALORIES_PER_GRAM.protein
    );
    if (!carbohydrateGrams || !fatGrams || !proteinGrams) {
      return createUnavailableMacronutrientEstimate("Chef Nova could not create a reliable macronutrient range from the available estimate.");
    }
    return {
      available: true,
      calories,
      proteinGrams,
      carbohydrateGrams,
      fatGrams,
      fibreGuidance: "General daily goal",
      vegetablesAndFruitGuidance: "Include throughout the day",
      waterGuidance: "Drink regularly",
      message: "These are general estimated ranges, not precise personal prescriptions."
    };
  }

  function formatGramRange(range) {
    if (!range || !Number.isFinite(range.minimum) || !Number.isFinite(range.maximum)) return null;
    return `${range.minimum.toLocaleString()}\u2013${range.maximum.toLocaleString()} g`;
  }

  function formatNutritionEstimate(nutritionEstimate) {
    if (!nutritionEstimate?.available) return null;
    return {
      calories: `${nutritionEstimate.calories.minimum.toLocaleString()}\u2013${nutritionEstimate.calories.maximum.toLocaleString()}`,
      protein: formatGramRange(nutritionEstimate.proteinGrams),
      carbohydrates: formatGramRange(nutritionEstimate.carbohydrateGrams),
      fat: formatGramRange(nutritionEstimate.fatGrams)
    };
  }

  function getCurrentNutritionProfile() {
    return getActiveNutritionProfile();
  }

  function validateOptionalAge(age) {
    if (age === null) return null;
    if (!Number.isInteger(age) || age < 13 || age > 120) return "Please enter a valid age.";
    return null;
  }

  function validateUnitSystem(unitSystem) {
    if (unitSystem !== "metric" && unitSystem !== "imperial") return "Please choose a valid unit system.";
    return null;
  }

  function validateCanonicalNutritionProfile(profile) {
    const errors = {};
    const ageError = validateOptionalAge(profile.age);
    if (ageError) errors.age = ageError;
    if (profile.heightCm !== null && (!Number.isFinite(profile.heightCm) || profile.heightCm <= 0 || profile.heightCm < 80 || profile.heightCm > 250)) errors.height = "Please enter a valid height.";
    if (profile.currentWeightKg !== null && (!Number.isFinite(profile.currentWeightKg) || profile.currentWeightKg <= 0 || profile.currentWeightKg < 20 || profile.currentWeightKg > 350)) errors.currentWeight = "Please enter a valid weight.";
    if (profile.desiredWeightKg !== null && (!Number.isFinite(profile.desiredWeightKg) || profile.desiredWeightKg <= 0 || profile.desiredWeightKg < 20 || profile.desiredWeightKg > 350)) errors.desiredWeight = "Please enter a valid desired weight.";
    const unitError = validateUnitSystem(profile.unitSystem);
    if (unitError) errors.unitSystem = unitError;
    if (profile.activityLevel !== null && !ACTIVITY_DISPLAY_LABELS[profile.activityLevel]) errors.activityLevel = "Please choose a valid activity level.";
    if (profile.goal !== null && !GOAL_DISPLAY_LABELS[profile.goal]) errors.goal = "Please choose a valid goal.";
    if (profile.preferredPace !== null && !PACE_DISPLAY_LABELS[profile.preferredPace]) errors.preferredPace = "Please choose a valid pace.";
    if (profile.workoutProfile) {
      const workoutErrors = validateWorkoutProfileForm(profile.workoutProfile);
      Object.assign(errors, workoutErrors);
    }
    return errors;
  }

  function getRawWorkoutProfileFormData() {
    return {
      mainActivity: String($("#nutritionMainActivity")?.value || "").trim(),
      workoutDaysPerWeek: parseOptionalInteger($("#nutritionWorkoutDays")?.value),
      typicalWorkoutLength: $("#nutritionWorkoutLength")?.value || "",
      trainingFocus: $("#nutritionTrainingFocus")?.value || ""
    };
  }

  function validateWorkoutProfileForm(rawWorkoutData) {
    const errors = {};
    if (rawWorkoutData.mainActivity && rawWorkoutData.mainActivity.length > 80) errors.mainActivity = "Please keep the activity name under 80 characters.";
    if (rawWorkoutData.workoutDaysPerWeek !== null && (!Number.isInteger(rawWorkoutData.workoutDaysPerWeek) || rawWorkoutData.workoutDaysPerWeek < 0 || rawWorkoutData.workoutDaysPerWeek > 7)) {
      errors.workoutDaysPerWeek = "Please enter a valid number of workout days.";
    }
    if (rawWorkoutData.typicalWorkoutLength && !normalizeWorkoutLength(rawWorkoutData.typicalWorkoutLength)) errors.typicalWorkoutLength = "Please choose a valid workout length.";
    if (rawWorkoutData.trainingFocus && !normalizeTrainingFocus(rawWorkoutData.trainingFocus)) errors.trainingFocus = "Please choose a valid training focus.";
    return errors;
  }

  function validateNutritionProfileForm(data) {
    const errors = {};
    const ageError = validateOptionalAge(data.age);
    const unitError = validateUnitSystem(data.unitSystem);
    if (ageError) errors.age = ageError;
    if (unitError) errors.unitSystem = unitError;
    if (data.unitSystem === "metric") {
      const height = parseOptionalNumber($("#nutritionHeightCm")?.value);
      const weight = parseOptionalNumber($("#nutritionWeightKg")?.value);
      if (!isOptionalNumberInRange(height, 80, 250)) errors.height = "Please enter a valid height.";
      if (!isOptionalNumberInRange(weight, 20, 350)) errors.currentWeight = "Please enter a valid weight.";
    }
    if (data.unitSystem === "imperial") {
      const feet = parseOptionalInteger($("#nutritionHeightFeet")?.value);
      const inches = parseOptionalInteger($("#nutritionHeightInches")?.value);
      if (feet === null && inches !== null) errors.height = "Please enter feet as well, or leave both height fields blank.";
      else if (inches !== null && (!Number.isInteger(inches) || inches < 0 || inches > 11)) errors.height = "Inches must be between 0 and 11.";
      else if (!isOptionalIntegerInRange(feet, 2, 8) || !isOptionalIntegerInRange(inches, 0, 11)) errors.height = "Please enter a valid height.";
      if (!isOptionalNumberInRange(parseOptionalNumber($("#nutritionWeightLb")?.value), 45, 800)) errors.currentWeight = "Please enter a valid weight.";
    }
    if (data.goal === "gradual-weight-change" && (data.unitSystem === "metric" || data.unitSystem === "imperial")) {
      const desired = data.unitSystem === "metric" ? parseOptionalNumber($("#nutritionDesiredWeightKg")?.value) : parseOptionalNumber($("#nutritionDesiredWeightLb")?.value);
      const rawPace = $("#nutritionPreferredPace")?.value || "";
      if (desired !== undefined && desired !== null && !isOptionalNumberInRange(desired, data.unitSystem === "metric" ? 20 : 45, data.unitSystem === "metric" ? 350 : 800)) errors.desiredWeight = "Please enter a valid desired weight.";
      if (rawPace && !normalizePreferredPace(rawPace)) errors.preferredPace = "Please choose a valid pace.";
    }
    const rawActivity = $("#nutritionActivityLevel")?.value || "";
    const rawGoal = $("#nutritionGeneralGoal")?.value || "";
    if (rawActivity && !normalizeActivityLevel(rawActivity)) errors.activityLevel = "Please choose a valid activity level.";
    if (rawGoal && !normalizeNutritionGoal(rawGoal)) errors.goal = "Please choose a valid goal.";
    if (data.goal === "support-workouts") Object.assign(errors, validateWorkoutProfileForm(getRawWorkoutProfileFormData()));
    if (data.activityLevel !== null && !ACTIVITY_DISPLAY_LABELS[data.activityLevel]) errors.activityLevel = "Please choose a valid activity level.";
    if (data.goal !== null && !GOAL_DISPLAY_LABELS[data.goal]) errors.goal = "Please choose a valid goal.";
    if (data.preferredPace !== null && !PACE_DISPLAY_LABELS[data.preferredPace]) errors.preferredPace = "Please choose a valid pace.";
    return errors;
  }

  function nutritionErrorTargets(fieldName) {
    const map = {
      age: ["nutritionAge"],
      unitSystem: ["nutritionUnitSystemGroup"],
      height: getSelectedNutritionUnitSystem() === "imperial" ? ["nutritionHeightFeet", "nutritionHeightInches"] : ["nutritionHeightCm"],
      weight: getSelectedNutritionUnitSystem() === "imperial" ? ["nutritionWeightLb"] : ["nutritionWeightKg"],
      currentWeight: getSelectedNutritionUnitSystem() === "imperial" ? ["nutritionWeightLb"] : ["nutritionWeightKg"],
      activityLevel: ["nutritionActivityLevel"],
      generalGoal: ["nutritionGeneralGoal"],
      goal: ["nutritionGeneralGoal"],
      desiredWeight: getSelectedNutritionUnitSystem() === "imperial" ? ["nutritionDesiredWeightLb"] : ["nutritionDesiredWeightKg"],
      preferredPace: ["nutritionPreferredPace"],
      mainActivity: ["nutritionMainActivity"],
      workoutDaysPerWeek: ["nutritionWorkoutDays"],
      typicalWorkoutLength: ["nutritionWorkoutLength"],
      trainingFocus: ["nutritionTrainingFocus"]
    };
    return map[fieldName] || [];
  }

  function displayNutritionFieldError(fieldName, message) {
    const targets = nutritionErrorTargets(fieldName);
    const errorId = `nutrition-${fieldName}-error`;
    let errorElement = $("#" + errorId);
    if (!errorElement) {
      errorElement = document.createElement("p");
      errorElement.id = errorId;
      errorElement.className = "form-error nutrition-form-error";
      errorElement.setAttribute("role", "alert");
      const firstTarget = $("#" + targets[0]);
      const container = fieldName === "unitSystem" ? $("#nutritionUnitSystemError") : firstTarget?.closest("label");
      if (container?.id === "nutritionUnitSystemError") container.replaceWith(errorElement);
      else container?.appendChild(errorElement);
    }
    targets.forEach((id) => {
      const field = $("#" + id);
      if (!field) return;
      setNutritionFieldError(field, errorElement, message);
    });
  }

  function setNutritionFieldError(field, errorElement, message) {
    if (!field || !errorElement) return;
    const hasError = Boolean(message);
    field.setAttribute("aria-invalid", hasError ? "true" : "false");
    if (hasError) {
      const describedBy = new Set(String(field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
      describedBy.add(errorElement.id);
      field.setAttribute("aria-describedby", Array.from(describedBy).join(" "));
      errorElement.textContent = message;
      errorElement.hidden = false;
    } else {
      const describedBy = String(field.getAttribute("aria-describedby") || "").split(/\s+/).filter((id) => id && id !== errorElement.id);
      if (describedBy.length) field.setAttribute("aria-describedby", describedBy.join(" "));
      else field.removeAttribute("aria-describedby");
      errorElement.textContent = "";
      errorElement.hidden = true;
    }
  }

  function clearNutritionFormErrors() {
    const form = $("#nutritionProfileForm");
    if (!form) return;
    form.querySelectorAll("[aria-invalid='true']").forEach((field) => {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    });
    form.querySelectorAll(".nutrition-form-error, #nutritionUnitSystemError").forEach((error) => {
      error.textContent = "";
      error.hidden = true;
    });
    const summary = $("#nutritionFormErrorSummary");
    if (summary) {
      summary.hidden = true;
      summary.classList.remove("active");
    }
  }

  function displayNutritionFormErrors(errors) {
    const summary = $("#nutritionFormErrorSummary");
    if (summary && Object.keys(errors).length) {
      summary.hidden = false;
      summary.classList.add("active");
    }
    Object.entries(errors).forEach(([fieldName, message]) => displayNutritionFieldError(fieldName, message));
  }

  function focusFirstNutritionError(errors) {
    const order = ["age", "unitSystem", "height", "currentWeight", "weight", "activityLevel", "goal", "generalGoal", "mainActivity", "workoutDaysPerWeek", "typicalWorkoutLength", "trainingFocus", "desiredWeight", "preferredPace"];
    const fieldName = order.find((name) => errors[name]);
    const target = fieldName === "unitSystem" ? $("input[name='nutritionUnitSystem']") : $("#" + nutritionErrorTargets(fieldName)[0]);
    if (target && typeof target.focus === "function") target.focus();
  }

  function saveNutritionProfile(event) {
    event.preventDefault();
    const user = getCurrentUser();
    const guest = state.guestMode || isGuestMode();
    if (!user && !guest) {
      showAuthPage();
      return;
    }
    const profile = buildNutritionProfileFromForm(getActiveNutritionProfile());
    const rawErrors = validateNutritionProfileForm(profile);
    const canonicalErrors = Object.keys(rawErrors).length ? {} : validateCanonicalNutritionProfile(profile);
    const errors = { ...rawErrors, ...canonicalErrors };
    clearNutritionFormErrors();
    if (Object.keys(errors).length) {
      displayNutritionFormErrors(errors);
      focusFirstNutritionError(errors);
      return;
    }
    const profileSaved = saveCurrentNutritionProfile(profile);
    const target = profileSaved ? recalculateDailyNutritionTarget(profile) : null;
    hideNutritionSetupIntro();
    enterMainApp(user || { mode: "guest" });
    updateProfileNutritionSection();
    updateNutritionTargetStatus(target ? "Nutrition estimates updated." : "General nutrition guidance will be used.");
    refreshRecipeResults();
    showToast("Nutrition profile saved.", "success");
  }

  function handleNutritionFormBack() {
    hideNutritionSetupIntro();
    if (nutritionSetupSource === "onboarding") {
      const user = getCurrentUser();
      if (user) showNutritionSetupIntro(user);
      else enterMainApp({ mode: "guest" }, { navigateHome: false });
      return;
    }
    enterMainApp(getCurrentUser() || { mode: "guest" }, { navigateHome: false });
    navigate("account");
  }

  function handleNutritionFormSkip() {
    const user = getCurrentUser();
    const guest = state.guestMode || isGuestMode();
    if (!user && !guest) return;
    if (nutritionSetupSource === "profile") {
      hideNutritionSetupIntro();
      enterMainApp(user || { mode: "guest" }, { navigateHome: false });
      navigate("account");
      return;
    }
    skipNutritionSetup();
  }

  function enterMainApp(userOrOptions = {}, options = {}) {
    hideNutritionSetupIntro();
    const firstArgument = userOrOptions || {};
    const user = firstArgument && firstArgument.id ? firstArgument : state.currentUser;
    const entryOptions = firstArgument && firstArgument.id ? options : firstArgument;
    const mode = user ? "authenticated" : (entryOptions.mode === "guest" || isGuestMode() ? "guest" : null);
    if (!mode) {
      showAuthPage();
      return;
    }
    beginAccountSwitch();
    try {
      const welcome = $("#welcomeAuthPage");
      const app = $("#chefNovaApp");
      if (welcome) {
        welcome.hidden = true;
        welcome.setAttribute("aria-hidden", "true");
        welcome.classList.add("hidden");
      }
      if (mode === "guest") {
        state.currentUser = null;
        state.guestMode = true;
      } else if (user) {
        state.currentUser = user;
        state.guestMode = false;
      }
      loadCurrentModeData(user);
      if (app) {
        app.hidden = false;
        app.removeAttribute("aria-hidden");
        app.classList.remove("hidden");
      }
      showSidebar();
      renderAll();
      updateNavigationForCurrentMode();
      finishInitialVisibility();
      renderAccount();
      updateHomePageForCurrentMode();
      updateDashboardWelcome(user);
      updateDashboardStats();
      if (state.guestMode) showGuestBanner();
      else hideGuestBanner();
      if (entryOptions.navigateHome !== false) openDashboardPage();
    } finally {
      endAccountSwitch();
    }
    if (entryOptions.focusDashboard !== false) focusDashboardHeading();
  }

  function showMainChefNovaApp() {
    enterMainApp({ navigateHome: false });
  }

  function openDashboardPage() {
    navigate("home");
  }

  function loadCurrentModeData(user = state.currentUser) {
    if (state.guestMode) {
      loadGuestProgress();
      return;
    }
    if (user) loadCurrentUserProgress(user);
  }

  function getUserDisplayName(user) {
    const name = typeof user?.name === "string" ? user.name.trim() : "";
    return name || "Chef";
  }

  function hideHomeCreateAccountSection() {
    const section = $("#homeCreateAccountSection");
    if (!section) return;
    section.hidden = true;
    section.setAttribute("aria-hidden", "true");
  }

  function showHomeCreateAccountSection() {
    const section = $("#homeCreateAccountSection");
    if (!section) return;
    section.hidden = false;
    section.removeAttribute("aria-hidden");
  }

  function updateHomePageForCurrentMode() {
    const user = !state.guestMode ? getCurrentUser() : null;
    if (user) {
      hideHomeCreateAccountSection();
      return;
    }
    if (state.guestMode || isGuestMode()) {
      showHomeCreateAccountSection();
      return;
    }
    hideHomeCreateAccountSection();
  }

  function updateDashboardWelcome(user = state.currentUser) {
    const title = $("#dashboardWelcomeTitle");
    const message = $("#dashboardWelcomeMessage");
    const guestMessage = $("#guestDashboardMessage");
    const guestActions = $("#guestDashboardActions");
    if (!title) return;
    const activeUser = !state.guestMode ? (user || getCurrentUser()) : null;
    if (activeUser) {
      hideHomeCreateAccountSection();
      title.textContent = `Welcome back, ${getUserDisplayName(activeUser)}!`;
      if (message) message.textContent = "Your saved Chef Nova kitchen is ready.";
      if (guestMessage) guestMessage.classList.add("hidden");
      if (guestActions) guestActions.classList.add("hidden");
      return;
    }
    if (state.guestMode || isGuestMode()) {
      showHomeCreateAccountSection();
      title.textContent = "Welcome, Guest!";
      if (message) message.textContent = "Explore Chef Nova and try the dashboard tools.";
      if (guestMessage) {
        guestMessage.textContent = "Sign up to save your favorites, pantry, meal plans, and progress.";
        guestMessage.classList.remove("hidden");
      }
      if (guestActions) guestActions.classList.remove("hidden");
      return;
    }
    title.textContent = "Chef Nova Dashboard";
    if (message) message.textContent = "Your cooking assistant is ready.";
    if (guestMessage) guestMessage.classList.add("hidden");
    if (guestActions) guestActions.classList.add("hidden");
    updateHomePageForCurrentMode();
  }

  function updateDashboardStats() {
    const target = $("#dashboardStats");
    if (!target) return;
    const progress = getSavedProgressSummary();
    target.innerHTML = `<article class="summary-card"><span>Favorite recipes</span><strong>${progress.favorites}</strong></article>
      <article class="summary-card"><span>Pantry items</span><strong>${progress.pantry}</strong></article>
      <article class="summary-card"><span>Meals planned</span><strong>${progress.mealsPlanned} / ${progress.totalMeals}</strong></article>
      <article class="summary-card ${state.guestMode ? "warning" : ""}"><span>Mode</span><strong>${state.guestMode ? "Guest" : "Saved"}</strong></article>`;
  }

  function focusDashboardHeading() {
    const heading = $("#dashboardWelcomeTitle");
    if (!heading) return;
    heading.setAttribute("tabindex", "-1");
    heading.focus();
  }

  function openDashboardAuth(mode = "login") {
    closeOpenDialogsForAuthChange();
    showAuthPage();
    selectAuthTab(mode === "register" ? "register" : "login", { focus: false });
    focusWelcomeAuthField(mode);
  }

  function focusWelcomeAuthField(mode = "login") {
    const form = mode === "register" ? $("#welcomeRegisterForm") : $("#welcomeLoginForm");
    const selector = mode === "register" ? "input[name='name']" : "input[name='email']";
    const field = form ? (form.querySelector(selector) || form.querySelector("input, select, textarea")) : null;
    if (field) field.focus();
  }

  function closeOpenDialogsForAuthChange() {
    hideGuestUpgradeModal();
    hideExitGuestModeDialog();
    hideAccountRequiredModal();
    closeRuleModal();
    closeFavoriteRecipeModal();
    closeInstructionModal();
    closeRecipeDetailModal();
    closeClearNotificationsConfirm();
    closeNutritionConfirm();
    closeAccountMenu();
    document.body.classList.remove("modal-open");
  }

  function openNutritionConfirm({ title, message, confirmLabel, danger = true, onConfirm }) {
    const modal = $("#nutritionConfirmModal");
    const titleElement = $("#nutritionConfirmTitle");
    const messageElement = $("#nutritionConfirmMessage");
    const confirmButton = $("#confirmNutritionActionButton");
    const cancelButton = $("#cancelNutritionConfirmButton");
    if (!modal || !titleElement || !messageElement || !confirmButton || !cancelButton) return;
    nutritionConfirmLastFocus = document.activeElement;
    pendingNutritionConfirmAction = typeof onConfirm === "function" ? onConfirm : null;
    titleElement.textContent = title;
    messageElement.textContent = message;
    confirmButton.textContent = confirmLabel;
    confirmButton.classList.toggle("danger-button", danger);
    modal.hidden = false;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    setNutritionConfirmBackgroundDisabled(true);
    setTimeout(() => cancelButton.focus(), 0);
  }

  function closeNutritionConfirm() {
    const modal = $("#nutritionConfirmModal");
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    pendingNutritionConfirmAction = null;
    setNutritionConfirmBackgroundDisabled(false);
    document.body.classList.remove("modal-open");
    const focusTarget = nutritionConfirmLastFocus;
    nutritionConfirmLastFocus = null;
    if (focusTarget && typeof focusTarget.focus === "function" && document.contains(focusTarget)) focusTarget.focus();
  }

  function runNutritionConfirmAction() {
    const action = pendingNutritionConfirmAction;
    pendingNutritionConfirmAction = null;
    closeNutritionConfirm();
    if (typeof action === "function") action();
  }

  function setNutritionConfirmBackgroundDisabled(disabled) {
    ["#chefNovaApp", "#welcomeAuthPage", "#nutritionSetupIntro", "#nutritionProfileFormScreen"].forEach((selector) => {
      const element = $(selector);
      if (!element || element.hidden || !("inert" in element)) return;
      element.inert = disabled;
    });
  }

  function handleNutritionConfirmKeydown(event) {
    const modal = $("#nutritionConfirmModal");
    if (!modal || modal.classList.contains("hidden")) return false;
    if (event.key === "Escape") {
      event.preventDefault();
      closeNutritionConfirm();
      return true;
    }
    if (event.key !== "Tab") return false;
    const focusable = $$("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])", modal).filter((element) => !element.disabled && element.tabIndex >= 0 && element.offsetParent !== null);
    if (!focusable.length) return false;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return true;
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
      return true;
    }
    return false;
  }

  function showGuestUpgradeModal(user) {
    const modal = $("#guestUpgradeModal");
    const saveButton = $("#saveGuestProgressButton");
    if (!modal || !saveButton) return;
    pendingGuestUpgradeUser = user;
    modal.hidden = false;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    setGuestUpgradeBackgroundDisabled(true);
    setTimeout(() => saveButton.focus(), 0);
  }

  function hideGuestUpgradeModal() {
    const modal = $("#guestUpgradeModal");
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    setGuestUpgradeBackgroundDisabled(false);
  }

  function setGuestUpgradeBackgroundDisabled(disabled) {
    ["#chefNovaApp", "#welcomeAuthPage"].forEach((selector) => {
      const element = $(selector);
      if (!element || element.hidden || !("inert" in element)) return;
      element.inert = disabled;
    });
  }

  function handleGuestUpgradeModalKeydown(event) {
    const modal = $("#guestUpgradeModal");
    if (!modal || modal.classList.contains("hidden")) return false;
    if (event.key === "Escape") {
      event.preventDefault();
      return true;
    }
    if (event.key !== "Tab") return false;
    const focusable = $$("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])", modal).filter((element) => !element.disabled && element.tabIndex >= 0 && element.offsetParent !== null);
    if (!focusable.length) return false;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return true;
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
      return true;
    }
    return false;
  }

  function completeGuestAccountUpgrade(saveProgress) {
    const user = pendingGuestUpgradeUser;
    if (!user) return;
    try {
      if (saveProgress) copyGuestProgressToUser(user);
      sessionStorage.removeItem(getGuestNutritionTargetsKey());
      pendingGuestUpgradeUser = null;
      hideGuestUpgradeModal();
      completeNewAccountEntry(user);
      showToast(saveProgress ? "Your guest progress has been saved to your new account." : "Your account was created. You are starting fresh.", "success", { saveToHistory: true, actionName: "View Dashboard", actionTarget: "home" });
    } catch (error) {
      console.error("Unable to save guest progress:", error);
      showToast("Unable to save your guest progress. Please try again.", "error");
    }
  }

  function beginAccountSwitch() {
    isSwitchingAccount = true;
    document.body.classList.add("user-data-loading");
    const mainContent = $(".main-content");
    if (mainContent) mainContent.setAttribute("aria-busy", "true");
    closeOpenDialogsForAuthChange();
    clearCurrentPageData();
  }

  function endAccountSwitch() {
    isSwitchingAccount = false;
    document.body.classList.remove("user-data-loading");
    const mainContent = $(".main-content");
    if (mainContent) mainContent.setAttribute("aria-busy", "false");
  }

  function clearCurrentPageData() {
    // Clear displayed user-specific content
    clearRenderedFavorites();
    clearRenderedPantry();
    clearRenderedMealPlanner();
    clearRenderedShoppingList();
    clearRenderedWeeklyNutrition();
    clearRenderedNutritionHistory();
    clearRenderedCookingHistory();
    clearRenderedProfile();
    clearDashboardUserData();
    clearUserWelcomeMessage();
    resetCurrentUserDataInMemory();
    state.personalizedRecipeFilters = createEmptyPersonalizedRecipeFilterState();
    pendingGeneratedMealPlan = null;
    $$("[data-personalized-recipe-filter]").forEach((input) => { input.checked = false; });
  }

  function clearRenderedFavorites() {
    ["favoriteResults", "recipeFinderFavorites"].forEach(clearElementChildren);
  }

  function clearRenderedPantry() {
    ["pantrySummary", "pantryList", "pantryRecipeSuggestions"].forEach(clearElementChildren);
    $("#pantryForm")?.reset();
  }

  function clearRenderedMealPlanner() {
    clearElementChildren("mealPlanner");
    state.activeMealDay = "Monday";
  }

  function clearRenderedShoppingList() {
    clearElementChildren("shoppingListContent");
  }

  function clearRenderedWeeklyNutrition() {
    clearElementChildren("weeklyNutritionContent");
  }

  function clearRenderedNutritionHistory() {
    $$(".nutrition-history-section, .nutrition-history-grid").forEach((element) => element.replaceChildren());
  }

  function clearRenderedCookingHistory() {
    clearElementChildren("cookingHistoryContent");
  }

  function clearRenderedProfile() {
    clearElementChildren("accountProfile");
    $("#profileEditForm")?.reset();
    $("#passwordChangeForm")?.reset();
    state.isEditingProfile = false;
    state.isChangingPassword = false;
  }

  function clearDashboardUserData() {
    clearElementChildren("dashboardStats");
    const accountArea = $("#accountArea");
    const navigationStatus = $("#navigationAccountStatus");
    if (accountArea) accountArea.innerHTML = "";
    if (navigationStatus) {
      navigationStatus.textContent = "";
      navigationStatus.hidden = true;
    }
    $("#sidebar")?.classList.remove("open");
  }

  function clearUserWelcomeMessage() {
    const title = $("#dashboardWelcomeTitle");
    const message = $("#dashboardWelcomeMessage");
    const guestMessage = $("#guestDashboardMessage");
    const guestActions = $("#guestDashboardActions");
    hideHomeCreateAccountSection();
    if (title) title.textContent = "";
    if (message) message.textContent = "";
    if (guestMessage) {
      guestMessage.textContent = "";
      guestMessage.classList.add("hidden");
    }
    if (guestActions) guestActions.classList.add("hidden");
  }

  function resetCurrentUserDataInMemory() {
    state.currentUser = null;
    state.profileMenuOpen = false;
    state.favorites = [];
    state.pantry = [];
    state.mealPlans = createEmptyMealPlan();
    resetGuestSessionData();
  }

  function clearElementChildren(id) {
    const target = $("#" + id);
    if (target) target.replaceChildren();
  }

  function clearRegisteredDashboardState() {
    clearCurrentPageData();
  }

  function prepareInitialVisibility() {
    hideMainApp();
    const welcome = $("#welcomeAuthPage");
    if (welcome) {
      welcome.hidden = true;
      welcome.setAttribute("aria-hidden", "true");
      welcome.classList.add("hidden");
    }
  }

  function finishInitialVisibility() {
    document.body.classList.remove("app-initializing");
    const status = $("#appStartupStatus");
    if (status) status.hidden = true;
  }

  function hideMainApp() {
    const app = $("#chefNovaApp");
    if (!app) return;
    app.hidden = true;
    app.setAttribute("aria-hidden", "true");
    app.classList.add("hidden");
  }

  function showNavigation() {
    $$(".main-nav, .topbar").forEach((element) => {
      element.hidden = false;
      element.removeAttribute("aria-hidden");
    });
  }

  function hideNavigation() {
    $$(".main-nav, .topbar").forEach((element) => {
      element.hidden = true;
      element.setAttribute("aria-hidden", "true");
    });
    resetNavigationVisibility();
    updateNavigationAccountStatus(null);
  }

  function updateNavigationForCurrentMode() {
    const user = !state.guestMode ? getCurrentUser() : null;
    const guest = !user && (state.guestMode || isGuestMode());
    resetNavigationVisibility();
    if (user) {
      showNavigation();
      showRegisteredNavigation();
      updateNavigationAccountStatus(user);
      return;
    }
    if (guest) {
      showNavigation();
      showGuestNavigation();
      updateNavigationAccountStatus(null, true);
      return;
    }
    hideNavigation();
  }

  function resetNavigationVisibility() {
    $$("[data-nav-item]").forEach((item) => {
      item.hidden = true;
      item.setAttribute("aria-hidden", "true");
      item.removeAttribute("aria-current");
      item.classList.remove("active");
    });
  }

  function setNavigationItemVisible(itemName, visible) {
    $$(`[data-nav-item="${itemName}"]`).forEach((item) => {
      item.hidden = !visible;
      if (visible) item.removeAttribute("aria-hidden");
      else {
        item.setAttribute("aria-hidden", "true");
        item.removeAttribute("aria-current");
        item.classList.remove("active");
      }
    });
  }

  function showRegisteredNavigation() {
    REGISTERED_NAV_ITEMS.forEach((itemName) => setNavigationItemVisible(itemName, true));
    ["signup", "login", "exitGuest"].forEach((itemName) => setNavigationItemVisible(itemName, false));
    setActiveNavigationItem($(".page.active")?.dataset.pageSection || "home");
  }

  function showGuestNavigation() {
    GUEST_NAV_ITEMS.forEach((itemName) => setNavigationItemVisible(itemName, true));
    ["favorites", "profile", "logout"].forEach((itemName) => setNavigationItemVisible(itemName, false));
    setActiveNavigationItem($(".page.active")?.dataset.pageSection || "home");
  }

  function updateNavigationAccountStatus(user, guest = false) {
    const status = $("#navigationAccountStatus");
    if (!status) return;
    if (user) {
      status.hidden = false;
      status.textContent = `Signed in as ${getUserDisplayName(user)}`;
      return;
    }
    if (guest) {
      status.hidden = false;
      status.textContent = "Guest Mode";
      return;
    }
    status.textContent = "";
    status.hidden = true;
  }

  function setActiveNavigationItem(pageName) {
    const activeItem = NAV_PAGE_ITEMS[pageName] || "home";
    $$("[data-page]").forEach((item) => {
      const isActive = item.dataset.navItem === activeItem && !item.hidden;
      item.classList.toggle("active", isActive);
      if (isActive) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
  }

  function showSidebar() {
    const sidebar = $("#sidebar");
    if (!sidebar) return;
    sidebar.hidden = false;
    sidebar.removeAttribute("aria-hidden");
  }

  function hideSidebar() {
    const sidebar = $("#sidebar");
    if (!sidebar) return;
    sidebar.hidden = true;
    sidebar.setAttribute("aria-hidden", "true");
    sidebar.classList.remove("open");
  }

  function focusActivePageHeading() {
    const heading = $(".page.active h1, .page.active h2");
    if (!heading) return;
    heading.setAttribute("tabindex", "-1");
    heading.focus();
  }

  function initializeAuthLayout() {
    selectAuthTab("login", { focus: false, clearSensitive: true });
  }

  function showLoginPanel() {
    selectAuthTab("login");
  }

  function showSignUpPanel() {
    selectAuthTab("register");
  }

  function showLoginForm() {
    showLoginPanel();
  }

  function showSignUpForm() {
    showSignUpPanel();
  }

  function selectAuthTab(tabName, options = {}) {
    const isLogin = tabName !== "register";
    const loginTab = $("#welcomeLoginTab");
    const signUpTab = $("#welcomeSignUpTab");
    const loginPanel = $("#welcomeLoginPanel");
    const signUpPanel = $("#welcomeRegisterPanel");
    if (!loginTab || !signUpTab || !loginPanel || !signUpPanel) return;
    loginTab.classList.toggle("active", isLogin);
    signUpTab.classList.toggle("active", !isLogin);
    loginTab.setAttribute("aria-selected", String(isLogin));
    signUpTab.setAttribute("aria-selected", String(!isLogin));
    loginTab.tabIndex = isLogin ? 0 : -1;
    signUpTab.tabIndex = isLogin ? -1 : 0;
    loginPanel.hidden = !isLogin;
    signUpPanel.hidden = isLogin;
    loginPanel.classList.toggle("hidden", !isLogin);
    signUpPanel.classList.toggle("hidden", isLogin);
    clearAllAuthErrors($("#welcomeLoginForm"));
    clearAllAuthErrors($("#welcomeRegisterForm"));
    if (options.clearSensitive !== false) clearWelcomePasswordFields();
    if (options.focus === false) return;
    const activePanel = isLogin ? loginPanel : signUpPanel;
    const heading = activePanel.querySelector("h2");
    const firstField = activePanel.querySelector("input, select, textarea");
    (heading || firstField)?.focus();
  }

  function handleAuthTabKeydown(event) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = $$("[data-welcome-tab]");
    const activeIndex = tabs.findIndex((tab) => tab === event.currentTarget);
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : event.key === "ArrowRight" ? (activeIndex + 1) % tabs.length : (activeIndex - 1 + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    if (!nextTab) return;
    selectAuthTab(nextTab.dataset.welcomeTab, { focus: false });
    nextTab.focus();
  }

  function clearWelcomePasswordFields() {
    ["welcomeLoginForm", "welcomeRegisterForm"].forEach((id) => {
      const form = $("#" + id);
      if (!form) return;
      form.querySelectorAll("input[type='password']").forEach((input) => { input.value = ""; });
    });
  }

  function resetWelcomeAuthPage() {
    initializeAuthLayout();
    ["welcomeLoginForm", "welcomeRegisterForm"].forEach((id) => {
      const form = $("#" + id);
      if (!form) return;
      form.querySelectorAll("[aria-invalid='true']").forEach((field) => {
        field.removeAttribute("aria-invalid");
        field.removeAttribute("aria-describedby");
      });
    });
    ["welcomeLoginMessage", "welcomeRegisterMessage"].forEach((id) => { const message = $("#" + id); if (message) message.textContent = ""; });
    const firstTab = $("#welcomeLoginTab");
    if (firstTab && !$("#welcomeAuthPage").classList.contains("hidden")) firstTab.focus();
  }

  function togglePasswordVisibility(button) {
    const field = button.closest(".password-field");
    const input = field?.querySelector("input");
    if (!input) return;
    const isShowing = input.type === "text";
    input.type = isShowing ? "password" : "text";
    button.textContent = isShowing ? "Show" : "Hide";
    button.setAttribute("aria-pressed", String(!isShowing));
  }

  function initializeGuestModeButton() {
    const guestButton = $("#continueGuestBtn") || $("#welcomeGuestButton");
    if (!guestButton) {
      console.warn("Guest Mode button was not found on this page.");
      return;
    }
    if (guestButton.dataset.guestModeInitialized === "true") return;
    guestButton.dataset.guestModeInitialized = "true";
    guestButton.addEventListener("click", handleContinueAsGuest);
  }

  function handleContinueAsGuest(event) {
    startGuestMode(event);
  }

  function startGuestMode(event) {
    if (event) event.preventDefault();
    try {
      hideNutritionSetupIntro();
      closeOpenDialogsForAuthChange();
      clearCurrentPageData();
      initializeGuestModeSession();
      restoreGuestMode();
      enterMainApp(null, { mode: "guest" });
      notifySafely("You are using Chef Nova as a guest. Create an account to save your progress.", "info");
      $("#guestModeBanner")?.focus?.();
    } catch (error) {
      console.error("Unable to start guest mode:", error);
      notifySafely("Unable to start guest mode. Please refresh the page and try again.", "error");
      sessionStorage.removeItem(GUEST_KEYS.mode);
      sessionStorage.removeItem(GUEST_KEYS.session);
      state.guestMode = false;
      showAuthPage();
    }
  }

  function enterGuestMode() {
    startGuestMode();
  }

  function restoreGuestMode() {
    initializeGuestData();
    state.guestMode = true;
    state.currentUser = null;
    loadGuestProgress();
    showGuestBanner();
  }

  function requestExitGuestMode() {
    if (!(state.guestMode || isGuestMode())) return;
    showExitGuestModeDialog();
  }

  function showExitGuestModeDialog() {
    const modal = $("#exitGuestModeModal");
    const cancelButton = $("#cancelExitGuestModeButton");
    if (!modal || !cancelButton) return;
    exitGuestModeLastFocus = document.activeElement;
    modal.hidden = false;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    setExitGuestModeBackgroundDisabled(true);
    setTimeout(() => cancelButton.focus(), 0);
  }

  function hideExitGuestModeDialog() {
    const modal = $("#exitGuestModeModal");
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    setExitGuestModeBackgroundDisabled(false);
    const focusTarget = exitGuestModeLastFocus;
    exitGuestModeLastFocus = null;
    if (focusTarget && typeof focusTarget.focus === "function" && document.contains(focusTarget)) focusTarget.focus();
  }

  function setExitGuestModeBackgroundDisabled(disabled) {
    const app = $("#chefNovaApp");
    if (!app || app.hidden || !("inert" in app)) return;
    app.inert = disabled;
  }

  function handleExitGuestModeModalKeydown(event) {
    const modal = $("#exitGuestModeModal");
    if (!modal || modal.classList.contains("hidden")) return false;
    if (event.key === "Escape") {
      event.preventDefault();
      hideExitGuestModeDialog();
      return true;
    }
    if (event.key !== "Tab") return false;
    const focusable = $$("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])", modal).filter((element) => !element.disabled && element.tabIndex >= 0 && element.offsetParent !== null);
    if (!focusable.length) return false;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return true;
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
      return true;
    }
    return false;
  }

  function clearGuestInMemoryState() {
    state.currentUser = null;
    state.guestMode = false;
    state.profileMenuOpen = false;
    state.favorites = [];
    state.pantry = [];
    state.mealPlans = createEmptyMealPlan();
    resetGuestSessionData();
  }

  function clearRenderedGuestData() {
    [
      "dashboardStats",
      "favoriteResults",
      "recipeFinderFavorites",
      "pantrySummary",
      "pantryList",
      "pantryRecipeSuggestions",
      "mealPlanner",
      "shoppingListContent",
      "weeklyNutritionContent",
      "notificationList"
    ].forEach((id) => {
      const target = $("#" + id);
      if (target) target.innerHTML = "";
    });
    const title = $("#dashboardWelcomeTitle");
    const message = $("#dashboardWelcomeMessage");
    const guestMessage = $("#guestDashboardMessage");
    const guestActions = $("#guestDashboardActions");
    if (title) title.textContent = "Chef Nova Dashboard";
    if (message) message.textContent = "Your cooking assistant is ready.";
    if (guestMessage) guestMessage.classList.add("hidden");
    if (guestActions) guestActions.classList.add("hidden");
    $("#sidebar")?.classList.remove("open");
    const navigationStatus = $("#navigationAccountStatus");
    if (navigationStatus) navigationStatus.textContent = "";
  }

  // Exiting guest mode permanently clears temporary sessionStorage data.
  // Registered accounts and user-specific localStorage progress are not affected.
  function exitGuestMode() {
    clearGuestSessionData();
    clearCurrentPageData();
    clearGuestInMemoryState();
    closeOpenDialogsForAuthChange();
    clearRenderedGuestData();
    hideGuestBanner();
    hideMainApp();
    hideNavigation();
    showWelcomeAuthPage();
    selectAuthTab("login", { focus: false });
    focusWelcomeAuthField("login");
  }

  function openAuthFromGuest(mode = "login") {
    openDashboardAuth(mode);
  }

  function showGuestBanner() {
    const banner = $("#guestModeBanner");
    if (!banner) return;
    banner.hidden = false;
    banner.removeAttribute("aria-hidden");
    banner.classList.remove("hidden");
    banner.setAttribute("tabindex", "-1");
  }

  function hideGuestBanner() {
    const banner = $("#guestModeBanner");
    if (!banner) return;
    banner.hidden = true;
    banner.setAttribute("aria-hidden", "true");
    banner.classList.add("hidden");
  }

  function renderAll() { updateNavigationForCurrentMode(); renderAccount(); renderAccountPage(); updateHomePageForCurrentMode(); updateDashboardWelcome(); updateDashboardStats(); generateRecipeCategories(); searchRecipes(); renderPantry(); renderPlanner(); displayShoppingList(); displayWeeklyNutrition(); renderFavorites(); renderRules(); displayInstructions(); displayNotifications(); updateNotificationBadge(); }

  function displayInstructions() {
    const target = $("#instructionsList");
    if (!target) return;
    target.innerHTML = INSTRUCTION_STEPS.map((step) => `<article class="instruction-card">
      <span class="instruction-step-badge">Step ${step.id}</span>
      <h2>${escapeHtml(step.title)}</h2>
      <p>${escapeHtml(step.shortDescription)}</p>
      <button class="button primary small instruction-details-button" type="button" data-instruction-details="${step.id}">Details</button>
    </article>`).join("");
  }

  function openInstructionModal(stepId) {
    const step = INSTRUCTION_STEPS.find((item) => item.id === stepId);
    if (!step) return;
    const modalTitle = step.modalTitle || step.title;
    const modalBody = step.detailHtml || `<div class="instruction-detail-section"><h3>What this feature does</h3><p>${escapeHtml(step.whatItDoes)}</p></div>
    <div class="instruction-detail-section"><h3>How to use it</h3><p>${escapeHtml(step.howToUse)}</p></div>
    <div class="instruction-example"><h3>Example</h3><p>${escapeHtml(step.example)}</p></div>
    <div class="instruction-detail-section"><h3>Helpful tip</h3><p>${escapeHtml(step.tip)}</p></div>`;
    $("#instructionModalContent").innerHTML = `<div class="instruction-modal-heading">
      <span class="instruction-step-badge">Step ${step.id}</span>
      <h2 id="instructionModalTitle">${escapeHtml(modalTitle)}</h2>
    </div>
    ${modalBody}`;
    $("#instructionModal").classList.remove("hidden");
    $("#instructionModal").setAttribute("aria-hidden", "false");
  }

  function closeInstructionModal() {
    const modal = $("#instructionModal");
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    $("#instructionModalContent").innerHTML = "";
  }

  function accountRequiredMessage(actionName) {
    return "Create an account to save your progress.";
  }

  function showAccountRequiredModal(actionName) {
    const modal = $("#accountRequiredModal");
    const message = $("#accountRequiredMessage");
    const signupButton = $("#accountRequiredSignup");
    if (!modal || !message || !signupButton) return;
    accountRequiredLastFocus = document.activeElement;
    message.textContent = accountRequiredMessage(actionName);
    modal.hidden = false;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    setAccountRequiredBackgroundDisabled(true);
    setTimeout(() => signupButton.focus(), 0);
  }

  function hideAccountRequiredModal() {
    const modal = $("#accountRequiredModal");
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    setAccountRequiredBackgroundDisabled(false);
    const focusTarget = accountRequiredLastFocus;
    accountRequiredLastFocus = null;
    if (focusTarget && typeof focusTarget.focus === "function" && document.contains(focusTarget)) focusTarget.focus();
  }

  function setAccountRequiredBackgroundDisabled(disabled) {
    ["#chefNovaApp", "#welcomeAuthPage"].forEach((selector) => {
      const element = $(selector);
      if (!element || element.hidden || !("inert" in element)) return;
      element.inert = disabled;
    });
  }

  function handleAccountRequiredModalKeydown(event) {
    const modal = $("#accountRequiredModal");
    if (!modal || modal.classList.contains("hidden")) return false;
    if (event.key === "Escape") {
      event.preventDefault();
      hideAccountRequiredModal();
      return true;
    }
    if (event.key !== "Tab") return false;
    const focusable = $$("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])", modal).filter((element) => !element.disabled && element.tabIndex >= 0 && element.offsetParent !== null);
    if (!focusable.length) return false;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return true;
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
      return true;
    }
    return false;
  }

  function openAccountRequiredAuth(mode) {
    hideAccountRequiredModal();
    showAuthPage();
    selectAuthTab(mode === "register" ? "register" : "login", { focus: false });
    const form = mode === "register" ? $("#welcomeRegisterForm") : $("#welcomeLoginForm");
    const firstField = form ? form.querySelector("input, select, textarea") : null;
    if (firstField) firstField.focus();
  }

  function renderAccount() {
    const target = $("#accountArea");
    if (!target) return;
    if (!state.currentUser) {
      target.innerHTML = state.guestMode
        ? `<span class="guest-status">Guest Mode</span><button class="top-login-button" type="button" data-exit-guest>Exit Guest Mode</button>`
        : `<button class="top-login-button" type="button" data-auth-mode="login">Login</button>`;
      return;
    }
    const user = getCurrentUser() || state.currentUser;
    const progress = getSavedProgressSummary();
    const firstName = String(user.name || "Profile").split(" ")[0];
    target.innerHTML = `<div class="profile-menu-wrap">
      <button class="profile-menu-button" type="button" data-account-menu-toggle aria-haspopup="true" aria-expanded="${state.profileMenuOpen}">
        <span class="profile-menu-avatar">${escapeHtml(String(user.name || "U").charAt(0).toUpperCase())}</span>
        <span class="profile-menu-name">${escapeHtml(firstName)}</span>
      </button>
      <div class="profile-dropdown ${state.profileMenuOpen ? "" : "hidden"}" role="menu" aria-label="Chef Nova profile menu">
        <div class="profile-dropdown-header">
          <span class="profile-menu-avatar large">${escapeHtml(String(user.name || "U").charAt(0).toUpperCase())}</span>
          <div><h2>${escapeHtml(user.name || "Chef Nova User")}</h2><p>${escapeHtml(user.email || "No email saved")}</p></div>
        </div>
        <div class="profile-dropdown-details">
          <div><span>Dietary preference</span><strong>${escapeHtml(user.dietaryPreference || "No preference")}</strong></div>
          <div><span>Allergies</span><strong>${escapeHtml(formatAllergies(user.allergies))}</strong></div>
        </div>
        <div class="profile-dropdown-progress" aria-label="Saved progress">
          <h3>Saved progress</h3>
          <div><span>Favorite recipes</span><strong>${progress.favorites}</strong></div>
          <div><span>Pantry items</span><strong>${progress.pantry}</strong></div>
          <div><span>Meal plan</span><strong>${progress.mealsPlanned} / ${progress.totalMeals}</strong></div>
          <div><span>User settings</span><strong>${progress.settingsSaved ? "Saved" : "Not saved"}</strong></div>
        </div>
        <div class="profile-dropdown-actions">
          <button class="button primary small" type="button" data-page="account">View Profile</button>
          <button class="button secondary small" type="button" data-auth="logout">Logout</button>
        </div>
      </div>
    </div>`;
  }

  function toggleAccountMenu() {
    if (!state.currentUser) return;
    state.profileMenuOpen = !state.profileMenuOpen;
    renderAccount();
  }

  function closeAccountMenu() {
    if (!state.profileMenuOpen) return;
    state.profileMenuOpen = false;
    renderAccount();
  }

  function getSavedProgressSummary() {
    const mealPlan = normalizeMealPlan(state.mealPlans || readUserStorage(KEYS.plans, {}));
    const mealsPlanned = DAYS.reduce((count, day) => count + MEALS.filter((mealType) => normalizeMealPlanEntry((mealPlan[day] || {})[mealType])).length, 0);
    return {
      favorites: state.favorites.length,
      pantry: state.pantry.length,
      mealsPlanned,
      totalMeals: DAYS.length * MEALS.length,
      settingsSaved: Boolean(getCurrentUser())
    };
  }

  function renderAccountPage() {
    const guest = $("#accountGuest"); const profile = $("#accountProfile");
    guest.classList.toggle("hidden", Boolean(state.currentUser)); profile.classList.toggle("hidden", !state.currentUser);
    if (state.guestMode) {
      guest.innerHTML = renderGuestAccountPanel();
      return;
    }
    if (!state.currentUser) return;
    const user = getCurrentUser();
    if (!user) {
      state.currentUser = null;
      clearCurrentUserSession();
      guest.classList.remove("hidden");
      profile.classList.add("hidden");
      return;
    }
    const details = [["Email", user.email], ["Age", user.age || "Not provided"], ["Gender", user.gender || "Not provided"], ["Phone", user.phone || "Not provided"], ["Dietary preference", user.dietaryPreference || "No preference"], ["Allergies", formatAllergies(user.allergies)]];
    profile.innerHTML = `<div class="profile-hero">
      <div class="profile-avatar">${escapeHtml(user.name.charAt(0).toUpperCase())}</div>
      <div><span class="eyebrow">CURRENT COOK</span><h2>${escapeHtml(user.name)}</h2><p>Chef Nova member · Profile saved on this device</p></div>
      <div class="profile-hero-actions">
        <button class="button primary small" type="button" data-profile-edit>Edit Profile</button>
        <button class="button secondary small" type="button" data-password-edit>Change Password</button>
        <button class="button secondary small profile-logout" type="button" data-auth="logout">Logout</button>
      </div>
    </div>
    <div class="profile-details">${details.map(([label, value]) => `<div class="profile-detail"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}</div>
    <section id="profileNutritionSection" class="profile-section nutrition-profile-section" aria-labelledby="profileNutritionTitle">
      <div>
        <span class="eyebrow">OPTIONAL</span>
        <h2 id="profileNutritionTitle">Nutrition Profile</h2>
        <p id="nutritionProfileStatus">Not set up</p>
        <div class="nutrition-profile-privacy">
          <h3>Privacy</h3>
          <p>Your body and nutrition information is stored only on this device.</p>
          <p>This information is private and belongs only to your account on this browser.</p>
          <p>${escapeHtml(BODY_MEASUREMENT_SAFETY_MESSAGE)}</p>
          <p><b>Information visibility:</b> <span id="nutritionWeightVisibilityStatus">Weight visible</span></p>
        </div>
        <div id="nutritionProfileSummary" class="nutrition-profile-summary"></div>
      </div>
      <div class="nutrition-profile-controls">
        <button class="button primary small" id="editNutritionProfileButton" type="button" data-nutrition-profile-edit>Set Up Nutrition Profile</button>
        <button class="button secondary small" id="toggleNutritionWeightButton" type="button" data-nutrition-weight-toggle>Hide Weight Information</button>
        <button class="button secondary small" id="resetNutritionGoalsButton" type="button" data-nutrition-goals-reset>Reset Nutrition Goals</button>
        <button class="button secondary small danger-button" id="deleteNutritionProfileButton" type="button" data-nutrition-profile-delete>Delete Nutrition Profile</button>
      </div>
    </section>
    ${state.isEditingProfile ? renderProfileEditForm(user) : ""}
    ${state.isChangingPassword ? renderPasswordChangeForm() : ""}
    <div class="profile-actions"><button class="feature-card mini accent-sage" data-page="favorites"><span class="feature-icon">♡</span><h3>${state.favorites.length} favorites</h3><span class="card-link">View cookbook →</span></button><button class="feature-card mini accent-peach" data-page="pantry"><span class="feature-icon">◫</span><h3>${state.pantry.length} pantry items</h3><span class="card-link">Open pantry →</span></button><button class="feature-card mini accent-gold" data-page="planner"><span class="feature-icon">▦</span><h3>Weekly plan</h3><span class="card-link">View meals →</span></button></div>`;
    updateProfileNutritionSection();
  }

  function renderGuestAccountPanel() {
    const guestProfile = getActiveNutritionProfile();
    const hideWeight = Boolean(guestProfile?.hideWeightInformation);
    return `<div class="account-intro-card guest-profile-panel">
      <span class="brand-mark large">✦</span><span class="eyebrow">GUEST MODE</span>
      <h2>No registered account</h2>
      <p>Progress is temporary during this browser session. Create an account or log in to save favorites, pantry items, meal plans, shopping lists, nutrition history, cooking history, and profile information permanently.</p>
      <div class="nutrition-profile-privacy guest-nutrition-privacy">
        <h3>Nutrition Privacy</h3>
        <p>Your body and nutrition information is stored only on this device.</p>
        <p>Guest nutrition information is temporary and stays only in this browser session.</p>
        <p>${escapeHtml(BODY_MEASUREMENT_SAFETY_MESSAGE)}</p>
        <p><b>Information visibility:</b> ${hideWeight ? "Weight hidden" : "Weight visible"}</p>
      </div>
      <div class="guest-profile-details">
        <div><span>Status</span><strong>Guest Mode</strong></div>
        <div><span>Profile</span><strong>No registered account</strong></div>
        <div><span>Progress</span><strong>Temporary session only</strong></div>
      </div>
      <div class="nutrition-profile-summary">${nutritionProfileSummaryHtml(guestProfile || createEmptyNutritionProfile())}</div>
      <div class="nutrition-profile-controls guest-nutrition-controls">
        <button class="button primary" type="button" data-nutrition-profile-edit>${guestProfile?.setupCompleted ? "Edit Nutrition Profile" : "Set Up Nutrition Profile"}</button>
        <button class="button secondary" type="button" data-nutrition-weight-toggle>${hideWeight ? "Show Weight Information" : "Hide Weight Information"}</button>
        <button class="button secondary" type="button" data-nutrition-goals-reset>Reset Nutrition Goals</button>
        <button class="button secondary danger-button" type="button" data-nutrition-profile-delete>Delete Nutrition Profile</button>
      </div>
      <div class="guest-profile-actions">
        <button class="button primary" type="button" data-guest-auth="register" aria-label="Create an account to save Chef Nova progress">Create Account</button>
        <button class="button secondary" type="button" data-guest-auth="login" aria-label="Log in to save Chef Nova progress">Log In</button>
        <button class="button secondary" type="button" data-exit-guest aria-label="Exit Guest Mode">Exit Guest Mode</button>
      </div>
    </div>`;
  }

  function updateProfileNutritionSection() {
    const section = $("#profileNutritionSection");
    if (!section) return;
    const user = getCurrentUser();
    if (!user || state.guestMode || isGuestMode()) {
      section.hidden = true;
      section.setAttribute("aria-hidden", "true");
      return;
    }
    section.hidden = false;
    section.removeAttribute("aria-hidden");
    const profile = getNutritionProfile(user.id);
    const statusElement = $("#nutritionProfileStatus");
    const summaryElement = $("#nutritionProfileSummary");
    const button = $("#editNutritionProfileButton");
    const visibilityElement = $("#nutritionWeightVisibilityStatus");
    const toggleButton = $("#toggleNutritionWeightButton");
    const hideWeight = Boolean(profile?.hideWeightInformation);
    if (visibilityElement) visibilityElement.textContent = hideWeight ? "Weight hidden" : "Weight visible";
    if (toggleButton) toggleButton.textContent = hideWeight ? "Show Weight Information" : "Hide Weight Information";
    if (profile?.setupCompleted) {
      if (statusElement) statusElement.textContent = "Completed";
      if (button) button.textContent = "Edit Nutrition Profile";
      if (summaryElement) summaryElement.innerHTML = nutritionProfileSummaryHtml(profile);
      return;
    }
    if (profile?.setupSkipped) {
      if (statusElement) statusElement.textContent = "Skipped for now";
      if (button) button.textContent = "Set Up Nutrition Profile";
      if (summaryElement) summaryElement.innerHTML = `<p><span>Information level:</span> Not available</p>`;
      return;
    }
    if (statusElement) statusElement.textContent = "Not set up";
    if (button) button.textContent = "Set Up Nutrition Profile";
    if (summaryElement) summaryElement.innerHTML = `<p><span>Information level:</span> Not available</p>`;
  }

  function nutritionProfileSummaryHtml(profile) {
    const canonical = normalizeStoredNutritionProfile(profile) || createEmptyNutritionProfile();
    const hideWeight = Boolean(canonical.hideWeightInformation);
    const rows = [
      ["Information level", nutritionCompletenessLabel(canonical.profileCompleteness || evaluateNutritionProfileCompleteness(canonical))],
      ["Energy estimate", estimateDailyEnergyNeeds(canonical).available ? "Available" : "General suggestions only"],
      ["Unit system", NUTRITION_UNIT_LABELS[canonical.unitSystem] || "Not selected"],
      ["Height", nutritionHeightSummaryText(canonical.heightCm, canonical.unitSystem)],
      ["Current weight", nutritionWeightSummaryText(canonical.currentWeightKg, canonical.unitSystem, hideWeight)],
      ["Activity level", ACTIVITY_DISPLAY_LABELS[canonical.activityLevel] || "Not selected"],
      ["General goal", GOAL_DISPLAY_LABELS[canonical.goal] || "Not selected"]
    ];
    if (canonical.goal === "gradual-weight-change") {
      rows.push(["Preferred pace", PACE_DISPLAY_LABELS[canonical.preferredPace] || "No specific pace"]);
      rows.push(["Desired weight", nutritionWeightSummaryText(canonical.desiredWeightKg, canonical.unitSystem, hideWeight)]);
      if (canonical.ageSafetyStatus === "minor") rows.push(["Safety protections", "Age-sensitive safety protections are active."]);
    }
    const safetyMessages = [
      `<p class="nutrition-profile-safety">${escapeHtml(BODY_MEASUREMENT_SAFETY_MESSAGE)}</p>`
    ];
    if (canonical.ageSafetyStatus === "minor" && (Number.isFinite(canonical.heightCm) || Number.isFinite(canonical.currentWeightKg) || canonical.goal === "gradual-weight-change")) {
      safetyMessages.push(`<p class="nutrition-profile-safety">${escapeHtml(TEEN_BODY_MEASUREMENT_MESSAGE)}</p>`);
    }
    if (canonical.ageSafetyStatus === "unknown" && (Number.isFinite(canonical.heightCm) || Number.isFinite(canonical.currentWeightKg))) {
      safetyMessages.push(`<p class="nutrition-profile-safety">${escapeHtml(UNKNOWN_AGE_NUTRITION_MESSAGE)}</p>`);
    }
    return `${rows.map(([label, value]) => `<p><span>${escapeHtml(label)}:</span> ${escapeHtml(value)}</p>`).join("")}${renderWorkoutProfileSummary(canonical)}${safetyMessages.join("")}${renderOptionalAdultBmiReference(canonical)}`;
  }

  function renderWorkoutProfileSummary(profile) {
    const workout = normalizeWorkoutProfile(profile?.workoutProfile);
    if (profile?.goal !== "support-workouts" || !workout) return "";
    const rows = [
      ["Main activity", workout.mainActivity || "Not provided"],
      ["Workout days", workout.workoutDaysPerWeek === null ? "Not provided" : `${workout.workoutDaysPerWeek} per week`],
      ["Typical length", WORKOUT_LENGTH_DISPLAY_LABELS[workout.typicalWorkoutLength] || "Not provided"],
      ["Training focus", TRAINING_FOCUS_DISPLAY_LABELS[workout.trainingFocus] || "Not provided"]
    ];
    return `<section class="workout-profile-summary" aria-labelledby="workoutProfileSummaryTitle">
      <h3 id="workoutProfileSummaryTitle">Workout Support</h3>
      ${rows.map(([label, value]) => `<p><span>${escapeHtml(label)}:</span> ${escapeHtml(value)}</p>`).join("")}
    </section>`;
  }

  function renderOptionalAdultBmiReference(profile) {
    if (profile?.hideWeightInformation || !canCalculateAdultBmi(profile)) return "";
    const referenceValue = calculateAdultBmi(profile);
    const id = "optionalAdultBmiReference";
    return `<div class="body-reference-panel">
      <button class="text-button body-reference-toggle" type="button" aria-expanded="false" aria-controls="${id}" data-body-reference-toggle>View optional calculation</button>
      <div id="${id}" class="body-reference-content" hidden>
        <h3>Additional Body Measurement Reference</h3>
        <p><span>Estimated BMI:</span> ${escapeHtml(String(referenceValue))}</p>
        <p>This is a simple calculation based on height and weight. It does not diagnose health or account for muscle mass, growth, medical history, or individual needs.</p>
        <p>${escapeHtml(BODY_MEASUREMENT_SAFETY_MESSAGE)}</p>
      </div>
    </div>`;
  }

  function toggleBodyMeasurementReference(button) {
    const panelId = button?.getAttribute("aria-controls");
    const panel = panelId ? $("#" + panelId) : null;
    if (!button || !panel) return;
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    panel.hidden = expanded;
  }

  function nutritionWeightSummaryText(weightKg, unitSystem, hideWeight) {
    if (!Number.isFinite(weightKg)) return "Not provided";
    if (hideWeight) return "Hidden";
    if (unitSystem === "imperial") return `${formatNutritionNumber(kilogramsToPounds(weightKg))} lb`;
    return `${formatNutritionNumber(weightKg)} kg`;
  }

  function nutritionHeightSummaryText(heightCm, unitSystem) {
    if (!Number.isFinite(heightCm)) return "Not provided";
    if (unitSystem === "imperial") {
      const { feet, inches } = centimetresToFeetAndInches(heightCm);
      return Number.isInteger(feet) && Number.isInteger(inches) ? `${feet} ft ${inches} in` : "Not provided";
    }
    return `${formatNutritionNumber(heightCm)} cm`;
  }

  function nutritionCompletenessLabel(completeness) {
    const labels = {
      limited: "Limited information",
      partial: "Partial information",
      "sufficient-for-estimates": "Enough information for estimates"
    };
    return labels[completeness] || "Limited information";
  }

  function deleteNutritionProfile() {
    const message = state.guestMode || isGuestMode()
      ? "This will remove your temporary guest body and nutrition information from this browser session."
      : "This will permanently remove your saved body and nutrition information from this device for your account.";
    openNutritionConfirm({
      title: "Delete Nutrition Profile?",
      message,
      confirmLabel: "Delete",
      danger: true,
      onConfirm: confirmDeleteNutritionProfile
    });
  }

  function confirmDeleteNutritionProfile() {
    if (state.guestMode || isGuestMode()) {
      sessionStorage.removeItem(getGuestNutritionProfileKey());
      sessionStorage.removeItem(getGuestNutritionTargetsKey());
      updateProfileNutritionSection();
      renderAccountPage();
      updateWeeklyNutritionSummary();
      showToast("Nutrition profile deleted.", "success");
      return;
    }
    const user = getCurrentUser();
    if (!user) return;
    localStorage.removeItem(getNutritionProfileKey(user.id));
    localStorage.removeItem(getNutritionTargetsKey(user.id));
    updateProfileNutritionSection();
    updateWeeklyNutritionSummary();
    showToast("Nutrition profile deleted.", "success");
  }

  function toggleWeightVisibility() {
    const profile = getActiveNutritionProfile() || createEmptyNutritionProfile();
    profile.hideWeightInformation = !profile.hideWeightInformation;
    saveCurrentNutritionProfile(profile);
    updateProfileNutritionSection();
    renderAccountPage();
    showToast(profile.hideWeightInformation ? "Weight information hidden." : "Weight information visible.", "success");
  }

  function resetNutritionGoals() {
    const profile = getActiveNutritionProfile();
    if (!profile) return showToast("No nutrition profile to reset.", "info");
    openNutritionConfirm({
      title: "Reset nutrition goals?",
      message: "This will remove your saved goal, desired weight, preferred pace, reason, and Workout Support information. Other nutrition profile information will stay saved.",
      confirmLabel: "Reset",
      danger: false,
      onConfirm: confirmResetNutritionGoals
    });
  }

  function confirmResetNutritionGoals() {
    const profile = getActiveNutritionProfile();
    if (!profile) return showToast("No nutrition profile to reset.", "info");
    profile.goal = null;
    profile.desiredWeightKg = null;
    profile.weightGoalReason = null;
    profile.preferredPace = null;
    profile.workoutProfile = null;
    profile.profileCompleteness = evaluateNutritionProfileCompleteness(profile);
    profile.updatedAt = getCurrentIsoString();
    saveCurrentNutritionProfile(profile);
    recalculateDailyNutritionTarget(profile);
    updateProfileNutritionSection();
    renderAccountPage();
    updateWeeklyNutritionSummary();
    showToast("Nutrition goals reset.", "success");
  }

  function getCurrentUser() {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return null;
    const currentUser = state.users.find((candidate) => candidate.id === currentUserId) || null;
    if (!currentUser) {
      clearCurrentUserSession();
      state.currentUser = null;
      return null;
    }
    state.currentUser = currentUser;
    return currentUser;
  }

  function renderProfileEditForm(user) {
    return `<form class="profile-edit-form" id="profileEditForm">
      <div class="form-heading"><h2>Edit Profile</h2><p>Update your account information, dietary preference, and allergies.</p></div>
      <div class="form-grid two">
        <label>Name<input name="name" required autocomplete="name" value="${escapeHtml(user.name || "")}" placeholder="Your name"></label>
        <label>Email<input name="email" type="email" required autocomplete="email" value="${escapeHtml(user.email || "")}" placeholder="you@example.com"></label>
      </div>
      <div class="form-grid two">
        <label>Age<input name="age" type="number" min="1" max="120" step="1" required value="${escapeHtml(user.age || "")}" placeholder="Age"></label>
        <label>Gender<select name="gender" required>${profileOptions(["Woman", "Man", "Non-binary", "Prefer not to say", "Self-describe"], user.gender, "Select")}</select></label>
      </div>
      <div class="form-grid two">
        <label>Phone <small>(optional)</small><input name="phone" type="tel" autocomplete="tel" value="${escapeHtml(user.phone || "")}" placeholder="Phone number"></label>
        <label>Dietary preference<select name="dietaryPreference" required>${profileOptions(["No preference", "Vegetarian", "Vegan", "Pescatarian", "Gluten-free", "Halal", "Kosher", "Other"], user.dietaryPreference, "Select a preference")}</select></label>
      </div>
      <label>Allergies<textarea name="allergies" rows="3" placeholder="List allergies, or write None">${escapeHtml(formatAllergiesForInput(user.allergies))}</textarea></label>
      <p class="form-message" id="profileEditMessage" aria-live="polite"></p>
      <div class="profile-form-actions">
        <button class="button primary" type="submit">Save Changes</button>
        <button class="button secondary" type="button" data-profile-cancel>Cancel</button>
      </div>
    </form>`;
  }

  function renderPasswordChangeForm() {
    return `<form class="profile-edit-form password-change-form" id="passwordChangeForm">
      <div class="form-heading"><h2>Change Password</h2><p>Enter your current password, then choose a new password.</p></div>
      <div class="form-grid two">
        <label>Current password<span class="password-field"><input name="currentPassword" type="password" autocomplete="current-password" required placeholder="Current password"><button class="password-toggle" type="button" data-toggle-password aria-pressed="false">Show</button></span></label>
        <label>New password<span class="password-field"><input name="newPassword" type="password" autocomplete="new-password" required minlength="8" placeholder="At least 8 characters"><button class="password-toggle" type="button" data-toggle-password aria-pressed="false">Show</button></span></label>
      </div>
      <label>Confirm new password<span class="password-field"><input name="confirmPassword" type="password" autocomplete="new-password" required minlength="8" placeholder="Re-enter new password"><button class="password-toggle" type="button" data-toggle-password aria-pressed="false">Show</button></span></label>
      <p class="form-message" id="passwordChangeMessage" aria-live="polite"></p>
      <div class="profile-form-actions">
        <button class="button primary" type="submit">Save Password</button>
        <button class="button secondary" type="button" data-password-cancel>Cancel</button>
      </div>
    </form>`;
  }

  function profileOptions(options, selected, placeholder) {
    return [`<option value="">${escapeHtml(placeholder)}</option>`].concat(options.map((option) => `<option value="${escapeHtml(option)}" ${option === selected ? "selected" : ""}>${escapeHtml(option)}</option>`)).join("");
  }

  function showProfileEditor() {
    if (!requireAccount("save your profile information")) return;
    state.isEditingProfile = true;
    renderAccountPage();
    const input = $("#profileEditForm input[name='name']");
    if (input) input.focus();
  }

  function cancelProfileEdit() {
    state.isEditingProfile = false;
    renderAccountPage();
    showToast("Changes cancelled", "info");
  }

  function showPasswordEditor() {
    if (!requireAccount("save your profile information")) return;
    state.isChangingPassword = true;
    renderAccountPage();
    const input = $("#passwordChangeForm input[name='currentPassword']");
    if (input) input.focus();
  }

  function cancelPasswordEdit() {
    state.isChangingPassword = false;
    renderAccountPage();
    showToast("Changes cancelled", "info");
  }

  function saveProfileChanges(event) {
    event.preventDefault();
    if (!requireAccount("save your profile information")) return;
    const user = getCurrentUser();
    if (!user) return showToast("Unable to update profile", "error");
    const data = new FormData(event.currentTarget);
    const updated = {
      name: data.get("name").trim(),
      email: normalizeEmail(data.get("email")),
      age: Number(data.get("age")),
      gender: data.get("gender"),
      phone: data.get("phone").trim(),
      dietaryPreference: data.get("dietaryPreference"),
      allergies: normalizeAllergies(data.get("allergies"))
    };
    const error = validateProfileUpdate(updated, user.id);
    if (error) {
      $("#profileEditMessage").textContent = error;
      showToast(error, "error");
      return;
    }
    const index = state.users.findIndex((candidate) => candidate.id === user.id);
    if (index < 0) return showToast("Unable to update profile", "error");
    state.users[index] = { ...state.users[index], ...updated };
    saveRegisteredUsers(state.users);
    state.currentUser = state.users[index];
    setCurrentUserId(user.id);
    state.isEditingProfile = false;
    renderAccount();
    renderAccountPage();
    searchRecipes();
    showToast("Profile updated successfully", "success", { saveToHistory: true, actionName: "View Profile", actionTarget: "account" });
  }

  function savePasswordChange(event) {
    event.preventDefault();
    if (!requireAccount("save your profile information")) return;
    const user = getCurrentUser();
    if (!user) return showToast("Unable to update profile", "error");
    const data = new FormData(event.currentTarget);
    const currentPassword = data.get("currentPassword");
    const newPassword = data.get("newPassword");
    const confirmPassword = data.get("confirmPassword");
    const messageTarget = $("#passwordChangeMessage");
    if (currentPassword !== user.password) return showProfileFormError(messageTarget, "Current password is incorrect");
    if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) return showProfileFormError(messageTarget, "New password does not meet the requirements");
    if (newPassword !== confirmPassword) return showProfileFormError(messageTarget, "New passwords do not match");
    const index = state.users.findIndex((candidate) => candidate.id === user.id);
    if (index < 0) return showToast("Unable to update profile", "error");
    state.users[index] = { ...state.users[index], password: newPassword };
    saveRegisteredUsers(state.users);
    event.currentTarget.reset();
    state.isChangingPassword = false;
    renderAccountPage();
    showToast("Password changed successfully", "success");
  }

  function validateProfileUpdate(profile, userId) {
    if (!profile.name) return "Please enter a valid name";
    if (!isValidEmail(profile.email)) return "Please enter a valid email address";
    if (state.users.some((user) => user.id !== userId && normalizeEmail(user.email) === profile.email)) return "This email is already in use";
    if (!Number.isInteger(profile.age) || profile.age < 1 || profile.age > 120) return "Please enter a valid age";
    if (!profile.gender) return "Please enter all required fields";
    if (profile.phone && !isValidPhone(profile.phone)) return "Please enter a valid phone number";
    if (!profile.dietaryPreference) return "Please enter all required fields";
    return "";
  }

  function showProfileFormError(target, message) {
    if (target) target.textContent = message;
    showToast(message, "error");
  }

  /* Search every recipe from the data file, then apply filters and sort by match percentage. */
  function searchRecipes(options = {}) {
    const userIngredients = parseIngredientInput($("#recipeSearch").value);
    if (options.requireIngredients && !userIngredients.length) {
      showToast("Please enter at least one ingredient", "error");
      return;
    }
    const matched = state.recipes.map((recipe) => calculateRecipeMatch(userIngredients, normalizeRecipe(recipe)));
    const context = buildPersonalizedRecipeContext();
    updatePersonalizedRecipeFilterAvailability(context);
    const selectedFilters = getSelectedPersonalizedRecipeFilters();
    state.personalizedRecipeFilters.selected = selectedFilters;
    const baseFiltered = filterRecipes(matched);
    const results = sortRecipesByMatch(applyPersonalizedRecipeFilters(baseFiltered, selectedFilters, context), context);
    displayRecipeResults(results);
    updateRecipeResultStatus(results.length, selectedFilters, context);
    if (options.notify && !results.length) showToast("No matching recipes found", "warning", { saveToHistory: true, actionName: "View Recipes", actionTarget: "recipes" });
    if (options.notify && results.some(recipeContainsUserAllergy)) showToast("This recipe contains one or more of your allergies", "warning", { saveToHistory: true, actionName: "View Recipes", actionTarget: "recipes" });
  }

  function refreshRecipeResults() {
    searchRecipes();
  }

  function updateRecipeFilters() {
    const maxTimeInput = $("#recipeMaxTimeFilter");
    const maxTimeValue = maxTimeInput.value.trim();
    if (maxTimeValue && (!Number.isInteger(Number(maxTimeValue)) || Number(maxTimeValue) < 1)) {
      maxTimeInput.setCustomValidity("Please enter a valid cooking time in minutes.");
      maxTimeInput.reportValidity();
      showToast("Please enter a valid cooking time in minutes.", "error");
      return;
    }
    maxTimeInput.setCustomValidity("");
    state.recipeFilters = {
      category: $("#recipeCategoryFilter").value || "All",
      cuisine: $("#recipeCuisineFilter").value || "All",
      difficulty: $("#recipeDifficultyFilter").value || "All",
      maxTime: maxTimeValue,
      dietary: $("#recipeDietaryFilter").value || "All",
      hideAllergies: $("#hideAllergyRecipesFilter").checked
    };
    searchRecipes();
  }

  function createEmptyPersonalizedRecipeFilterState() {
    return {
      selected: [],
      enabled: true
    };
  }

  function getSelectedPersonalizedRecipeFilters() {
    return $$("[data-personalized-recipe-filter]:checked")
      .map((element) => element.value)
      .filter((value) => Object.values(PERSONALIZED_RECIPE_FILTERS).includes(value));
  }

  function updatePersonalizedRecipeFilters() {
    state.personalizedRecipeFilters.selected = getSelectedPersonalizedRecipeFilters();
    refreshRecipeResults();
  }

  function clearPersonalizedRecipeFilters() {
    $$("[data-personalized-recipe-filter]").forEach((input) => {
      input.checked = false;
    });
    state.personalizedRecipeFilters = createEmptyPersonalizedRecipeFilterState();
    refreshRecipeResults();
  }

  function parseIngredientInput(value) {
    return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
  }

  function getIngredientAliases(ingredient) {
    const normalized = normalizeIngredient(ingredient);
    const aliases = ingredientAliases[normalized] || [];
    const reverseMatches = Object.entries(ingredientAliases).filter(([, values]) => values.map(normalizeIngredient).includes(normalized)).map(([key]) => key);
    return Array.from(new Set([normalized, ...aliases.map(normalizeIngredient), ...reverseMatches]));
  }

  function ingredientsMatch(userIngredient, recipeIngredient) {
    const userNames = getIngredientAliases(userIngredient);
    const recipeNames = getIngredientAliases(recipeIngredient);
    return userNames.some((userName) => recipeNames.some((recipeName) => userName === recipeName || userName.includes(recipeName) || recipeName.includes(userName)));
  }

  function calculateRecipeMatch(userIngredients, recipe) {
    const required = recipe.ingredients;
    const matchedIngredients = required.filter((ingredient) => userIngredients.some((userIngredient) => ingredientsMatch(userIngredient, ingredient.name)));
    const missingIngredients = required.filter((ingredient) => !matchedIngredients.some((matched) => normalizeIngredient(matched.name) === normalizeIngredient(ingredient.name)));
    const matchPercentage = required.length ? Math.round((matchedIngredients.length / required.length) * 100) : 0;
    return { ...recipe, matchedIngredients, missingIngredients, matchPercentage, matchScore: matchedIngredients.length, matchLevel: getMatchLevel(matchPercentage) };
  }

  function filterRecipes(recipes) {
    const filters = state.recipeFilters;
    const maxTime = Number(filters.maxTime);
    const personalizedActive = getSelectedPersonalizedRecipeFilters().length > 0;
    return recipes.filter((recipe) => {
      if (filters.category !== "All" && recipe.category !== filters.category) return false;
      if (filters.cuisine !== "All" && recipe.cuisine !== filters.cuisine) return false;
      if (filters.difficulty !== "All" && recipe.difficulty !== filters.difficulty) return false;
      if (filters.dietary !== "All" && !recipe.dietaryTags.some((tag) => normalizeIngredient(tag) === normalizeIngredient(filters.dietary))) return false;
      if (filters.maxTime && recipe.cookingTime > maxTime) return false;
      if ((filters.hideAllergies || personalizedActive) && !isRecipeSafeForUser(recipe, state.currentUser)) return false;
      if (personalizedActive && !matchesDietaryPreferences(recipe, state.currentUser)) return false;
      return true;
    });
  }

  function isRecipeSafeForUser(recipe, userProfile = state.currentUser) {
    return !recipeContainsUserAllergy(recipe, userProfile);
  }

  function matchesDietaryPreferences(recipe, userProfile = state.currentUser) {
    const preference = String((userProfile && userProfile.dietaryPreference) || getUserDietaryPreference() || "").trim();
    if (!preference || preference === "No preference") return true;
    return recipe.dietaryTags.some((tag) => normalizeIngredient(tag) === normalizeIngredient(preference));
  }

  function applyPersonalizedRecipeFilters(recipes, selectedFilters = getSelectedPersonalizedRecipeFilters(), context = buildPersonalizedRecipeContext()) {
    const availableFilters = selectedFilters.filter((filter) => getPersonalizedFilterAvailability(filter, context).enabled);
    return recipes.filter((recipe) => availableFilters.every((filter) => {
      switch (filter) {
        case PERSONALIZED_RECIPE_FILTERS.FITS_NUTRITION_RANGE:
          return doesRecipeFitNutritionRange(recipe, context);
        case PERSONALIZED_RECIPE_FILTERS.HIGHER_PROTEIN:
          return isHigherProteinRecipe(recipe);
        case PERSONALIZED_RECIPE_FILTERS.BALANCED_MEAL:
          return isBalancedMealRecipe(recipe);
        case PERSONALIZED_RECIPE_FILTERS.WORKOUT_FRIENDLY:
          return isWorkoutFriendlyRecipe(recipe, context);
        case PERSONALIZED_RECIPE_FILTERS.VEGETABLE_RICH:
          return isVegetableRichRecipe(recipe);
        case PERSONALIZED_RECIPE_FILTERS.HIGHER_FIBRE:
          return isHigherFibreRecipe(recipe);
        case PERSONALIZED_RECIPE_FILTERS.LOWER_ADDED_SUGAR:
          return isLowerAddedSugarRecipe(recipe);
        case PERSONALIZED_RECIPE_FILTERS.QUICK_MEAL:
          return isQuickMealRecipe(recipe);
        default:
          return true;
      }
    }));
  }

  function sortRecipesByMatch(recipes, context = buildPersonalizedRecipeContext()) {
    const timeValue = (recipe) => Number.isFinite(getRecipeTotalMinutes(recipe)) ? getRecipeTotalMinutes(recipe) : Number.MAX_SAFE_INTEGER;
    return [...recipes].sort((a, b) => b.matchPercentage - a.matchPercentage || a.missingIngredients.length - b.missingIngredients.length || calculatePantryMatch(b, context.pantryItems).percentage - calculatePantryMatch(a, context.pantryItems).percentage || timeValue(a) - timeValue(b) || calculatePersonalizedRecipeScore(b, context).total - calculatePersonalizedRecipeScore(a, context).total || getRecipeNutritionTagScore(b) - getRecipeNutritionTagScore(a) || a.name.localeCompare(b.name));
  }

  function displayRecipeResults(results) {
    $("#recipeResults").innerHTML = results.length ? results.map(recipeCard).join("") : emptyRecipeState();
    displayFinderFavorites();
  }

  function recipeCard(recipe, favoriteView = false) {
    const saved = isRecipeFavorite(recipe.id);
    const warnings = getRecipeAllergies(recipe);
    const hasUserAllergy = recipeContainsUserAllergy(recipe);
    const preference = getUserDietaryPreference();
    const preferenceMatch = preference && recipe.dietaryTags.some((tag) => normalizeIngredient(tag) === normalizeIngredient(preference));
    const context = buildPersonalizedRecipeContext();
    const nutritionTags = getRecipeCardNutritionTags(recipe, getSelectedPersonalizedRecipeFilters());
    const match = calculatePersonalizedRecipeScore(recipe, context);
    const reasons = buildRecipeMatchReasons(recipe, context, getSelectedPersonalizedRecipeFilters()).slice(0, 3);
    return `<article class="recipe-card expanded">
      <div class="recipe-image placeholder">
        <span>${escapeHtml(recipe.imagePlaceholder || recipe.name)}</span>
        <button class="favorite-button ${saved ? "saved" : ""}" data-favorite="${recipe.id}" aria-label="${saved ? "Remove from" : "Add to"} favorites">${saved ? "♥" : "♡"}</button>
      </div>
      <div class="recipe-body">
        <div class="recipe-card-topline">
          <span class="match-badge ${matchClass(recipe.matchPercentage)}">${recipe.matchPercentage}%</span>
          <span class="match-level">${escapeHtml(recipe.matchLevel)}</span>
          ${hasUserAllergy ? `<span class="allergy-badge">Allergy warning</span>` : ""}
          ${preferenceMatch ? `<span class="dietary-badge">Matches your preference</span>` : ""}
        </div>
        <h3>${escapeHtml(recipe.name)}</h3>
        <div class="recipe-meta"><span>${escapeHtml(recipe.category)}</span><span>${escapeHtml(recipe.cuisine)}</span><span>◷ ${recipe.cookingTime} min</span><span>${escapeHtml(recipe.difficulty)}</span><span>${formatRecipeNutritionValue(recipe.calories, "calories")}</span><span>${formatRecipeNutritionValue(recipe.protein, "g")} protein</span></div>
        ${nutritionTags.length ? `<div class="recipe-nutrition-tags">${nutritionTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
        ${reasons.length ? `<div class="recipe-match-reasons"><b>${escapeHtml(getPersonalizedMatchLabel(match.total))}</b><ul>${reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul></div>` : ""}
        <div class="ingredient-block"><b>Ingredients you have</b><div class="ingredient-tags matched-tags">${recipe.matchedIngredients.length ? recipe.matchedIngredients.map((i) => `<span>${escapeHtml(i.name)}</span>`).join("") : `<span>Search to match ingredients</span>`}</div></div>
        <div class="ingredient-block"><b>Missing ingredients</b><div class="ingredient-tags missing-tags">${recipe.missingIngredients.length ? recipe.missingIngredients.slice(0, 5).map((i) => `<span>${escapeHtml(i.name)}</span>`).join("") : `<span>None</span>`}</div></div>
        <div class="ingredient-block"><b>Optional ingredients</b><div class="ingredient-tags">${recipe.optionalIngredients.length ? recipe.optionalIngredients.slice(0, 4).map((i) => `<span>${escapeHtml(i.name)}</span>`).join("") : `<span>None</span>`}</div></div>
        <div class="dietary-tags">${recipe.dietaryTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        <div class="allergy-warning"><b>Allergy warnings:</b> ${warnings.map(escapeHtml).join(", ")}. Check ingredient labels and confirm dietary suitability before cooking.</div>
        <div class="recipe-card-actions">
          <button class="button primary small" data-recipe-details="${recipe.id}">View Details</button>
          <button class="button secondary small" data-add-missing="${recipe.id}">Add Missing Ingredients to Shopping List</button>
          ${favoriteView ? `<button class="button secondary small remove-favorite-button" data-remove-favorite="${recipe.id}">Remove favorite</button>` : ""}
        </div>
      </div>
    </article>`;
  }

  function buildPersonalizedRecipeContext() {
    const profile = getCurrentNutritionProfile();
    const target = getCurrentDailyNutritionTarget(profile);
    const weeklyRange = target ? buildEstimatedWeeklyNutritionRange(target) : null;
    const weeklyData = getCurrentWeeklyNutritionData();
    const remaining = weeklyRange && weeklyData?.plannedTotals ? calculateRemainingPlannedNutrition(weeklyData.plannedTotals, weeklyRange) : null;
    return {
      profile,
      userProfile: state.currentUser,
      target,
      weeklyRange,
      weeklyData,
      coverage: weeklyData?.coverage || null,
      remaining,
      pantryItems: state.pantry || [],
      goal: profile?.goal || null,
      workoutProfile: profile?.workoutProfile || null
    };
  }

  function getCurrentWeeklyNutritionData() {
    const summary = getWeeklyNutritionSummary();
    return {
      plannedTotals: {
        calories: summary.totalCalories,
        protein: summary.totalProtein,
        carbohydrates: summary.totalCarbohydrates,
        fat: summary.totalFat
      },
      plannedMeals: summary.plannedMeals,
      mealsWithNutritionData: summary.mealsWithNutrition,
      coverage: calculateNutritionDataCoverage(summary.mealsWithNutrition, summary.plannedMeals)
    };
  }

  function calculateRemainingPlannedNutrition(plannedTotals, weeklyRange) {
    if (!plannedTotals || !weeklyRange) return null;
    const createRemainingItem = (planned, minimum, maximum) => {
      if (!Number.isFinite(planned) || !Number.isFinite(minimum) || !Number.isFinite(maximum)) return null;
      return {
        planned: Math.max(0, planned),
        estimatedMinimum: minimum,
        estimatedMaximum: maximum,
        remainingToMinimum: Math.max(0, minimum - planned),
        remainingToMaximum: Math.max(0, maximum - planned)
      };
    };
    return {
      calories: createRemainingItem(plannedTotals.calories, weeklyRange.calories.minimum, weeklyRange.calories.maximum),
      protein: createRemainingItem(plannedTotals.protein, weeklyRange.protein.minimum, weeklyRange.protein.maximum),
      carbohydrates: createRemainingItem(plannedTotals.carbohydrates, weeklyRange.carbohydrates.minimum, weeklyRange.carbohydrates.maximum),
      fat: createRemainingItem(plannedTotals.fat, weeklyRange.fat.minimum, weeklyRange.fat.maximum)
    };
  }

  function hasUsefulRemainingNutritionContext(context) {
    const coverage = context?.coverage;
    if (!context?.target) return false;
    if (!context?.weeklyData?.plannedMeals) return true;
    return coverage?.percentage >= MINIMUM_WEEKLY_NUTRITION_DATA_COVERAGE && coverage?.mealsWithNutritionData >= MINIMUM_MEALS_WITH_NUTRITION_DATA;
  }

  function calculateRecipeNutritionFitScore(recipe, context = buildPersonalizedRecipeContext()) {
    const nutrition = getRecipeNutritionForServings(recipe, 1);
    if (!hasValidCoreRecipeNutrition(nutrition) || !context?.target) return { available: false, total: 0, reasons: [] };
    const reasons = [];
    let total = 0;
    const dailyRange = {
      calories: { minimum: context.target.calorieMin, maximum: context.target.calorieMax },
      protein: { minimum: context.target.proteinMin, maximum: context.target.proteinMax },
      carbohydrates: { minimum: context.target.carbohydrateMin, maximum: context.target.carbohydrateMax },
      fat: { minimum: context.target.fatMin, maximum: context.target.fatMax }
    };
    const plannedMeals = Number(context.weeklyData?.plannedMeals) || 0;
    const useRemaining = plannedMeals > 0 && hasUsefulRemainingNutritionContext(context);
    const scoreAgainstRange = (amount, range, weight, idealMinimumRatio = 0.12, idealMaximumRatio = 0.35) => {
      if (!Number.isFinite(amount) || !range) return 0;
      const ratio = amount / range.maximum;
      if (ratio < idealMinimumRatio) return Math.round(weight * (ratio / idealMinimumRatio) * 0.75);
      if (ratio <= idealMaximumRatio) return weight;
      return Math.max(0, Math.round(weight * (1 - Math.min(0.75, ratio - idealMaximumRatio))));
    };
    if (useRemaining && context.remaining?.protein?.remainingToMinimum > 0 && nutrition.protein >= 15) {
      total += 25;
      reasons.push("May support your planned protein range");
    } else {
      total += scoreAgainstRange(nutrition.protein, dailyRange.protein, 25, 0.12, 0.4);
    }
    if (useRemaining && context.remaining?.carbohydrates?.remainingToMinimum > 0 && nutrition.carbohydrates >= 25) total += 20;
    else total += scoreAgainstRange(nutrition.carbohydrates, dailyRange.carbohydrates, 20, 0.12, 0.4);
    total += scoreAgainstRange(nutrition.fat, dailyRange.fat, 15, 0.08, 0.38);
    total += scoreAgainstRange(nutrition.calories, dailyRange.calories, 15, 0.12, 0.38);
    if (isVegetableRichRecipe(recipe) || isHigherFibreRecipe(recipe)) {
      total += 15;
      reasons.push("Includes vegetables or fibre");
    } else if (hasMeaningfulProduce(recipe, nutrition)) total += 8;
    const goalScore = calculateRecipeGoalScore(recipe, context);
    total += Math.round(goalScore * 0.1);
    if (goalScore >= 70 && context.goal === "support-workouts") reasons.push("Supports your workout preference");
    return {
      available: true,
      total: Math.min(100, Math.max(0, Math.round(total))),
      reasons: Array.from(new Set(reasons)).slice(0, 3)
    };
  }

  function doesRecipeFitNutritionRange(recipe, context) {
    const score = calculateRecipeNutritionFitScore(recipe, context);
    return score.available && score.total >= MINIMUM_RECIPE_NUTRITION_FIT_SCORE;
  }

  function hasValidCoreRecipeNutrition(nutrition) {
    return ["calories", "protein", "carbohydrates", "fat"].every((field) => Number.isFinite(nutrition?.[field]) && nutrition[field] >= 0);
  }

  function isHigherProteinRecipe(recipe) {
    const nutrition = getRecipeNutritionForServings(recipe, 1);
    return Number.isFinite(nutrition.protein) && nutrition.protein >= RECIPE_NUTRITION_TAG_RULES.higherProteinGrams;
  }

  function isBalancedMealRecipe(recipe) {
    const nutrition = getRecipeNutritionForServings(recipe, 1);
    return Number.isFinite(nutrition.protein) && nutrition.protein >= 15 && Number.isFinite(nutrition.carbohydrates) && nutrition.carbohydrates >= 25 && Number.isFinite(nutrition.fat) && nutrition.fat > 0 && hasMeaningfulProduce(recipe, nutrition);
  }

  function isWorkoutFriendlyRecipe(recipe, context = buildPersonalizedRecipeContext()) {
    const nutrition = getRecipeNutritionForServings(recipe, 1);
    if (!hasValidCoreRecipeNutrition(nutrition)) return false;
    const trainingFocus = context?.workoutProfile?.trainingFocus || null;
    if (trainingFocus === "strength-training") return nutrition.protein >= 25 && nutrition.carbohydrates >= 25;
    if (trainingFocus === "endurance" || trainingFocus === "team-sport") return nutrition.carbohydrates >= 40 && nutrition.protein >= 10;
    if (trainingFocus === "mixed-training") return nutrition.protein >= 15 && nutrition.carbohydrates >= 30;
    return isBalancedMealRecipe(recipe);
  }

  function isVegetableRichRecipe(recipe) {
    const nutrition = getRecipeNutritionForServings(recipe, 1);
    return Number.isFinite(nutrition.vegetableServings) && nutrition.vegetableServings >= RECIPE_NUTRITION_TAG_RULES.vegetableRichServings;
  }

  function isHigherFibreRecipe(recipe) {
    const nutrition = getRecipeNutritionForServings(recipe, 1);
    return Number.isFinite(nutrition.fibre) && nutrition.fibre >= RECIPE_NUTRITION_TAG_RULES.higherFibreGrams;
  }

  function isLowerAddedSugarRecipe(recipe) {
    const nutrition = getRecipeNutritionForServings(recipe, 1);
    return Number.isFinite(nutrition.addedSugar) && nutrition.addedSugar <= RECIPE_NUTRITION_TAG_RULES.lowerAddedSugarGrams;
  }

  function isQuickMealRecipe(recipe) {
    const minutes = getRecipeTotalMinutes(recipe);
    return Number.isFinite(minutes) && minutes <= QUICK_MEAL_MAX_MINUTES;
  }

  function getRecipeTotalMinutes(recipe) {
    if (Number.isFinite(recipe?.totalTime)) return recipe.totalTime;
    const prep = Number.isFinite(recipe?.prepTime) ? recipe.prepTime : Number.isFinite(recipe?.preparationTime) ? recipe.preparationTime : 0;
    const cook = Number.isFinite(recipe?.cookTime) ? recipe.cookTime : Number.isFinite(recipe?.cookingTime) ? recipe.cookingTime : 0;
    const total = prep + cook;
    return total > 0 ? total : null;
  }

  function hasMeaningfulProduce(recipe, nutrition = getRecipeNutritionForServings(recipe, 1)) {
    if (Number.isFinite(nutrition.vegetableServings) && nutrition.vegetableServings >= 1) return true;
    const produceTerms = ["apple", "banana", "berries", "berry", "mango", "tomato", "lettuce", "romaine", "spinach", "cucumber", "carrot", "carrots", "broccoli", "peas", "celery", "onion", "avocado", "cabbage", "bell pepper", "mushrooms", "green beans", "sweet potato"];
    const ingredients = normalizeIngredientList(recipe?.ingredients || []).map((ingredient) => normalizeIngredient(ingredient.name));
    return ingredients.some((ingredient) => produceTerms.some((term) => ingredient === term || ingredient.includes(term)));
  }

  function calculatePantryMatch(recipe, pantryItems = []) {
    const requiredIngredients = normalizeIngredientList(recipe?.ingredients || []).map((ingredient) => ingredient.name).filter(Boolean);
    if (!requiredIngredients.length) return { available: false, matched: 0, total: 0, percentage: 0, missing: [] };
    const pantryNames = pantryItems.map((item) => normalizeIngredient(item?.name || item)).filter(Boolean);
    const matchedIngredients = requiredIngredients.filter((ingredient) => pantryNames.some((pantryName) => ingredientsMatch(pantryName, ingredient)));
    const missingIngredients = requiredIngredients.filter((ingredient) => !matchedIngredients.some((matched) => normalizeIngredient(matched) === normalizeIngredient(ingredient)));
    return {
      available: true,
      matched: matchedIngredients.length,
      total: requiredIngredients.length,
      percentage: Math.round((matchedIngredients.length / requiredIngredients.length) * 100),
      missing: missingIngredients
    };
  }

  function calculateRecipeTimeScore(recipe) {
    const minutes = getRecipeTotalMinutes(recipe);
    if (!Number.isFinite(minutes)) return 0;
    if (minutes <= 15) return 100;
    if (minutes <= QUICK_MEAL_MAX_MINUTES) return 85;
    if (minutes <= 45) return 60;
    if (minutes <= 60) return 35;
    return 15;
  }

  function calculateRecipeGoalScore(recipe, context = buildPersonalizedRecipeContext()) {
    const nutrition = getRecipeNutritionForServings(recipe, 1);
    if (!hasValidCoreRecipeNutrition(nutrition)) return 0;
    const goal = context?.goal || "prefer-not-to-choose";
    if (goal === "build-muscle") return (isHigherProteinRecipe(recipe) ? 55 : 0) + (nutrition.carbohydrates >= 25 ? 35 : 0) + (hasMeaningfulProduce(recipe, nutrition) ? 10 : 0);
    if (goal === "improve-eating-habits") return (isVegetableRichRecipe(recipe) ? 45 : 0) + (isHigherFibreRecipe(recipe) ? 30 : 0) + (isBalancedMealRecipe(recipe) ? 25 : 0);
    if (goal === "support-workouts") return isWorkoutFriendlyRecipe(recipe, context) ? 90 : calculateRecipeTimeScore(recipe) * 0.25;
    if (goal === "maintain-current-weight" || goal === "gradual-weight-change") return isBalancedMealRecipe(recipe) ? 80 : hasMeaningfulProduce(recipe, nutrition) ? 45 : 25;
    return isBalancedMealRecipe(recipe) ? 55 : 25;
  }

  function calculateRecipeVarietyScore(recipe) {
    const plannedRecipes = Object.values(getSavedMealPlan()).flatMap((day) => Object.values(day || {})).map((entry) => normalizeIngredient(normalizeMealPlanEntry(entry)?.recipeName || "")).filter(Boolean);
    const categoryRepeats = state.recipes.filter((candidate) => candidate.category === recipe.category).length;
    let score = 70;
    if (!plannedRecipes.includes(normalizeIngredient(recipe.name))) score += 20;
    if (categoryRepeats <= 5) score += 10;
    return Math.min(100, score);
  }

  function calculatePersonalizedRecipeScore(recipe, context = buildPersonalizedRecipeContext()) {
    let score = 0;
    const reasons = [];
    const nutritionFit = calculateRecipeNutritionFitScore(recipe, context);
    if (nutritionFit.available) {
      score += nutritionFit.total * 0.35;
      reasons.push(...nutritionFit.reasons);
    }
    const pantryMatch = calculatePantryMatch(recipe, context.pantryItems || []);
    if (pantryMatch.available) score += pantryMatch.percentage * 0.25;
    score += calculateRecipeTimeScore(recipe, context) * 0.15;
    score += calculateRecipeGoalScore(recipe, context) * 0.15;
    score += calculateRecipeVarietyScore(recipe, context) * 0.10;
    return {
      total: Math.round(Math.max(0, Math.min(100, score))),
      reasons: Array.from(new Set(reasons)).slice(0, 3)
    };
  }

  function getPersonalizedFilterAvailability(filterValue, context = buildPersonalizedRecipeContext()) {
    if (filterValue === PERSONALIZED_RECIPE_FILTERS.FITS_NUTRITION_RANGE) {
      return {
        enabled: Boolean(context?.target),
        reason: context?.target ? null : "Personalized nutrition-range filtering is unavailable because there is not enough information for a safe estimate."
      };
    }
    if (filterValue === PERSONALIZED_RECIPE_FILTERS.WORKOUT_FRIENDLY) {
      return {
        enabled: true,
        reason: context?.goal === "support-workouts" ? null : "Workout-friendly suggestions are most personalized when Support my workouts is selected in the Nutrition Profile."
      };
    }
    return { enabled: true, reason: null };
  }

  function updatePersonalizedRecipeFilterAvailability(context = buildPersonalizedRecipeContext()) {
    const messages = [];
    $$("[data-personalized-recipe-filter]").forEach((input) => {
      const availability = getPersonalizedFilterAvailability(input.value, context);
      input.disabled = !availability.enabled;
      input.closest("label")?.classList.toggle("disabled", !availability.enabled);
      if (!availability.enabled) input.checked = false;
      if (availability.reason) messages.push(availability.reason);
    });
    const selected = getSelectedPersonalizedRecipeFilters();
    if (selected.includes(PERSONALIZED_RECIPE_FILTERS.FITS_NUTRITION_RANGE)) {
      if (!context.weeklyData?.plannedMeals) messages.push("No planned meals are available for a remaining-nutrition comparison. Recipes are being compared with your general estimated daily range instead.");
      else if (!hasUsefulRemainingNutritionContext(context)) messages.push("Not enough meal data for a personalized nutrition-range filter.");
    }
    if (selected.includes(PERSONALIZED_RECIPE_FILTERS.LOWER_ADDED_SUGAR)) messages.push("Some recipes are not shown because added-sugar information is unavailable.");
    if (selected.includes(PERSONALIZED_RECIPE_FILTERS.HIGHER_FIBRE)) messages.push("Some recipes could not be evaluated because nutrition information was unavailable.");
    const profileAge = Number(context.profile?.age);
    if (Number.isFinite(profileAge) && profileAge > 0 && profileAge < 18) messages.push("For users under 18, personalized filters support regular balanced meals and activity rather than calorie restriction.");
    const target = $("#personalizedFilterAvailability");
    if (target) target.textContent = Array.from(new Set(messages)).join(" ");
  }

  function updateRecipeResultStatus(resultCount, selectedFilters = getSelectedPersonalizedRecipeFilters(), context = buildPersonalizedRecipeContext()) {
    const target = $("#recipeResultStatus");
    if (!target) return;
    if (!resultCount && selectedFilters.length) {
      target.textContent = "No recipes match all selected filters. Try removing one personalized filter, increasing cooking time, adding more pantry ingredients, reviewing dietary preferences, or clearing personalized filters.";
      return;
    }
    target.textContent = selectedFilters.length ? `${resultCount} recipes match your selected filters.` : `${resultCount} recipes available. Personalized recipe filters are optional and must not prevent users from browsing recipes without personalization.`;
  }

  function getRecipeCardNutritionTags(recipe, selectedFilters = []) {
    const tagMap = {
      [PERSONALIZED_RECIPE_FILTERS.HIGHER_PROTEIN]: "Higher protein",
      [PERSONALIZED_RECIPE_FILTERS.BALANCED_MEAL]: "Balanced meal option",
      [PERSONALIZED_RECIPE_FILTERS.WORKOUT_FRIENDLY]: "Workout-friendly",
      [PERSONALIZED_RECIPE_FILTERS.VEGETABLE_RICH]: "Vegetable-rich",
      [PERSONALIZED_RECIPE_FILTERS.HIGHER_FIBRE]: "Higher fibre",
      [PERSONALIZED_RECIPE_FILTERS.LOWER_ADDED_SUGAR]: "Lower added sugar",
      [PERSONALIZED_RECIPE_FILTERS.QUICK_MEAL]: "Quick meal"
    };
    const selectedTags = selectedFilters.map((filter) => tagMap[filter]).filter(Boolean);
    const recipeTags = buildRecipeNutritionTags(recipe);
    if (isQuickMealRecipe(recipe)) recipeTags.push("Quick meal");
    if (isWorkoutFriendlyRecipe(recipe, buildPersonalizedRecipeContext())) recipeTags.push("Workout-friendly");
    return Array.from(new Set([...selectedTags.filter((tag) => recipeTags.includes(tag) || tag === "Quick meal" && isQuickMealRecipe(recipe)), ...recipeTags])).slice(0, 3);
  }

  function getPersonalizedMatchLabel(score) {
    if (score >= 80) return "Strong planning match";
    if (score >= 60) return "Good planning match";
    return "Possible planning match";
  }

  function buildRecipeMatchReasons(recipe, context = buildPersonalizedRecipeContext(), selectedFilters = getSelectedPersonalizedRecipeFilters()) {
    const reasons = [];
    selectedFilters.forEach((filter) => {
      const label = {
        [PERSONALIZED_RECIPE_FILTERS.HIGHER_PROTEIN]: "Matches the Higher protein filter",
        [PERSONALIZED_RECIPE_FILTERS.BALANCED_MEAL]: "Matches the Balanced meal filter",
        [PERSONALIZED_RECIPE_FILTERS.WORKOUT_FRIENDLY]: "Matches the Workout-friendly filter",
        [PERSONALIZED_RECIPE_FILTERS.VEGETABLE_RICH]: "Matches the Vegetable-rich filter",
        [PERSONALIZED_RECIPE_FILTERS.HIGHER_FIBRE]: "Matches the Higher fibre filter",
        [PERSONALIZED_RECIPE_FILTERS.LOWER_ADDED_SUGAR]: "Matches the Lower added sugar filter",
        [PERSONALIZED_RECIPE_FILTERS.QUICK_MEAL]: "Ready in 30 minutes or less"
      }[filter];
      if (label) reasons.push(label);
    });
    const pantryMatch = calculatePantryMatch(recipe, context.pantryItems || []);
    if (pantryMatch.matched > 0) reasons.push(`Uses ${pantryMatch.matched} pantry ${pantryMatch.matched === 1 ? "ingredient" : "ingredients"}`);
    if (selectedFilters.includes(PERSONALIZED_RECIPE_FILTERS.FITS_NUTRITION_RANGE)) reasons.push(...calculateRecipeNutritionFitScore(recipe, context).reasons);
    if (isQuickMealRecipe(recipe)) reasons.push(`Ready in ${getRecipeTotalMinutes(recipe)} minutes`);
    return Array.from(new Set(reasons)).slice(0, 3);
  }

  function generateRecipeCategories() {
    const cuisines = uniqueRecipeValues("cuisine");
    fillSelect("#recipeCategoryFilter", ["All", ...MEAL_CATEGORIES], "All meals");
    fillSelect("#recipeCuisineFilter", ["All", ...cuisines], "All cuisines");
    fillSelect("#recipeDifficultyFilter", ["All", ...DIFFICULTIES], "All difficulties");
    fillSelect("#recipeDietaryFilter", ["All", ...DIETARY_PREFERENCES], "All diets");
  }

  function uniqueRecipeValues(key) {
    return Array.from(new Set(state.recipes.map((recipe) => recipe[key]).filter(Boolean))).sort();
  }

  function fillSelect(selector, values, allLabel) {
    const select = $(selector);
    if (!select) return;
    const current = select.value || "All";
    select.innerHTML = values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value === "All" ? allLabel : value)}</option>`).join("");
    select.value = values.includes(current) ? current : "All";
  }

  function normalizeRecipe(recipe) {
    const ingredients = normalizeIngredientList(recipe.ingredients);
    const optionalIngredients = normalizeIngredientList(recipe.optionalIngredients || []);
    const allergies = getRecipeAllergies(recipe);
    return {
      ...recipe,
      imagePlaceholder: recipe.imagePlaceholder || recipe.name,
      category: recipe.category || "Dinner",
      subcategory: recipe.subcategory || "Quick Meals",
      cuisine: recipe.cuisine || "Global",
      dietaryTags: Array.isArray(recipe.dietaryTags) ? recipe.dietaryTags : [],
      ingredients,
      optionalIngredients,
      cookingTime: toNumber(recipe.cookingTime),
      preparationTime: toNumber(recipe.preparationTime),
      totalTime: toNumber(recipe.totalTime) || toNumber(recipe.cookingTime) + toNumber(recipe.preparationTime),
      servings: toNumber(recipe.servings) || 1,
      calories: normalizeOptionalNutritionNumber(recipe.calories),
      protein: normalizeOptionalNutritionNumber(recipe.protein),
      carbohydrates: normalizeOptionalNutritionNumber(recipe.carbohydrates),
      fat: normalizeOptionalNutritionNumber(recipe.fat),
      sugar: normalizeOptionalNutritionNumber(recipe.sugar),
      vegetableServings: normalizeOptionalNutritionNumber(recipe.vegetableServings),
      fibre: normalizeOptionalNutritionNumber(recipe.fibre ?? recipe.fiber),
      addedSugar: normalizeOptionalNutritionNumber(recipe.addedSugar),
      allergies,
      steps: Array.isArray(recipe.steps) ? recipe.steps : []
    };
  }

  function normalizeIngredientList(list) {
    return (Array.isArray(list) ? list : []).map((ingredient) => typeof ingredient === "string" ? { name: ingredient, quantity: "", unit: "" } : { name: ingredient.name || "", quantity: ingredient.quantity ?? "", unit: ingredient.unit || "" }).filter((ingredient) => ingredient.name);
  }

  function getRecipeAllergies(recipe) {
    const value = recipe.allergies || recipe.allergyWarnings || ["None"];
    return (Array.isArray(value) ? value : [value]).filter(Boolean);
  }

  function getUserAllergies() {
    const user = state.currentUser ? state.users.find((candidate) => candidate.id === state.currentUser.id) || state.currentUser : null;
    return normalizeAllergies(user && user.allergies);
  }

  function recipeContainsUserAllergy(recipe, userProfile = state.currentUser) {
    const userAllergies = normalizeAllergies(userProfile?.allergies ?? getUserAllergies()).map(normalizeIngredient);
    if (!userAllergies.length) return false;
    const recipeAllergies = getRecipeAllergies(recipe).map(normalizeIngredient);
    const ingredientNames = normalizeIngredientList(recipe.ingredients).map((ingredient) => normalizeIngredient(ingredient.name));
    return userAllergies.some((allergy) => recipeAllergies.some((item) => item.includes(allergy) || allergy.includes(item)) || ingredientNames.some((item) => item.includes(allergy) || allergy.includes(item)));
  }

  function getUserDietaryPreference() {
    const user = state.currentUser ? state.users.find((candidate) => candidate.id === state.currentUser.id) || state.currentUser : null;
    const preference = String((user && user.dietaryPreference) || "").trim();
    return preference && preference !== "No preference" ? preference : "";
  }

  function displayRecipeDetails(recipeId) {
    const recipe = state.recipes.map(normalizeRecipe).find((item) => item.id === recipeId);
    if (!recipe) {
      showToast("Recipe not found", "error");
      return;
    }
    const result = calculateRecipeMatch(parseIngredientInput($("#recipeSearch").value), recipe);
    const saved = isRecipeFavorite(recipe.id);
    const nutritionTags = buildRecipeNutritionTags(recipe);
    const personalizedContext = buildPersonalizedRecipeContext();
    const detailReasons = buildRecipeMatchReasons(recipe, personalizedContext, getSelectedPersonalizedRecipeFilters());
    $("#recipeDetailModalContent").innerHTML = `<div class="recipe-detail-heading">
      <div class="recipe-detail-image"><span>${escapeHtml(recipe.imagePlaceholder || recipe.name)}</span></div>
      <div><span class="rule-badge">${escapeHtml(recipe.category)} · ${escapeHtml(recipe.cuisine)}</span><h2 id="recipeDetailModalTitle">${escapeHtml(recipe.name)}</h2><p>Check ingredient labels and confirm dietary suitability before cooking.</p>${nutritionTags.length ? `<div class="recipe-nutrition-tags detail-tags">${nutritionTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}</div>
    </div>
    <div class="recipe-detail-stats">
      <span><b>Servings</b>${recipe.servings}</span><span><b>Prep</b>${recipe.preparationTime} min</span><span><b>Cook</b>${recipe.cookingTime} min</span><span><b>Total</b>${recipe.totalTime} min</span>
      <span><b>Calories</b>${formatRecipeNutritionValue(recipe.calories)}</span><span><b>Protein</b>${formatRecipeNutritionValue(recipe.protein, "g")}</span><span><b>Carbs</b>${formatRecipeNutritionValue(recipe.carbohydrates, "g")}</span><span><b>Fat</b>${formatRecipeNutritionValue(recipe.fat, "g")}</span>
    </div>
    <div class="recipe-detail-section recipe-plan-fit-shell">
      <div class="recipe-fit-control">
        <div>
          <h3>How This Recipe Fits Your Plan</h3>
          <p>Choose how many servings you plan to eat.</p>
        </div>
        <label class="recipe-fit-servings-label">Selected servings
          <input type="number" min="1" step="1" value="1" data-recipe-detail-servings="${escapeHtml(recipe.id)}" aria-label="Selected servings for ${escapeHtml(recipe.name)}">
        </label>
      </div>
      <div id="recipeFitStatus" class="recipe-fit-status" role="status" aria-live="polite"></div>
      <div id="recipePlanFitContent">${renderRecipePlanFit(recipe, 1)}</div>
    </div>
    ${detailReasons.length ? `<div class="recipe-detail-section"><h3>Why this recipe appeared</h3><ul class="recipe-detail-reasons">${detailReasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul></div>` : ""}
    <div class="recipe-detail-section"><h3>Required ingredients</h3><div class="ingredient-tags">${recipe.ingredients.map(ingredientTag).join("")}</div></div>
    <div class="recipe-detail-section"><h3>Optional ingredients</h3><div class="ingredient-tags">${recipe.optionalIngredients.length ? recipe.optionalIngredients.map(ingredientTag).join("") : "<span>None</span>"}</div></div>
    <div class="recipe-detail-section"><h3>Missing ingredients</h3><div class="ingredient-tags missing-tags">${result.missingIngredients.length ? result.missingIngredients.map(ingredientTag).join("") : "<span>None</span>"}</div></div>
    <div class="recipe-detail-section"><h3>Allergy information</h3><p>${getRecipeAllergies(recipe).map(escapeHtml).join(", ")}</p></div>
    <div class="recipe-detail-section"><h3>Dietary tags</h3><div class="dietary-tags">${recipe.dietaryTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div></div>
    <div class="recipe-detail-section"><h3>Step-by-step instructions</h3><ol class="favorite-steps-list">${recipe.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol></div>
    <div class="recipe-detail-actions">
      <button class="button primary small" data-favorite="${recipe.id}">${saved ? "Remove Favorite" : "Favorite"}</button>
      <button class="button secondary small" data-page="planner">Add to Meal Planner</button>
      <button class="button secondary small" data-add-missing="${recipe.id}">Add Missing Ingredients to Shopping List</button>
    </div>`;
    $("#recipeDetailModal").classList.remove("hidden");
    $("#recipeDetailModal").setAttribute("aria-hidden", "false");
  }

  function closeRecipeDetailModal() {
    const modal = $("#recipeDetailModal");
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    $("#recipeDetailModalContent").innerHTML = "";
  }

  function displayRecipeDetailsIfOpen(recipeId) {
    const modal = $("#recipeDetailModal");
    if (!modal || modal.classList.contains("hidden")) return;
    if ($("#recipeDetailModalTitle") && state.recipes.some((recipe) => recipe.id === recipeId)) displayRecipeDetails(recipeId);
  }

  function addMissingIngredientsToShoppingList(recipeId) {
    const recipe = state.recipes.map(normalizeRecipe).find((item) => item.id === recipeId);
    if (!recipe) {
      showToast("Recipe not found", "error");
      return;
    }
    const result = calculateRecipeMatch(parseIngredientInput($("#recipeSearch").value), recipe);
    const existing = state.guestMode ? guestSessionData.shoppingList : readUserStorage("chefNovaShoppingList", []);
    const additions = result.missingIngredients.map((ingredient) => ({ id: "s" + Date.now() + "-" + normalizeIngredient(ingredient.name), name: ingredient.name, quantity: ingredient.quantity || 1, unit: ingredient.unit || "", recipeId: recipe.id, checked: false }));
    const merged = [...existing];
    let addedCount = 0;
    additions.forEach((item) => {
      if (!merged.some((existingItem) => normalizeIngredient(existingItem.name) === normalizeIngredient(item.name))) {
        merged.push(item);
        addedCount += 1;
      }
    });
    if (state.guestMode) {
      guestSessionData.shoppingList = merged;
      persistGuestProgress();
    } else writeUserStorage("chefNovaShoppingList", merged);
    displayShoppingList();
    updateDashboardStats();
    if (!additions.length) showToast("No missing ingredients to add", "info");
    else if (!addedCount) showToast("This item is already in the shopping list", "warning");
    else if (state.guestMode) showToast(`Shopping list updated for this session. ${GUEST_TEMPORARY_MESSAGE}`, "info");
    else showToast("Missing ingredients added to shopping list", "success", { saveToHistory: true, actionName: "View Recipes", actionTarget: "recipes" });
  }

  function getShoppingListItems() {
    return state.guestMode ? (guestSessionData.shoppingList || []) : readUserStorage("chefNovaShoppingList", []);
  }

  function saveShoppingListItems(items) {
    const normalizedItems = Array.isArray(items) ? items : [];
    if (state.guestMode) {
      guestSessionData.shoppingList = normalizedItems;
      persistGuestProgress();
      return;
    }
    writeUserStorage("chefNovaShoppingList", normalizedItems);
  }

  function displayShoppingList() {
    const target = $("#shoppingListContent");
    if (!target) return;
    const items = getShoppingListItems();
    const notice = state.guestMode ? guestNotice("Guest Shopping List", GUEST_TEMPORARY_MESSAGE) : "";
    if (!items.length) {
      target.innerHTML = notice + emptyState("Your shopping list is empty.", "Add missing ingredients from a recipe to build your list.", "Find Recipes", "recipes");
      return;
    }
    target.innerHTML = `${notice}<div class="shopping-list-grid">${items.map((item) => {
      const quantity = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
      return `<article class="shopping-item-card ${item.checked ? "checked" : ""}">
        <div>
          <span class="eyebrow">${item.recipeId ? "FROM RECIPE" : "SHOPPING ITEM"}</span>
          <h2>${escapeHtml(item.name || "Shopping item")}</h2>
          <p>${escapeHtml(String(quantity))}${item.unit ? ` ${escapeHtml(item.unit)}` : ""}</p>
        </div>
        <div class="shopping-item-actions">
          <button class="button secondary small" type="button" data-toggle-shopping="${escapeHtml(item.id)}">${item.checked ? "Mark Needed" : "Mark Bought"}</button>
          <button class="button secondary small remove-shopping-button" type="button" data-remove-shopping="${escapeHtml(item.id)}">Remove</button>
        </div>
      </article>`;
    }).join("")}</div>`;
  }

  function toggleShoppingItem(itemId) {
    const items = getShoppingListItems().map((item) => item.id === itemId ? { ...item, checked: !item.checked } : item);
    saveShoppingListItems(items);
    displayShoppingList();
  }

  function removeShoppingItem(itemId) {
    const items = getShoppingListItems().filter((item) => item.id !== itemId);
    saveShoppingListItems(items);
    displayShoppingList();
    showToast(state.guestMode ? `Shopping item removed for this session. ${GUEST_TEMPORARY_MESSAGE}` : "Shopping item removed", state.guestMode ? "info" : "success", state.guestMode ? {} : { saveToHistory: true, actionName: "View Shopping List", actionTarget: "shopping-list" });
  }

  function ingredientTag(ingredient) {
    const amount = ingredient.quantity ? `${ingredient.quantity} ${ingredient.unit}`.trim() + " " : "";
    return `<span>${escapeHtml(amount + ingredient.name)}</span>`;
  }

  function getMatchLevel(percent) {
    if (percent >= 80) return "Excellent Match";
    if (percent >= 60) return "Good Match";
    if (percent >= 30) return "Partial Match";
    return "Low Match";
  }

  function matchClass(percent) {
    if (percent >= 80) return "excellent";
    if (percent >= 60) return "good";
    if (percent >= 30) return "partial";
    return "low";
  }

  function emptyRecipeState() {
    return `<div class="empty-state"><span>✦</span><h3>No matching recipes were found.</h3><p>Try removing one or more filters, entering fewer ingredients, checking ingredient spelling, or adding more recipes to recipes.json.</p></div>`;
  }

  function toNumber(value) {
    return Number(String(value || "0").replace(/[^\d.]/g, "")) || 0;
  }

  function normalizeNutritionNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : 0;
  }

  function normalizeOptionalNutritionNumber(value) {
    if (value === null || value === undefined || value === "") return null;
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : null;
  }

  function getRecipeNutritionForServings(recipe, servings = 1) {
    const safeServings = Number.isFinite(servings) && servings > 0 ? servings : 1;
    const nutrition = recipe?.nutrition || recipe || {};
    const calories = normalizeOptionalNutritionNumber(nutrition.calories);
    const protein = normalizeOptionalNutritionNumber(nutrition.protein);
    const carbohydrates = normalizeOptionalNutritionNumber(nutrition.carbohydrates);
    const fat = normalizeOptionalNutritionNumber(nutrition.fat);
    const fibre = normalizeOptionalNutritionNumber(nutrition.fibre ?? nutrition.fiber);
    const sugar = normalizeOptionalNutritionNumber(nutrition.sugar);
    const addedSugar = normalizeOptionalNutritionNumber(nutrition.addedSugar);
    const vegetableServings = normalizeOptionalNutritionNumber(nutrition.vegetableServings);
    return {
      calories: calories !== null ? calories * safeServings : null,
      protein: protein !== null ? protein * safeServings : null,
      carbohydrates: carbohydrates !== null ? carbohydrates * safeServings : null,
      fat: fat !== null ? fat * safeServings : null,
      fibre: fibre !== null ? fibre * safeServings : null,
      sugar: sugar !== null ? sugar * safeServings : null,
      addedSugar: addedSugar !== null ? addedSugar * safeServings : null,
      vegetableServings: vegetableServings !== null ? vegetableServings * safeServings : null
    };
  }

  function calculateRecipeRangeContribution(nutrientAmount, dailyMinimum, dailyMaximum) {
    if (
      !Number.isFinite(nutrientAmount) ||
      nutrientAmount < 0 ||
      !Number.isFinite(dailyMinimum) ||
      !Number.isFinite(dailyMaximum) ||
      dailyMinimum <= 0 ||
      dailyMaximum < dailyMinimum
    ) {
      return null;
    }
    const minimumPercentage = (nutrientAmount / dailyMaximum) * 100;
    const maximumPercentage = (nutrientAmount / dailyMinimum) * 100;
    if (!Number.isFinite(minimumPercentage) || !Number.isFinite(maximumPercentage)) return null;
    return {
      minimum: Math.max(0, Math.round(minimumPercentage)),
      maximum: Math.max(0, Math.round(maximumPercentage))
    };
  }

  function clampRecipeContributionValue(value) {
    if (!Number.isFinite(value)) return null;
    return Math.min(Math.max(0, Math.round(value)), MAX_DISPLAYED_RECIPE_CONTRIBUTION);
  }

  function formatApproximatePercentageRange(range) {
    if (!range || !Number.isFinite(range.minimum) || !Number.isFinite(range.maximum)) return null;
    const minimum = clampRecipeContributionValue(range.minimum);
    const maximum = clampRecipeContributionValue(range.maximum);
    if (minimum === null || maximum === null) return null;
    if (range.minimum > MAX_DISPLAYED_RECIPE_CONTRIBUTION || range.maximum > MAX_DISPLAYED_RECIPE_CONTRIBUTION) return `More than ${MAX_DISPLAYED_RECIPE_CONTRIBUTION}%`;
    if (minimum === maximum) return `approximately ${minimum}%`;
    return `approximately ${minimum}\u2013${maximum}%`;
  }

  function formatRecipeNutritionValue(value, unit = "") {
    if (!Number.isFinite(value)) return "Not available";
    const rounded = Math.round(value);
    return unit ? `${rounded.toLocaleString()} ${unit}` : rounded.toLocaleString();
  }

  function buildRecipeNutritionTags(recipe, selectedNutrition = null) {
    const perServingNutrition = getRecipeNutritionForServings(recipe, 1);
    const tags = [];
    const addTag = (tag) => {
      if (!tags.includes(tag)) tags.push(tag);
    };
    if (perServingNutrition.protein >= RECIPE_NUTRITION_TAG_RULES.higherProteinGrams) addTag("Higher protein");
    if (perServingNutrition.vegetableServings !== null && perServingNutrition.vegetableServings >= RECIPE_NUTRITION_TAG_RULES.vegetableRichServings) addTag("Vegetable-rich");
    if (perServingNutrition.fibre !== null && perServingNutrition.fibre >= RECIPE_NUTRITION_TAG_RULES.higherFibreGrams) addTag("Higher fibre");
    if (perServingNutrition.carbohydrates >= RECIPE_NUTRITION_TAG_RULES.carbohydrateRichGrams) addTag("Carbohydrate-rich");
    if (perServingNutrition.addedSugar !== null && perServingNutrition.addedSugar <= RECIPE_NUTRITION_TAG_RULES.lowerAddedSugarGrams) addTag("Lower added sugar");
    const ingredientNames = normalizeIngredientList(recipe?.ingredients || []).map((ingredient) => normalizeIngredient(ingredient.name));
    const unsaturatedSources = ["nuts", "walnuts", "almonds", "seeds", "chia seeds", "sesame seeds", "avocado", "olive oil", "canola oil"];
    if (ingredientNames.some((ingredient) => unsaturatedSources.some((source) => ingredient.includes(source)))) addTag("Contains unsaturated fat");
    if (perServingNutrition.protein >= 10 && perServingNutrition.carbohydrates >= 20 && perServingNutrition.fat >= 5 && (perServingNutrition.vegetableServings || 0) >= 0.5) addTag("Balanced meal option");
    const profile = getCurrentNutritionProfile();
    if (profile?.goal === "support-workouts" && perServingNutrition.protein >= 15 && perServingNutrition.carbohydrates >= 30 && perServingNutrition.calories >= 250) addTag("Workout-supporting");
    return tags.slice(0, 4);
  }

  function buildRecipePlanFit(recipe, selectedServings, dailyTarget) {
    const nutrition = getRecipeNutritionForServings(recipe, selectedServings);
    const baseResult = {
      available: false,
      nutrition,
      contributions: null,
      tags: buildRecipeNutritionTags(recipe, nutrition),
      message: "Personalized comparison unavailable."
    };
    const hasCoreNutrition = ["calories", "protein", "carbohydrates", "fat"].every((field) => Number.isFinite(nutrition[field]));
    if (!hasCoreNutrition) {
      return {
        ...baseResult,
        message: "Nutrition information unavailable for this recipe."
      };
    }
    if (!validateDailyNutritionTarget(dailyTarget)) {
      return {
        ...baseResult,
        message: "Complete your optional Nutrition Profile to see how this recipe compares with your estimated daily range."
      };
    }
    const contributions = {
      calories: calculateRecipeRangeContribution(nutrition.calories, dailyTarget.calorieMin, dailyTarget.calorieMax),
      protein: calculateRecipeRangeContribution(nutrition.protein, dailyTarget.proteinMin, dailyTarget.proteinMax),
      carbohydrates: calculateRecipeRangeContribution(nutrition.carbohydrates, dailyTarget.carbohydrateMin, dailyTarget.carbohydrateMax),
      fat: calculateRecipeRangeContribution(nutrition.fat, dailyTarget.fatMin, dailyTarget.fatMax)
    };
    if (!contributions.protein || !contributions.carbohydrates || !contributions.fat || !contributions.calories) {
      return {
        ...baseResult,
        message: "Chef Nova could not create a reliable recipe comparison from the available nutrition data."
      };
    }
    return {
      available: true,
      nutrition,
      contributions,
      tags: buildRecipeNutritionTags(recipe, nutrition),
      message: "These percentages are approximate planning references based on the selected serving amount."
    };
  }

  function buildRecipeContributionStatements(recipePlanFit) {
    if (!recipePlanFit?.available) return [];
    const { calories, protein, carbohydrates, fat } = recipePlanFit.contributions;
    return [
      `${formatApproximatePercentageRange(calories)} of your estimated daily calorie range`,
      `${formatApproximatePercentageRange(protein)} of your daily protein range`,
      `${formatApproximatePercentageRange(carbohydrates)} of your daily carbohydrate range`,
      `${formatApproximatePercentageRange(fat)} of your daily fat range`
    ].filter((statement) => statement && !statement.startsWith("null"));
  }

  function getRecipeNutritionTagScore(recipe) {
    const priority = ["Higher protein", "Vegetable-rich", "Higher fibre", "Carbohydrate-rich", "Lower added sugar", "Contains unsaturated fat", "Balanced meal option", "Workout-supporting"];
    const tags = buildRecipeNutritionTags(recipe);
    return tags.reduce((score, tag) => {
      const index = priority.indexOf(tag);
      return score + (index >= 0 ? priority.length - index : 0);
    }, 0);
  }

  function renderRecipePlanFit(recipe, selectedServings = 1) {
    const nutritionProfile = getCurrentNutritionProfile();
    const dailyTarget = getCurrentDailyNutritionTarget(nutritionProfile);
    const recipePlanFit = buildRecipePlanFit(recipe, selectedServings, dailyTarget);
    const nutrition = recipePlanFit.nutrition;
    const contributionStatements = buildRecipeContributionStatements(recipePlanFit);
    const isMinor = Number(nutritionProfile?.age) > 0 && Number(nutritionProfile.age) < 18;
    const servingLabel = selectedServings === 1 ? "serving" : "servings";
    return `<div class="recipe-fit-grid">
      <div class="recipe-fit-panel">
        <h4>Selected serving nutrition</h4>
        <p class="recipe-fit-serving-note">${escapeHtml(String(selectedServings))} ${servingLabel}</p>
        <dl class="recipe-fit-nutrition">
          <div><dt>Calories</dt><dd>${formatRecipeNutritionValue(nutrition.calories, "calories")}</dd></div>
          <div><dt>Protein</dt><dd>${formatRecipeNutritionValue(nutrition.protein, "g")}</dd></div>
          <div><dt>Carbohydrates</dt><dd>${formatRecipeNutritionValue(nutrition.carbohydrates, "g")}</dd></div>
          <div><dt>Fat</dt><dd>${formatRecipeNutritionValue(nutrition.fat, "g")}</dd></div>
          <div><dt>Fibre</dt><dd>${formatRecipeNutritionValue(nutrition.fibre, "g")}</dd></div>
          <div><dt>Sugar</dt><dd>${formatRecipeNutritionValue(nutrition.sugar, "g")}</dd></div>
          <div><dt>Vegetable servings</dt><dd>${formatRecipeNutritionValue(nutrition.vegetableServings)}</dd></div>
        </dl>
      </div>
      <div class="recipe-fit-panel">
        <h4>Daily range contribution</h4>
        ${recipePlanFit.available ? `<p class="recipe-fit-message">This meal provides:</p><ul class="recipe-fit-contributions">${contributionStatements.map((statement) => `<li>${escapeHtml(statement)}</li>`).join("")}</ul>` : `<div class="recipe-fit-message unavailable"><strong>Personalized comparison unavailable</strong><p>${escapeHtml(recipePlanFit.message)}</p></div>`}
      </div>
    </div>
    ${isMinor ? `<p class="recipe-fit-minor-note">For users under 18, these comparisons are intended to support regular balanced meals and activity, not calorie restriction.</p>` : ""}
    <div class="recipe-fit-disclaimers">
      <p>These percentages are approximate planning references based on the selected serving amount. Your actual needs and portions may differ.</p>
      <p>Chef Nova records planned recipe information and may not reflect everything eaten during the day.</p>
      <p>Ingredient substitutions, added toppings, sauces, oils, or portion changes may change the nutrition values.</p>
    </div>`;
  }

  function updateRecipePlanFitSection(recipeId) {
    const recipe = state.recipes.map(normalizeRecipe).find((item) => item.id === recipeId);
    const content = $("#recipePlanFitContent");
    if (!recipe || !content) return;
    const input = Array.from(document.querySelectorAll("[data-recipe-detail-servings]")).find((candidate) => candidate.dataset.recipeDetailServings === recipeId);
    const selectedServings = Math.max(1, Math.floor(Number(input?.value) || 1));
    if (input && String(selectedServings) !== input.value) input.value = selectedServings;
    content.innerHTML = renderRecipePlanFit(recipe, selectedServings);
    const status = $("#recipeFitStatus");
    if (status) status.textContent = `Recipe nutrition updated for ${selectedServings} ${selectedServings === 1 ? "serving" : "servings"}.`;
  }

  function toggleFavorite(id) {
    if (isRecipeFavorite(id)) removeFavorite(id); else saveFavorite(id);
  }

  /* Save one recipe id to the active mode's favorites storage. */
  function saveFavorite(id) {
    if (!requireAccount("save your favorites")) return;
    if (!state.recipes.some((recipe) => recipe.id === id)) {
      showToast("Recipe not found", "error");
      return;
    }
    if (isRecipeFavorite(id)) return;
    state.favorites = Array.from(new Set([...state.favorites, id]));
    writeUserStorage(KEYS.favorites, state.favorites);
    searchRecipes(); displayFavoritesPage(); renderAccountPage(); displayRecipeDetailsIfOpen(id);
    showToast("Recipe added to Favorites", "success", { saveToHistory: true, actionName: "View Favorites", actionTarget: "favorites" });
  }

  /* Remove one recipe id from the active mode's favorites storage. */
  function removeFavorite(id) {
    if (!requireAccount("save your favorites")) return;
    if (!isRecipeFavorite(id)) {
      showToast("Recipe not found", "error");
      return;
    }
    state.favorites = state.favorites.filter((item) => item !== id);
    writeUserStorage(KEYS.favorites, state.favorites);
    searchRecipes(); displayFavoritesPage(); renderAccountPage(); displayRecipeDetailsIfOpen(id);
    showToast("Recipe removed from Favorites", "success", { saveToHistory: true, actionName: "View Favorites", actionTarget: "favorites" });
  }

  /* Read only the current registered user's saved favorites. */
  function loadFavorites() {
    const saved = readUserStorage(KEYS.favorites, []);
    return Array.isArray(saved) ? Array.from(new Set(saved)) : [];
  }

  function isRecipeFavorite(recipeId) {
    return state.favorites.includes(recipeId);
  }

  /* Clear the ingredient search input and restore the full recipe list. */
  function clearRecipeSearch() {
    $("#recipeSearch").value = "";
    $("#recipeMaxTimeFilter").setCustomValidity("");
    searchRecipes();
    showToast("Filters reset", "info");
  }

  function renderFavorites() {
    displayFavoritesPage();
  }

  function displayFavoritesPage() {
    const recipes = state.recipes.map(normalizeRecipe).filter((recipe) => isRecipeFavorite(recipe.id));
    const notice = state.guestMode ? guestNotice("Guest Favorites", "Create an account or log in to save favorite recipes permanently.") : "";
    $("#favoriteResults").innerHTML = notice + (recipes.length ? recipes.map(favoriteRecipeCard).join("") : emptyState("No favorite recipes yet.", "Go to AI Recipe Finder to save recipes.", "AI Recipe Finder", "recipes"));
    displayFinderFavorites();
  }

  function favoriteRecipeCard(recipe) {
    const warnings = getRecipeAllergies(recipe);
    const nutritionTags = buildRecipeNutritionTags(recipe);
    return `<article class="favorite-recipe-card">
      <div class="favorite-recipe-image"><span>${escapeHtml(recipe.imagePlaceholder || recipe.name)}</span></div>
      <div class="favorite-recipe-body">
        <div class="recipe-meta"><span>${escapeHtml(recipe.category)}</span><span>${escapeHtml(recipe.cuisine)}</span><span>◷ ${escapeHtml(recipe.cookingTime)} min</span><span>${escapeHtml(recipe.difficulty)}</span><span>${formatRecipeNutritionValue(recipe.calories, "calories")}</span><span>${formatRecipeNutritionValue(recipe.protein, "g")} protein</span></div>
        <h3>${escapeHtml(recipe.name)}</h3>
        ${nutritionTags.length ? `<div class="recipe-nutrition-tags">${nutritionTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
        <div class="ingredient-block"><b>Ingredients</b><div class="ingredient-tags">${recipe.ingredients.map(ingredientTag).join("")}</div></div>
        <div class="allergy-warning"><b>Allergy warnings:</b> ${warnings.map(escapeHtml).join(", ")}</div>
        <div class="favorite-card-actions">
          <button class="button primary small" data-recipe-details="${recipe.id}">View Cooking Steps</button>
          <button class="button secondary small remove-favorite-card-button" data-remove-favorite="${recipe.id}">Remove Favorite</button>
        </div>
      </div>
    </article>`;
  }

  function openFavoriteRecipeModal(recipeId) {
    const recipe = state.recipes.map(normalizeRecipe).find((item) => item.id === recipeId);
    if (!recipe) {
      showToast("Recipe not found", "error");
      return;
    }
    $("#favoriteRecipeModalContent").innerHTML = `<div class="favorite-modal-heading"><span class="rule-badge">Cooking steps</span><h2 id="favoriteRecipeModalTitle">${escapeHtml(recipe.name)}</h2></div><ol class="favorite-steps-list">${recipe.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`;
    $("#favoriteRecipeModal").classList.remove("hidden");
    $("#favoriteRecipeModal").setAttribute("aria-hidden", "false");
  }

  function closeFavoriteRecipeModal() {
    const modal = $("#favoriteRecipeModal");
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    $("#favoriteRecipeModalContent").innerHTML = "";
  }

  function displayFinderFavorites() {
    const target = $("#recipeFinderFavorites");
    if (!target) return;
    const recipes = state.recipes.map(normalizeRecipe).filter((recipe) => state.favorites.includes(recipe.id)).map((recipe) => calculateRecipeMatch(parseIngredientInput($("#recipeSearch").value), recipe));
    target.innerHTML = recipes.length ? recipes.map((recipe) => recipeCard(recipe, true)).join("") : emptyState("No favorites saved yet", "Tap the heart on a recipe to keep it here.");
  }

  function renderPantry() {
    displayPantry();
  }

  /* Add a pantry item from the form and save it for the active mode. */
  function addPantryItem(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name").trim();
    const quantity = Number(data.get("quantity"));
    if (!name) {
      showToast("Please enter all required fields", "error");
      event.currentTarget.elements.name.focus();
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      const quantityInput = event.currentTarget.elements.quantity;
      quantityInput.setCustomValidity("Quantity must be a whole number of 1 or more.");
      quantityInput.reportValidity();
      quantityInput.setCustomValidity("");
      showToast("Please enter a valid quantity", "error");
      return;
    }
    if (!data.get("expirationDate")) {
      showToast("Please enter all required fields", "error");
      event.currentTarget.elements.expirationDate.focus();
      return;
    }
    if (state.pantry.some((item) => normalizeIngredient(item.name) === normalizeIngredient(name))) {
      showToast("Pantry item already exists", "warning");
      return;
    }
    state.pantry.push({
      id: "p" + Date.now(),
      name,
      quantity,
      expirationDate: data.get("expirationDate"),
      category: data.get("category")
    });
    savePantryToStorage();
    event.currentTarget.reset();
    displayPantry();
    refreshRecipeResults();
    if (state.guestMode) showToast(`Pantry item saved for this session. ${GUEST_TEMPORARY_MESSAGE}`, "info");
    else showToast("Pantry item saved", "success", { saveToHistory: true, actionName: "View Pantry", actionTarget: "pantry" });
    const expiration = checkExpiration(data.get("expirationDate"));
    if (!state.guestMode && expiration.status === "Expires soon") showToast("Pantry item expires soon", "warning", { saveToHistory: true, actionName: "View Pantry", actionTarget: "pantry" });
  }

  /* Display all pantry items with their expiration status. */
  function displayPantry() {
    const expired = state.pantry.filter((item) => checkExpiration(item.expirationDate).status === "Expired").length;
    const attention = state.pantry.filter((item) => ["Expired", "Expires today", "Expires soon"].includes(checkExpiration(item.expirationDate).status)).length;
    const categories = new Set(state.pantry.map((item) => item.category).filter(Boolean)).size;
    $("#pantrySummary").innerHTML = `<div class="summary-card"><span>Pantry items</span><strong>${state.pantry.length}</strong></div><div class="summary-card warning"><span>Needs attention</span><strong>${attention}</strong></div><div class="summary-card ${expired ? "danger" : ""}"><span>Expired</span><strong>${expired}</strong></div><div class="summary-card"><span>Categories</span><strong>${categories}</strong></div>`;
    const pantryCards = state.pantry.length ? state.pantry.map((item) => {
      const expiration = checkExpiration(item.expirationDate);
      return `<article class="pantry-card">
        <div class="pantry-card-top"><span class="pantry-category">${escapeHtml(item.category || "Other")}</span><span class="expiration-badge ${expiration.className}">${expiration.status}</span></div>
        <h3>${escapeHtml(item.name)}</h3>
        <div class="pantry-details"><span><b>Quantity</b>${escapeHtml(item.quantity)}</span><span><b>Expiration date</b>${item.expirationDate ? formatDate(item.expirationDate) : "Not set"}</span></div>
        <button class="remove-button pantry-remove" data-remove-pantry="${item.id}" aria-label="Remove ${escapeHtml(item.name)}">Remove</button>
      </article>`;
    }).join("") : emptyState("Your pantry is empty", "Add milk, rice, spices, or anything else you want Chef Nova to track.");
    $("#pantryList").innerHTML = (state.guestMode ? guestNotice("Temporary Guest Pantry", GUEST_TEMPORARY_MESSAGE) : "") + pantryCards;
    suggestRecipes();
  }

  /* Remove an item from both the screen and the active mode's pantry storage. */
  function removePantryItem(id) {
    state.pantry = state.pantry.filter((item) => item.id !== id);
    savePantryToStorage();
    displayPantry();
    refreshRecipeResults();
    if (state.guestMode) showToast(`Pantry item removed for this session. ${GUEST_TEMPORARY_MESSAGE}`, "info");
    else showToast("Pantry item removed", "success", { saveToHistory: true, actionName: "View Pantry", actionTarget: "pantry" });
  }

  /* Return the freshness label for an expiration date. */
  function checkExpiration(date) {
    const days = daysUntil(date);
    if (days < 0) return { status: "Expired", className: "expired" };
    if (days === 0) return { status: "Expires today", className: "today" };
    if (days <= 3) return { status: "Expires soon", className: "soon" };
    return { status: "Fresh", className: "fresh" };
  }

  /* Suggest recipes that use at least one pantry ingredient. */
  function suggestRecipes() {
    const target = $("#pantryRecipeSuggestions");
    if (!target) return;
    const pantryIngredients = state.pantry.map((item) => item.name).filter(Boolean);
    const suggestions = pantryIngredients.length ? sortRecipesByMatch(state.recipes.map((recipe) => calculateRecipeMatch(pantryIngredients, normalizeRecipe(recipe))).filter((recipe) => recipe.matchedIngredients.length > 0)) : [];
    target.innerHTML = suggestions.length ? suggestions.map((recipe) => `<article class="suggestion-card">
      <div class="recipe-meta"><span>${recipe.matchPercentage}% match</span><span>◷ ${escapeHtml(recipe.cookingTime)} min</span><span>${escapeHtml(recipe.difficulty)}</span></div>
      <h3>${escapeHtml(recipe.name)}</h3>
      <div class="ingredient-block"><b>Matching pantry ingredients</b><div class="ingredient-tags matched-tags">${recipe.matchedIngredients.map((item) => `<span>${escapeHtml(item.name)}</span>`).join("")}</div></div>
      <div class="ingredient-block"><b>Missing ingredients</b><div class="ingredient-tags missing-tags">${recipe.missingIngredients.length ? recipe.missingIngredients.slice(0, 5).map((item) => `<span>${escapeHtml(item.name)}</span>`).join("") : "<span>None</span>"}</div></div>
    </article>`).join("") : emptyState("No recipe suggestions yet", "Add pantry items that match recipe ingredients, such as rice, eggs, chicken, pasta, or milk.");
  }

  function savePantryToStorage() {
    if (state.guestMode) {
      guestSessionData.pantry = state.pantry;
      persistGuestProgress();
      return false;
    }
    writeUserStorage(KEYS.pantry, state.pantry);
    return true;
  }

  function loadPantryFromStorage(fallback = []) {
    const pantry = readUserStorage(KEYS.pantry, fallback);
    return Array.isArray(pantry) ? pantry.map((item) => ({ ...item, quantity: Math.max(1, parseInt(item.quantity, 10) || 1) })) : [];
  }

  function renderPlanner() {
    displayMealPlanner();
  }

  /* Load the saved weekly plan or an empty plan for accounts with no saved meals. */
  function loadMealPlan(starterPlan = {}) {
    const savedPlan = readUserStorage(KEYS.plans, null);
    if (savedPlan) {
      const migrated = normalizeMealPlan(savedPlan);
      writeUserStorage(KEYS.plans, migrated);
      return migrated;
    }
    return normalizeMealPlan(starterPlan);
  }

  function saveMealPlan() {
    state.mealPlans = normalizeMealPlan(state.mealPlans);
    if (state.guestMode) {
      guestSessionData.mealPlans = state.mealPlans;
      persistGuestProgress();
      refreshRecipeResults();
      return false;
    }
    writeUserStorage(KEYS.plans, state.mealPlans);
    refreshRecipeResults();
    return true;
  }

  function createEmptyMealPlan() {
    return normalizeMealPlan({});
  }

  function createEmptyWeeklyMealPlan() {
    return createEmptyMealPlan();
  }

  function cloneMealPlan(plan) {
    const source = plan || {};
    const cloned = typeof structuredClone === "function" ? structuredClone(source) : JSON.parse(JSON.stringify(source));
    return normalizeMealPlan(cloned);
  }

  function clearMealPlan() {
    if (!window.confirm("Clear your weekly meal plan? This only removes planned meals.")) return;
    state.mealPlans = createEmptyMealPlan();
    saveMealPlan();
    displayMealPlanner();
    updateWeeklyNutritionSummary({ showNotification: true });
    if (state.guestMode) showToast(`Meal plan cleared for this session. ${GUEST_TEMPORARY_MESSAGE}`, "info");
    else showToast("Meal plan cleared", "success", { saveToHistory: true, actionName: "View Meal Planner", actionTarget: "planner" });
  }

  function getMealPlanPreferencesKey(userId = getCurrentUserId()) {
    return `chefNovaMealPlanPreferences_${userId || "guest"}`;
  }

  function getDefaultMealPlanningPreferences() {
    return { version: MEAL_PLAN_PREFERENCES_VERSION, preferredStyles: [], maximumCookingMinutes: null, preferredFoods: [], foodsToAvoid: [], updatedAt: "" };
  }

  function parsePreferenceText(value) {
    return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
  }

  function getMealPlanningPreferences() {
    const fallback = getDefaultMealPlanningPreferences();
    let saved = fallback;
    try {
      saved = state.guestMode ? JSON.parse(sessionStorage.getItem(GUEST_KEYS.mealPlanPreferences) || "null") || fallback : read(getMealPlanPreferencesKey(), fallback);
    } catch (_) {
      saved = fallback;
    }
    return {
      ...fallback,
      ...(saved && typeof saved === "object" ? saved : {}),
      preferredStyles: Array.isArray(saved?.preferredStyles) ? saved.preferredStyles : [],
      maximumCookingMinutes: Number.isFinite(Number(saved?.maximumCookingMinutes)) && Number(saved.maximumCookingMinutes) > 0 ? Number(saved.maximumCookingMinutes) : null,
      preferredFoods: Array.isArray(saved?.preferredFoods) ? saved.preferredFoods : [],
      foodsToAvoid: Array.isArray(saved?.foodsToAvoid) ? saved.foodsToAvoid : []
    };
  }

  function saveMealPlanningPreferences(preferences) {
    const normalized = {
      version: MEAL_PLAN_PREFERENCES_VERSION,
      preferredStyles: Array.from(new Set((preferences.preferredStyles || []).filter(Boolean))),
      maximumCookingMinutes: Number.isFinite(Number(preferences.maximumCookingMinutes)) && Number(preferences.maximumCookingMinutes) > 0 ? Number(preferences.maximumCookingMinutes) : null,
      preferredFoods: parsePreferenceText((preferences.preferredFoods || []).join ? preferences.preferredFoods.join(",") : preferences.preferredFoods),
      foodsToAvoid: parsePreferenceText((preferences.foodsToAvoid || []).join ? preferences.foodsToAvoid.join(",") : preferences.foodsToAvoid),
      updatedAt: new Date().toISOString()
    };
    if (state.guestMode) sessionStorage.setItem(GUEST_KEYS.mealPlanPreferences, JSON.stringify(normalized));
    else write(getMealPlanPreferencesKey(), normalized);
    return normalized;
  }

  function saveMealPlanningPreferencesFromForm() {
    const selectedStyles = $$("[data-meal-style-preference]:checked").map((input) => input.value);
    const normalizedStyles = selectedStyles.includes("no-preference") ? [] : selectedStyles;
    const preferences = saveMealPlanningPreferences({
      preferredStyles: normalizedStyles,
      maximumCookingMinutes: $("#mealPlanMaxTimePreference")?.value || null,
      preferredFoods: parsePreferenceText($("#mealPlanPreferredFoods")?.value || ""),
      foodsToAvoid: parsePreferenceText($("#mealPlanFoodsToAvoid")?.value || "")
    });
    renderMealPlanPreferences(preferences);
    const status = $("#mealPlanPreferenceStatus");
    if (status) status.textContent = state.guestMode ? `Meal Plan Preferences saved for this session. ${GUEST_TEMPORARY_MESSAGE}` : "Meal Plan Preferences saved.";
  }

  function renderMealPlanPreferences(preferences = getMealPlanningPreferences()) {
    $$("[data-meal-style-preference]").forEach((input) => {
      input.checked = preferences.preferredStyles.includes(input.value);
      if (input.value === "no-preference") input.checked = !preferences.preferredStyles.length;
    });
    const maxTime = $("#mealPlanMaxTimePreference");
    if (maxTime) maxTime.value = preferences.maximumCookingMinutes ? String(preferences.maximumCookingMinutes) : "";
    const preferredFoods = $("#mealPlanPreferredFoods");
    if (preferredFoods && document.activeElement !== preferredFoods) preferredFoods.value = preferences.preferredFoods.join(", ");
    const foodsToAvoid = $("#mealPlanFoodsToAvoid");
    if (foodsToAvoid && document.activeElement !== foodsToAvoid) foodsToAvoid.value = preferences.foodsToAvoid.join(", ");
  }

  function getCookingTimePreferences() {
    return { maximumCookingMinutes: getMealPlanningPreferences().maximumCookingMinutes };
  }

  function getActivePantryItems() {
    return state.pantry || [];
  }

  function getActiveMealPlan() {
    return state.mealPlans || getSavedMealPlan();
  }

  function getAvailableRecipes() {
    return state.recipes.map(normalizeRecipe);
  }

  function buildMealPlanGenerationContext() {
    const nutritionProfile = getCurrentNutritionProfile();
    const dailyTarget = getCurrentDailyNutritionTarget(nutritionProfile);
    const userProfile = getCurrentUser();
    const preferredMeals = getMealPlanningPreferences();
    return {
      nutritionProfile,
      dailyTarget,
      userProfile,
      pantryItems: getActivePantryItems(),
      currentMealPlan: getActiveMealPlan(),
      recipes: getAvailableRecipes(),
      allergies: userProfile?.allergies || [],
      dietaryPreferences: userProfile?.dietaryPreference ? [userProfile.dietaryPreference] : [],
      preferredMeals,
      cookingTimePreferences: getCookingTimePreferences(),
      goalType: nutritionProfile?.goal || null,
      workoutProfile: nutritionProfile?.workoutProfile || null,
      ageSafetyStatus: nutritionProfile?.ageSafetyStatus || "unknown"
    };
  }

  function openMealPlanGenerationOptions() {
    mealPlanGenerationLastFocus = document.activeElement;
    saveMealPlanningPreferencesFromForm();
    pendingGeneratedMealPlan = null;
    renderMealPlanGenerationModal(`<div class="meal-generation-heading"><span class="eyebrow">CHEF NOVA SUGGESTIONS</span><h2 id="mealPlanGenerationTitle">Generate Suggested Meal Plan?</h2><p>Chef Nova can fill empty meal slots or replace the current plan. Existing planned meals will not be changed unless you choose to replace them.</p></div>
      <div class="meal-generation-actions">
        <button class="button primary" type="button" data-meal-generation-mode="${MEAL_PLAN_GENERATION_MODES.FILL_EMPTY}">Fill Empty Slots</button>
        <button class="button secondary" type="button" data-meal-generation-mode="${MEAL_PLAN_GENERATION_MODES.REPLACE_ALL}">Replace Entire Plan</button>
        <button class="button secondary" type="button" data-cancel-generated-plan>Cancel</button>
      </div>`);
  }

  function renderMealPlanGenerationModal(content) {
    const modal = $("#mealPlanGenerationModal");
    const body = $("#mealPlanGenerationContent");
    if (!modal || !body) return;
    body.innerHTML = content;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    setTimeout(() => body.querySelector("button")?.focus(), 0);
  }

  function closeMealPlanGenerationModal() {
    const modal = $("#mealPlanGenerationModal");
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    $("#mealPlanGenerationContent").innerHTML = "";
    document.body.classList.remove("modal-open");
    if (mealPlanGenerationLastFocus && typeof mealPlanGenerationLastFocus.focus === "function") mealPlanGenerationLastFocus.focus();
  }

  function handleMealPlanGenerationKeydown(event) {
    const modal = $("#mealPlanGenerationModal");
    if (!modal || modal.classList.contains("hidden")) return false;
    if (event.key === "Escape") {
      closeMealPlanGenerationModal();
      return true;
    }
    if (event.key !== "Tab") return false;
    const focusable = $$("button, input, select, textarea, [href], [tabindex]:not([tabindex='-1'])", modal).filter((item) => !item.disabled && item.offsetParent !== null);
    if (!focusable.length) return false;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return true;
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
      return true;
    }
    return false;
  }

  function createSuggestedMealPlanPreview(mode = MEAL_PLAN_GENERATION_MODES.FILL_EMPTY) {
    const context = buildMealPlanGenerationContext();
    const result = generatePersonalizedMealPlan(context, { mode });
    if (!result.success) {
      renderMealPlanGenerationModal(`<div class="meal-generation-heading"><h2 id="mealPlanGenerationTitle">Suggested Meal Plan</h2><p>${escapeHtml(result.message)}</p></div><div class="meal-generation-actions"><button class="button secondary" type="button" data-cancel-generated-plan>Cancel</button></div>`);
      return;
    }
    pendingGeneratedMealPlan = { ...result, mode };
    renderMealPlanGenerationModal(renderGeneratedMealPlanPreview(result, mode));
    const region = $("#mealPlanPreviewRegion");
    if (region) region.textContent = "Suggested meal plan created. Review the plan before applying it.";
  }

  function regenerateSuggestedMealPlan() {
    createSuggestedMealPlanPreview(pendingGeneratedMealPlan?.mode || MEAL_PLAN_GENERATION_MODES.FILL_EMPTY);
  }

  function cancelSuggestedMealPlanPreview() {
    pendingGeneratedMealPlan = null;
    closeMealPlanGenerationModal();
  }

  function applySuggestedMealPlan() {
    if (applyGeneratedMealPlan(pendingGeneratedMealPlan)) {
      pendingGeneratedMealPlan = null;
      closeMealPlanGenerationModal();
    }
  }

  function generateSuggestedMealPlan(context, mode = MEAL_PLAN_GENERATION_MODES.FILL_EMPTY) {
    return generatePersonalizedMealPlan(context, { mode });
  }

  function generatePersonalizedMealPlan(context, options = {}) {
    const validation = validateMealPlanGenerationContext(context);
    if (!validation.valid) return createFailedMealPlanGenerationResult(validation.message);
    const normalizedOptions = {
      mode: options.mode === MEAL_PLAN_GENERATION_MODES.REPLACE_ALL ? MEAL_PLAN_GENERATION_MODES.REPLACE_ALL : MEAL_PLAN_GENERATION_MODES.FILL_EMPTY,
      includeSnacks: options.includeSnacks === true,
      days: Array.isArray(options.days) && options.days.length ? options.days : DAYS.map((day) => day.toLowerCase())
    };
    const recipeLookup = new Map(context.recipes.map((recipe) => [recipe.id, normalizeRecipe(recipe)]));
    const planningContext = { ...context, recipeLookup, mealPlanPreferences: context.mealPlanPreferences || context.preferredMeals || getDefaultMealPlanningPreferences() };
    const eligibleRecipes = filterRecipesForMealPlanSafety(context.recipes.map(normalizeRecipe), planningContext).filter(hasValidMealPlanData);
    if (!eligibleRecipes.length) return createFailedMealPlanGenerationResult("Chef Nova could not find enough compatible recipes to create a suggested plan.");
    const groupedRecipes = groupRecipesByMealType(eligibleRecipes);
    const hasGroupedRecipes = Object.values(groupedRecipes).some((group) => group.length);
    if (!hasGroupedRecipes) return createFailedMealPlanGenerationResult("Chef Nova could not find enough compatible recipes for the selected meal slots.");
    const workingPlan = normalizedOptions.mode === MEAL_PLAN_GENERATION_MODES.REPLACE_ALL ? createEmptyWeeklyMealPlan() : cloneMealPlan(planningContext.currentMealPlan);
    const generationState = createMealPlanGenerationState(workingPlan);
    buildPersonalizedMealPlanDays(workingPlan, groupedRecipes, planningContext, generationState, normalizedOptions);
    improveGeneratedMealPlan(workingPlan, groupedRecipes, planningContext, generationState);
    const safety = validateGeneratedMealPlanSafety(workingPlan, planningContext);
    if (!safety.valid) return createFailedMealPlanGenerationResult("Chef Nova could not create a suggested plan using the current recipe and preference settings.");
    const dailySummaries = DAYS.reduce((summaries, day) => {
      summaries[day] = buildGeneratedDailySummary(day, workingPlan[day] || {}, planningContext);
      return summaries;
    }, {});
    const weeklySummary = buildGeneratedWeeklySummary(workingPlan, dailySummaries, planningContext, generationState);
    const nutritionDataCoverage = weeklySummary.nutritionDataCoverage;
    if (!validateDailyNutritionTarget(planningContext.dailyTarget)) weeklySummary.generationNotes.push("Personalized nutrition matching was unavailable, so general balanced-meal rules were used.");
    const result = {
      success: true,
      plan: workingPlan,
      dailySummaries,
      weeklySummary,
      summary: buildGeneratedMealPlanSummary(workingPlan, planningContext, generationState),
      generationNotes: Array.from(new Set(weeklySummary.generationNotes)),
      unmatchedPreferences: identifyUnmatchedMealPlanPreferences(workingPlan, planningContext),
      nutritionDataCoverage
    };
    return result;
  }

  function createFailedMealPlanGenerationResult(message) {
    return { success: false, plan: null, dailySummaries: {}, weeklySummary: null, generationNotes: [], unmatchedPreferences: [], nutritionDataCoverage: null, message };
  }

  function validateMealPlanGenerationContext(context) {
    if (!context || !Array.isArray(context.recipes)) return { valid: false, message: "Recipe information is unavailable." };
    if (context.recipes.length === 0) return { valid: false, message: "No recipes are available." };
    return { valid: true, message: null };
  }

  function filterRecipesForMealPlanSafety(recipes, context) {
    return recipes.filter((recipe) => {
      if (!isRecipeSafeForUser(recipe, context.userProfile)) return false;
      if (!matchesDietaryPreferences(recipe, context.userProfile)) return false;
      if (matchesUserAvoidedFood(recipe, context.mealPlanPreferences?.foodsToAvoid)) return false;
      return true;
    });
  }

  function groupRecipesByMealType(recipes) {
    const groups = { breakfast: [], lunch: [], dinner: [], snack: [] };
    recipes.forEach((recipe) => {
      Object.keys(groups).forEach((mealType) => {
        if (isRecipeSuitableForMealType(recipe, mealType)) groups[mealType].push(recipe);
      });
    });
    return groups;
  }

  function createMealPlanGenerationState(initialPlan) {
    return {
      recipeUseCounts: buildRecipeUseCounts(initialPlan),
      primaryProteinCounts: new Map(),
      carbohydrateGroupCounts: new Map(),
      produceGroupCounts: new Map(),
      dailyTotals: createEmptyDailyNutritionState(),
      selectedRecipeIdsByDay: {},
      generationNotes: []
    };
  }

  function buildRecipeUseCounts(plan) {
    const counts = new Map();
    getRecipeIdsFromMealPlan(plan).forEach((id) => counts.set(id, (counts.get(id) || 0) + 1));
    return counts;
  }

  function createEmptyDailyNutritionState() {
    return DAYS.reduce((totals, day) => {
      totals[day] = { totals: createEmptyNutritionTotals(), mealsWithNutritionData: 0, totalMeals: 0, completeCoreNutrition: true };
      return totals;
    }, {});
  }

  function createEmptyNutritionTotals() {
    return { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fibre: 0, sugar: 0, addedSugar: 0, vegetableServings: 0, knownFields: { calories: true, protein: true, carbohydrates: true, fat: true, fibre: true, sugar: true, vegetableServings: true } };
  }

  function buildPersonalizedMealPlanDays(workingPlan, groupedRecipes, context, generationState, options) {
    const dayOrder = getMealPlanDays(options);
    const mealOrder = ["breakfast", "lunch", "dinner"];
    if (options.includeSnacks) mealOrder.push("snack");
    dayOrder.forEach((day) => {
      mealOrder.forEach((mealType) => {
        if (shouldPreserveExistingMeal(workingPlan, day, mealType, options.mode)) {
          registerExistingMealInGenerationState(workingPlan[day]?.[toDisplayMealType(mealType)], day, mealType, generationState, context);
          generationState.dailyTotals[day] = calculateGeneratedDayTotals(workingPlan[day] || {}, context.recipeLookup);
          return;
        }
        const candidates = groupedRecipes[mealType] || [];
        const slotContext = buildMealSlotContext(workingPlan, day, mealType, generationState, context);
        const ranked = rankRecipesForMealSlot(candidates, slotContext, generationState, context);
        const selected = selectMealPlanCandidate(ranked, generationState);
        if (!selected) {
          generationState.generationNotes.push(`No compatible ${mealType} recipe was available for ${day}.`);
          return;
        }
        addRecipeToWorkingPlan(workingPlan, day, mealType, selected.recipe, 1, selected.score);
        registerSelectedRecipe(selected.recipe, day, mealType, generationState, context);
        generationState.dailyTotals[day] = calculateGeneratedDayTotals(workingPlan[day] || {}, context.recipeLookup);
      });
    });
  }

  function getMealPlanDays(options = {}) {
    const requested = new Set((options.days || DAYS).map((day) => normalizeIngredient(day)));
    return DAYS.filter((day) => requested.has(normalizeIngredient(day)));
  }

  function toDisplayMealType(mealType) {
    return MEALS.find((meal) => normalizeIngredient(meal) === normalizeIngredient(mealType)) || mealType;
  }

  function shouldPreserveExistingMeal(workingPlan, day, mealType, mode) {
    if (mode !== MEAL_PLAN_GENERATION_MODES.FILL_EMPTY) return false;
    return Boolean(normalizeMealPlanEntry((workingPlan[day] || {})[toDisplayMealType(mealType)]));
  }

  function registerExistingMealInGenerationState(meal, day, mealType, generationState, context) {
    const entry = normalizeMealPlanEntry(meal);
    if (!entry?.recipeId) return;
    const recipe = context.recipeLookup.get(entry.recipeId) || findRecipeById(entry.recipeId);
    if (recipe) registerSelectedRecipe(recipe, day, mealType, generationState, context, { countUse: false, servings: entry.servings || 1 });
  }

  function buildMealSlotContext(workingPlan, day, mealType, generationState, context = {}) {
    const displayMeal = toDisplayMealType(mealType);
    const dayIndex = DAYS.indexOf(day);
    const previousDay = dayIndex > 0 ? DAYS[dayIndex - 1] : null;
    const currentDailyTotals = calculateGeneratedDayTotals(workingPlan[day] || {}, context.recipeLookup || new Map(state.recipes.map((recipe) => [recipe.id, recipe]))).totals;
    const mealsAlreadySelectedToday = MEALS.map((meal) => normalizeMealPlanEntry((workingPlan[day] || {})[meal])).filter(Boolean);
    const previousDayMeals = previousDay ? MEALS.map((meal) => normalizeMealPlanEntry((workingPlan[previousDay] || {})[meal])).filter(Boolean) : [];
    return { day, mealType: normalizeIngredient(displayMeal), slotIndex: MEALS.indexOf(displayMeal), currentDailyTotals, mealsAlreadySelectedToday, previousDayMeals, currentPlan: workingPlan };
  }

  function addRecipeToWorkingPlan(workingPlan, day, mealType, recipe, servings = 1, score = null) {
    const displayMeal = toDisplayMealType(mealType);
    workingPlan[day] = workingPlan[day] || {};
    const reasons = score?.reasons || buildRecipeMatchReasons(recipe, { goal: getCurrentNutritionProfile()?.goal }, []);
    workingPlan[day][displayMeal] = { ...createRecipeMealEntry(recipe, servings), source: "suggested", generatedAt: new Date().toISOString(), suggestionReasons: reasons };
  }

  function registerSelectedRecipe(recipe, day, mealType, generationState, context, options = {}) {
    if (!recipe?.id) return;
    if (options.countUse !== false) generationState.recipeUseCounts.set(recipe.id, (generationState.recipeUseCounts.get(recipe.id) || 0) + 1);
    generationState.selectedRecipeIdsByDay[day] = generationState.selectedRecipeIdsByDay[day] || new Set();
    generationState.selectedRecipeIdsByDay[day].add(recipe.id);
    const proteinGroup = getRecipePrimaryProteinGroup(recipe);
    if (proteinGroup) generationState.primaryProteinCounts.set(proteinGroup, (generationState.primaryProteinCounts.get(proteinGroup) || 0) + 1);
    const carbohydrateGroup = getRecipeCarbohydrateGroup(recipe);
    if (carbohydrateGroup) generationState.carbohydrateGroupCounts.set(carbohydrateGroup, (generationState.carbohydrateGroupCounts.get(carbohydrateGroup) || 0) + 1);
    getRecipeProduceGroups(recipe).forEach((group) => generationState.produceGroupCounts.set(group, (generationState.produceGroupCounts.get(group) || 0) + 1));
    if (day) generationState.dailyTotals[day] = generationState.dailyTotals[day] || { totals: createEmptyNutritionTotals(), mealsWithNutritionData: 0, totalMeals: 0, completeCoreNutrition: true };
  }

  function rankRecipesForMealSlot(recipes, slotContext, generationState, context) {
    return recipes.map((recipe) => ({ recipe, score: scoreRecipeForPersonalizedMealPlan(recipe, slotContext, generationState, context) })).filter((candidate) => candidate.score.eligible).sort((a, b) => b.score.total - a.score.total);
  }

  function selectMealPlanCandidate(rankedCandidates) {
    if (!rankedCandidates.length) return null;
    const topCandidates = rankedCandidates.slice(0, Math.min(3, rankedCandidates.length));
    return topCandidates[Math.floor(Math.random() * topCandidates.length)] || null;
  }

  function selectFromTopMealCandidates(candidates, topCount = 3) {
    const sorted = [...candidates].sort((a, b) => b.score - a.score);
    const top = sorted.slice(0, Math.min(topCount, sorted.length));
    return top[Math.floor(Math.random() * top.length)] || null;
  }

  function getEligibleMealPlanRecipes(recipes, context) {
    return filterRecipesForMealPlanSafety(recipes, { ...context, mealPlanPreferences: context.mealPlanPreferences || context.preferredMeals }).filter(hasValidMealPlanData);
  }

  function hasValidMealPlanData(recipe) {
    return Boolean(recipe?.id && recipe?.name && recipe?.category && Number(recipe?.servings) > 0 && MEAL_CATEGORIES.includes(recipe.category));
  }

  function getNormalizedRecipeCategories(recipe) {
    return [recipe.category, recipe.subcategory, ...(Array.isArray(recipe.keywords) ? recipe.keywords : [])].map(normalizeIngredient).filter(Boolean);
  }

  function isRecipeSuitableForMealType(recipe, mealType) {
    const categories = getNormalizedRecipeCategories(recipe);
    if (mealType === "breakfast") return categories.some((category) => ["breakfast", "brunch"].includes(category));
    if (mealType === "lunch") return categories.some((category) => ["lunch", "brunch", "dinner"].includes(category));
    if (mealType === "dinner") return categories.some((category) => ["dinner", "lunch"].includes(category));
    if (mealType === "snack") return categories.some((category) => ["snack", "breakfast", "brunch"].includes(category));
    return false;
  }

  function matchesUserAvoidedFood(recipe, foodsToAvoid = []) {
    const avoid = foodsToAvoid.map(normalizeIngredient).filter(Boolean);
    if (!avoid.length) return false;
    const recipeTerms = [recipe.name, recipe.category, recipe.subcategory, ...(recipe.keywords || []), ...normalizeIngredientList(recipe.ingredients).map((item) => item.name)].map(normalizeIngredient);
    return avoid.some((term) => recipeTerms.some((recipeTerm) => recipeTerm === term || recipeTerm.split(" ").includes(term)));
  }

  function buildDailyPlanningRanges(dailyTarget) {
    if (!validateDailyNutritionTarget(dailyTarget)) return null;
    return {
      calories: { minimum: dailyTarget.calorieMin, maximum: dailyTarget.calorieMax },
      protein: { minimum: dailyTarget.proteinMin, maximum: dailyTarget.proteinMax },
      carbohydrates: { minimum: dailyTarget.carbohydrateMin, maximum: dailyTarget.carbohydrateMax },
      fat: { minimum: dailyTarget.fatMin, maximum: dailyTarget.fatMax }
    };
  }

  function scoreRecipeForPersonalizedMealPlan(recipe, slotContext, generationState, context) {
    const result = {
      eligible: true,
      total: 0,
      components: { dietMatch: 0, nutritionFit: 0, pantryMatch: 0, goalMatch: 0, recipeVariety: 0, cookingTimeMatch: 0 },
      reasons: []
    };
    if (!isRecipeSafeForUser(recipe, context.userProfile)) return { ...result, eligible: false, reason: "allergy-conflict" };
    if (!matchesDietaryPreferences(recipe, context.userProfile)) return { ...result, eligible: false, reason: "dietary-incompatible" };
    if (matchesUserAvoidedFood(recipe, context.mealPlanPreferences?.foodsToAvoid)) return { ...result, eligible: false, reason: "avoided-food" };
    result.components.dietMatch = calculateMealPlanDietMatchScore(recipe, context);
    result.components.nutritionFit = calculateMealPlanNutritionFitScore(recipe, slotContext, generationState, context);
    result.components.pantryMatch = calculateMealPlanPantryScore(recipe, context);
    result.components.goalMatch = calculateMealPlanGoalScore(recipe, context);
    result.components.recipeVariety = calculateMealPlanVarietyScore(recipe, slotContext, generationState, context);
    result.components.cookingTimeMatch = calculateMealPlanCookingTimeScore(recipe, context);
    result.total = Math.max(0, Math.min(100, Math.round(Object.values(result.components).reduce((sum, value) => sum + value, 0))));
    const pantry = calculatePantryMatch(recipe, context.pantryItems || []);
    if (pantry.matched > 0) result.reasons.push("Uses pantry ingredients");
    if (isHigherProteinRecipe(recipe)) result.reasons.push("Higher protein");
    if (hasMeaningfulProduce(recipe)) result.reasons.push("Includes vegetables or fruit");
    if (hasUnsaturatedFatSource(recipe)) result.reasons.push("Includes sources of unsaturated fats");
    return { ...result, reasons: Array.from(new Set(result.reasons)).slice(0, 3) };
  }

  function scoreRecipeForMealPlanSlot(recipe, slotContext, generationState, context) {
    return scoreRecipeForPersonalizedMealPlan(recipe, slotContext, generationState, context);
  }

  function calculateMealPlanDietMatchScore(recipe, context) {
    const preferences = (context?.dietaryPreferences || []).map(normalizeIngredient).filter((item) => item && item !== "no preference");
    if (!preferences.length) return MEAL_PLAN_RECIPE_SCORE_WEIGHTS.dietMatch;
    if (!matchesDietaryPreferences(recipe, context.userProfile)) return 0;
    const explicitMatches = countExplicitDietaryMatches(recipe, preferences);
    const matchRatio = Math.min(1, explicitMatches / preferences.length);
    return Math.round(15 + matchRatio * 10);
  }

  function countExplicitDietaryMatches(recipe, preferences) {
    const tags = (recipe?.dietaryTags || []).map(normalizeIngredient);
    return preferences.filter((preference) => tags.includes(preference)).length;
  }

  function calculateMealPlanNutritionFitScore(recipe, slotContext, generationState, context) {
    const nutrition = getRecipeNutritionForServings(recipe, 1);
    if (!hasAnyValidRecipeNutrition(nutrition)) return 5;
    if (!validateDailyNutritionTarget(context.dailyTarget)) return calculateGeneralMealBalanceScore(recipe, nutrition);
    const projectedTotals = addRecipeNutritionToTotals(slotContext.currentDailyTotals, nutrition);
    const fit = calculateProjectedDailyRangeFit(projectedTotals, context.dailyTarget, slotContext);
    return Math.round(Math.max(0, Math.min(MEAL_PLAN_RECIPE_SCORE_WEIGHTS.nutritionFit, fit * MEAL_PLAN_RECIPE_SCORE_WEIGHTS.nutritionFit)));
  }

  function hasAnyValidRecipeNutrition(nutrition) {
    return ["calories", "protein", "carbohydrates", "fat", "fibre", "sugar", "vegetableServings"].some((field) => Number.isFinite(nutrition?.[field]) && nutrition[field] >= 0);
  }

  function addRecipeNutritionToTotals(currentTotals, recipeNutrition) {
    const totals = createEmptyNutritionTotals();
    ["calories", "protein", "carbohydrates", "fat", "fibre", "sugar", "addedSugar", "vegetableServings"].forEach((key) => {
      const current = Number.isFinite(currentTotals?.[key]) ? currentTotals[key] : 0;
      const added = Number.isFinite(recipeNutrition?.[key]) ? recipeNutrition[key] : 0;
      totals[key] = current + added;
      totals.knownFields[key] = currentTotals?.knownFields?.[key] !== false && Number.isFinite(recipeNutrition?.[key]);
    });
    return totals;
  }

  function addKnownNutritionToTotals(totals, nutrition) {
    ["calories", "protein", "carbohydrates", "fat", "fibre", "sugar", "addedSugar", "vegetableServings"].forEach((key) => {
      if (Number.isFinite(nutrition?.[key])) totals[key] += nutrition[key];
      else if (totals.knownFields) totals.knownFields[key] = false;
    });
    return totals;
  }

  function calculateProjectedDailyRangeFit(projectedTotals, dailyTarget, slotContext) {
    if (!validateDailyNutritionTarget(dailyTarget)) return 0.5;
    const mealProgress = getMealProgressFraction(slotContext.mealType, slotContext);
    const expectedRanges = buildExpectedProgressRanges(dailyTarget, mealProgress);
    const nutrientScores = [
      scoreValueAgainstFlexibleRange(projectedTotals.calories, expectedRanges.calories),
      scoreValueAgainstFlexibleRange(projectedTotals.protein, expectedRanges.protein),
      scoreValueAgainstFlexibleRange(projectedTotals.carbohydrates, expectedRanges.carbohydrates),
      scoreValueAgainstFlexibleRange(projectedTotals.fat, expectedRanges.fat)
    ].filter(Number.isFinite);
    if (!nutrientScores.length) return 0.5;
    return nutrientScores.reduce((sum, value) => sum + value, 0) / nutrientScores.length;
  }

  function getMealProgressFraction(mealType) {
    if (mealType === "breakfast") return 0.25;
    if (mealType === "lunch") return 0.6;
    if (mealType === "dinner") return 1;
    return 1;
  }

  function buildExpectedProgressRanges(dailyTarget, mealProgress) {
    const rangeFor = (minimum, maximum) => ({ minimum: minimum * mealProgress * 0.75, maximum: maximum * mealProgress * 1.15 });
    return {
      calories: rangeFor(dailyTarget.calorieMin, dailyTarget.calorieMax),
      protein: rangeFor(dailyTarget.proteinMin, dailyTarget.proteinMax),
      carbohydrates: rangeFor(dailyTarget.carbohydrateMin, dailyTarget.carbohydrateMax),
      fat: rangeFor(dailyTarget.fatMin, dailyTarget.fatMax)
    };
  }

  function scoreValueAgainstFlexibleRange(value, range) {
    if (!Number.isFinite(value) || !range || !Number.isFinite(range.minimum) || !Number.isFinite(range.maximum)) return null;
    if (value >= range.minimum && value <= range.maximum) return 1;
    if (value < range.minimum) return Math.max(0, 1 - (range.minimum - value) / Math.max(range.minimum * 0.5, 1));
    return Math.max(0, 1 - (value - range.maximum) / Math.max(range.maximum * 0.5, 1));
  }

  function calculateMealPlanPantryScore(recipe, context) {
    const match = calculatePantryMatch(recipe, context.pantryItems || []);
    if (!match.available) return 5;
    return Math.round(match.percentage * 0.2);
  }

  function calculateMealPlanGoalScore(recipe, context) {
    const score = calculateRecipeGoalScore(recipe, { ...context, goal: context.goalType });
    return Math.max(0, Math.min(MEAL_PLAN_RECIPE_SCORE_WEIGHTS.goalMatch, Math.round(score * 0.15)));
  }

  function calculateMealPlanVarietyScore(recipe, slotContext, generationState) {
    let score = MEAL_PLAN_RECIPE_SCORE_WEIGHTS.recipeVariety;
    const recipeUseCount = generationState.recipeUseCounts?.get(recipe.id) || 0;
    const useLimit = DEFAULT_RECIPE_USE_LIMITS[slotContext.mealType] || DEFAULT_MAX_RECIPE_USES_PER_WEEK;
    if (recipeUseCount >= useLimit) score -= 8;
    else if (recipeUseCount === 1) score -= 4;
    if (wasRecipeUsedPreviousDay(recipe, slotContext, generationState)) score -= 4;
    const proteinGroup = getRecipePrimaryProteinGroup(recipe);
    if (proteinGroup && wasProteinGroupOverused(proteinGroup, generationState)) score -= 3;
    const carbohydrateGroup = getRecipeCarbohydrateGroup(recipe);
    if (carbohydrateGroup && wasCarbohydrateGroupOverused(carbohydrateGroup, generationState)) score -= 2;
    return Math.max(0, Math.min(MEAL_PLAN_RECIPE_SCORE_WEIGHTS.recipeVariety, score));
  }

  function calculateMealPlanCookingTimeScore(recipe, context) {
    const maximumMinutes = context?.mealPlanPreferences?.maximumCookingMinutes;
    const recipeMinutes = getRecipeTotalMinutes(recipe);
    if (!Number.isFinite(maximumMinutes)) return MEAL_PLAN_RECIPE_SCORE_WEIGHTS.cookingTimeMatch;
    if (!Number.isFinite(recipeMinutes)) return 1;
    if (recipeMinutes <= maximumMinutes) return 5;
    const difference = recipeMinutes - maximumMinutes;
    if (difference <= 10) return 3;
    if (difference <= 20) return 1;
    return 0;
  }

  function calculateGeneralMealBalanceScore(recipe, nutrition) {
    let score = 0;
    if (Number.isFinite(nutrition.protein) && nutrition.protein >= 10) score += 6;
    if (Number.isFinite(nutrition.carbohydrates) && nutrition.carbohydrates > 0) score += 5;
    if (hasMeaningfulProduce(recipe, nutrition)) score += 8;
    if (hasReliableFatSource(recipe) || (Number.isFinite(nutrition.fat) && nutrition.fat > 0)) score += 4;
    if (Number.isFinite(nutrition.fibre) && nutrition.fibre >= 3) score += 2;
    return Math.min(MEAL_PLAN_RECIPE_SCORE_WEIGHTS.nutritionFit, score);
  }

  function calculateMealPreferenceScore(recipe, context) {
    const preferences = context.preferredMeals || getDefaultMealPlanningPreferences();
    let score = 35;
    if (preferences.preferredStyles.includes("quick-meals") && isQuickMealRecipe(recipe)) score += 20;
    if (preferences.preferredStyles.includes("pantry-friendly") && calculatePantryMatch(recipe, context.pantryItems).percentage >= 40) score += 20;
    if (preferences.preferredStyles.includes("vegetable-rich") && isVegetableRichRecipe(recipe)) score += 20;
    if (preferences.preferredStyles.includes("higher-protein") && isHigherProteinRecipe(recipe)) score += 20;
    if (preferences.preferredStyles.includes("workout-friendly") && isWorkoutFriendlyRecipe(recipe, { ...context, goal: context.goalType })) score += 20;
    if (preferences.preferredStyles.includes("make-ahead-meals") && getRecipeTotalMinutes(recipe) >= 30) score += 10;
    const preferredTerms = preferences.preferredFoods.map(normalizeIngredient).filter(Boolean);
    const recipeTerms = [recipe.name, recipe.subcategory, ...(recipe.keywords || []), ...normalizeIngredientList(recipe.ingredients).map((item) => item.name)].map(normalizeIngredient);
    if (preferredTerms.some((term) => recipeTerms.some((recipeTerm) => recipeTerm === term || recipeTerm.includes(term)))) score += 25;
    const maxTime = preferences.maximumCookingMinutes;
    if (maxTime && Number.isFinite(getRecipeTotalMinutes(recipe))) score += getRecipeTotalMinutes(recipe) <= maxTime ? 20 : -20;
    return Math.max(0, Math.min(100, score));
  }

  function canUseRecipeAgain(recipe, generationState) {
    return (generationState.recipeUseCounts.get(recipe.id) || 0) < DEFAULT_MAX_RECIPE_USES_PER_WEEK;
  }

  function recordGeneratedRecipeUse(recipe, generationState, mealType = "") {
    generationState.recipeUseCounts.set(recipe.id, (generationState.recipeUseCounts.get(recipe.id) || 0) + 1);
    const proteinGroup = getRecipePrimaryProteinGroup(recipe);
    generationState.primaryProteinCounts.set(proteinGroup, (generationState.primaryProteinCounts.get(proteinGroup) || 0) + 1);
    const carbohydrateGroup = getRecipeCarbohydrateGroup(recipe);
    if (carbohydrateGroup) generationState.carbohydrateGroupCounts.set(carbohydrateGroup, (generationState.carbohydrateGroupCounts.get(carbohydrateGroup) || 0) + 1);
    if (mealType) registerSelectedRecipe(recipe, "", mealType, generationState, { recipeLookup: new Map() }, { countUse: false });
  }

  function calculateGeneratedDayTotals(dayPlan, recipeLookup) {
    const result = { totals: createEmptyNutritionTotals(), mealsWithNutritionData: 0, totalMeals: 0, completeCoreNutrition: true };
    Object.values(dayPlan || {}).forEach((meal) => {
      const entry = normalizeMealPlanEntry(meal);
      if (!entry?.recipeId) return;
      result.totalMeals += 1;
      const recipe = recipeLookup.get(entry.recipeId) || findRecipeById(entry.recipeId);
      const nutrition = getRecipeNutritionForServings(recipe, entry.servings || 1);
      if (hasValidCoreRecipeNutrition(nutrition)) result.mealsWithNutritionData += 1;
      else result.completeCoreNutrition = false;
      addKnownNutritionToTotals(result.totals, nutrition);
    });
    return result;
  }

  function evaluateGeneratedDayBalance(dailyTotals, dailyTarget, dayPlan, context) {
    const issues = [];
    const strengths = [];
    if (!validateDailyNutritionTarget(dailyTarget)) return evaluateGeneralFoodVariety(dayPlan, context);
    if (dailyTotals.totalMeals && dailyTotals.mealsWithNutritionData < Math.max(2, dailyTotals.totalMeals * 0.7)) issues.push("limited-nutrition-data");
    evaluateNutrientRange("calories", dailyTotals.totals.calories, dailyTarget.calorieMin, dailyTarget.calorieMax, issues, strengths);
    evaluateNutrientRange("protein", dailyTotals.totals.protein, dailyTarget.proteinMin, dailyTarget.proteinMax, issues, strengths);
    evaluateNutrientRange("carbohydrates", dailyTotals.totals.carbohydrates, dailyTarget.carbohydrateMin, dailyTarget.carbohydrateMax, issues, strengths);
    evaluateNutrientRange("fat", dailyTotals.totals.fat, dailyTarget.fatMin, dailyTarget.fatMax, issues, strengths);
    evaluateDailyFoodGroups(dayPlan, issues, strengths, context);
    return { reasonablyBalanced: issues.length <= 2, issues: Array.from(new Set(issues)), strengths: Array.from(new Set(strengths)) };
  }

  function evaluateGeneralFoodVariety(dayPlan, context) {
    const issues = [];
    const strengths = [];
    evaluateDailyFoodGroups(dayPlan, issues, strengths, context);
    return { reasonablyBalanced: issues.length <= 2, issues: Array.from(new Set(issues)), strengths: Array.from(new Set(strengths)) };
  }

  function evaluateNutrientRange(name, value, minimum, maximum, issues, strengths) {
    const status = classifyFlexibleDailyRange(value, minimum, maximum);
    if (status === "reasonable") strengths.push(`${name}-reasonable-range`);
    else if (status === "below") issues.push(`${name}-below-flexible-range`);
    else if (status === "above") issues.push(`${name}-above-flexible-range`);
  }

  function classifyFlexibleDailyRange(value, minimum, maximum) {
    if (!Number.isFinite(value) || !Number.isFinite(minimum) || !Number.isFinite(maximum)) return "unknown";
    if (value >= minimum * 0.85 && value <= maximum * 1.15) return "reasonable";
    return value < minimum * 0.85 ? "below" : "above";
  }

  function evaluateDailyFoodGroups(dayPlan, issues, strengths, context) {
    const groups = identifyDayFoodGroups(dayPlan, context);
    if (groups.proteinSources.size === 0) issues.push("missing-protein-source");
    else strengths.push("protein-source");
    if (groups.carbohydrateSources.size === 0) issues.push("missing-carbohydrate-source");
    else strengths.push("carbohydrate-source");
    if (groups.produceGroups.size === 0) issues.push("limited-produce");
    else strengths.push("produce-included");
    if (groups.fatSources.size === 0) issues.push("limited-fat-source");
    else strengths.push("fat-source");
    if (groups.recipeIds.size >= 3) strengths.push("recipe-variety");
  }

  function identifyDayFoodGroups(dayPlan, context) {
    const groups = { proteinSources: new Set(), carbohydrateSources: new Set(), produceGroups: new Set(), fatSources: new Set(), recipeIds: new Set() };
    Object.values(dayPlan || {}).map(normalizeMealPlanEntry).filter((meal) => meal?.recipeId).forEach((meal) => {
      const recipe = context.recipeLookup.get(meal.recipeId) || findRecipeById(meal.recipeId);
      if (!recipe) return;
      groups.recipeIds.add(recipe.id);
      groups.proteinSources.add(getRecipePrimaryProteinGroup(recipe));
      const carb = getRecipeCarbohydrateGroup(recipe);
      if (carb) groups.carbohydrateSources.add(carb);
      getRecipeProduceGroups(recipe).forEach((group) => groups.produceGroups.add(group));
      if (hasReliableFatSource(recipe) || Number(getRecipeNutritionForServings(recipe, 1).fat) > 0) groups.fatSources.add("fat source");
    });
    return groups;
  }

  function getRecipeCarbohydrateGroup(recipe) {
    const ingredients = normalizeIngredientList(recipe?.ingredients || []).map((ingredient) => normalizeIngredient(ingredient.name));
    const has = (terms) => ingredients.some((ingredient) => terms.some((term) => ingredient.includes(term)));
    if (has(["rice"])) return "rice";
    if (has(["oat", "granola"])) return "oats";
    if (has(["pasta", "noodle", "spaghetti"])) return "pasta or noodles";
    if (has(["bread", "wrap", "tortilla", "bun"])) return "bread or wraps";
    if (has(["potato", "sweet potato"])) return "potatoes";
    if (has(["quinoa"])) return "quinoa";
    if (has(["corn"])) return "corn";
    if (has(["bean", "lentil", "chickpea"])) return "legumes";
    if (has(["banana", "apple", "berry", "berries", "mango", "fruit"])) return "fruit";
    if (has(["flour", "cereal"])) return "other grains";
    return null;
  }

  function getRecipeProduceGroups(recipe) {
    const ingredients = normalizeIngredientList(recipe?.ingredients || []).map((ingredient) => normalizeIngredient(ingredient.name));
    const groups = new Set();
    const addIf = (terms, group) => { if (ingredients.some((ingredient) => terms.some((term) => ingredient.includes(term)))) groups.add(group); };
    addIf(["spinach", "lettuce", "romaine", "kale"], "leafy greens");
    addIf(["broccoli", "cauliflower", "cabbage"], "cruciferous vegetables");
    addIf(["carrot", "tomato", "bell pepper", "sweet potato"], "red or orange vegetables");
    addIf(["bean", "lentil", "chickpea", "pea"], "legumes");
    addIf(["berry", "berries", "strawberry", "blueberry"], "berries");
    addIf(["lemon", "lime", "orange"], "citrus");
    addIf(["banana", "apple", "mango", "fruit"], "other fruit");
    addIf(["vegetable", "onion", "mushroom", "cucumber", "celery", "green bean"], "mixed vegetables");
    return Array.from(groups);
  }

  function hasReliableFatSource(recipe) {
    return hasUnsaturatedFatSource(recipe) || normalizeIngredientList(recipe?.ingredients || []).some((ingredient) => ["butter", "cheese", "cream", "yogurt", "egg"].some((term) => normalizeIngredient(ingredient.name).includes(term)));
  }

  function wasRecipeUsedPreviousDay(recipe, slotContext) {
    return (slotContext.previousDayMeals || []).some((meal) => meal.recipeId === recipe.id);
  }

  function wasProteinGroupOverused(proteinGroup, generationState) {
    return (generationState.primaryProteinCounts.get(proteinGroup) || 0) >= 5;
  }

  function wasCarbohydrateGroupOverused(carbohydrateGroup, generationState) {
    return (generationState.carbohydrateGroupCounts.get(carbohydrateGroup) || 0) >= 5;
  }

  function improveGeneratedMealPlan(workingPlan, groupedRecipes, context, generationState) {
    for (let pass = 0; pass < 3; pass += 1) {
      let changed = false;
      for (const day of getMealPlanDays()) {
        const dailyTotals = calculateGeneratedDayTotals(workingPlan[day], context.recipeLookup);
        const evaluation = evaluateGeneratedDayBalance(dailyTotals, context.dailyTarget, workingPlan[day], context);
        if (evaluation.reasonablyBalanced) continue;
        const replacement = findBestMealReplacement(workingPlan, day, evaluation, groupedRecipes, generationState, context);
        if (replacement) {
          applyMealReplacement(workingPlan, replacement, generationState, context);
          changed = true;
        }
      }
      if (!changed) break;
    }
    return workingPlan;
  }

  function findBestMealReplacement(workingPlan, day, evaluation, groupedRecipes, generationState, context) {
    const replaceable = MEALS.map((mealType) => {
      const entry = normalizeMealPlanEntry((workingPlan[day] || {})[mealType]);
      if (!entry?.recipeId || (workingPlan[day] || {})[mealType]?.source !== "suggested") return null;
      const recipe = context.recipeLookup.get(entry.recipeId) || findRecipeById(entry.recipeId);
      const slotContext = buildMealSlotContext(workingPlan, day, mealType.toLowerCase(), generationState, context);
      const score = recipe ? scoreRecipeForPersonalizedMealPlan(recipe, slotContext, generationState, context) : { total: 0 };
      return { day, mealType, entry, recipe, score: score.total, slotContext };
    }).filter(Boolean).sort((a, b) => a.score - b.score);
    for (const current of replaceable) {
      const candidates = (groupedRecipes[normalizeIngredient(current.mealType)] || []).filter((recipe) => recipe.id !== current.recipe?.id);
      const ranked = rankRecipesForMealSlot(candidates, current.slotContext, generationState, context);
      const better = ranked.find((candidate) => candidate.score.total >= current.score + MINIMUM_REPLACEMENT_SCORE_IMPROVEMENT || resolvesMajorMealPlanIssue(candidate.recipe, evaluation));
      if (better) return { ...current, newRecipe: better.recipe, newScore: better.score };
    }
    return null;
  }

  function resolvesMajorMealPlanIssue(recipe, evaluation) {
    const issues = new Set(evaluation?.issues || []);
    if (issues.has("missing-protein-source") && getRecipePrimaryProteinGroup(recipe)) return true;
    if (issues.has("limited-produce") && hasMeaningfulProduce(recipe)) return true;
    if (issues.has("missing-carbohydrate-source") && getRecipeCarbohydrateGroup(recipe)) return true;
    return false;
  }

  function applyMealReplacement(workingPlan, replacement, generationState, context) {
    if (!replacement?.newRecipe) return;
    addRecipeToWorkingPlan(workingPlan, replacement.day, replacement.mealType, replacement.newRecipe, replacement.entry.servings || 1, replacement.newScore);
    rebuildGenerationStateFromPlan(workingPlan, generationState, context);
  }

  function rebuildGenerationStateFromPlan(plan, generationState, context) {
    const rebuilt = createMealPlanGenerationState({});
    getAllMealsFromPlan(plan).forEach((meal) => {
      const recipe = meal.entry?.recipeId ? context.recipeLookup.get(meal.entry.recipeId) || findRecipeById(meal.entry.recipeId) : null;
      if (recipe) registerSelectedRecipe(recipe, meal.day, normalizeIngredient(meal.mealType), rebuilt, context);
    });
    generationState.recipeUseCounts = rebuilt.recipeUseCounts;
    generationState.primaryProteinCounts = rebuilt.primaryProteinCounts;
    generationState.carbohydrateGroupCounts = rebuilt.carbohydrateGroupCounts;
    generationState.produceGroupCounts = rebuilt.produceGroupCounts;
    generationState.selectedRecipeIdsByDay = rebuilt.selectedRecipeIdsByDay;
  }

  function validateGeneratedMealPlanSafety(plan, context) {
    const issues = [];
    for (const meal of getAllMealsFromPlan(plan)) {
      if (!meal.entry?.recipeId) continue;
      const recipe = context.recipeLookup.get(meal.entry.recipeId) || findRecipeById(meal.entry.recipeId);
      if (!recipe) {
        issues.push("missing-recipe");
        continue;
      }
      if (!isRecipeSafeForUser(recipe, context.userProfile)) issues.push("allergy-conflict");
      if (!matchesDietaryPreferences(recipe, context.userProfile)) issues.push("dietary-conflict");
      if (matchesUserAvoidedFood(recipe, context.mealPlanPreferences?.foodsToAvoid)) issues.push("avoided-food");
    }
    return { valid: issues.length === 0, issues };
  }

  function getAllMealsFromPlan(plan) {
    return DAYS.flatMap((day) => MEALS.map((mealType) => ({ day, mealType, entry: normalizeMealPlanEntry((plan || {})[day]?.[mealType]), rawEntry: (plan || {})[day]?.[mealType] }))).filter((meal) => meal.entry);
  }

  function buildGeneratedDailySummary(day, dayPlan, context) {
    const totals = calculateGeneratedDayTotals(dayPlan, context.recipeLookup);
    const balance = evaluateGeneratedDayBalance(totals, context.dailyTarget, dayPlan, context);
    return {
      day,
      plannedMeals: totals.totalMeals,
      mealsWithNutritionData: totals.mealsWithNutritionData,
      nutritionDataCoverage: totals.totalMeals > 0 ? Math.round((totals.mealsWithNutritionData / totals.totalMeals) * 100) : 0,
      totals: totals.totals,
      balance,
      estimateOnly: true
    };
  }

  function buildGeneratedWeeklySummary(plan, dailySummaries, context, generationState) {
    const generationNotes = [...generationState.generationNotes];
    if (Array.from(generationState.recipeUseCounts.values()).some((count) => count > DEFAULT_MAX_RECIPE_USES_PER_WEEK)) generationNotes.push("Some recipes repeat because compatible choices were limited.");
    if (calculatePlanNutritionCoverage(dailySummaries).percentage < 100) generationNotes.push("Some planned meals do not include complete nutrition information.");
    if (identifyUnmatchedMealPlanPreferences(plan, context).length) generationNotes.push("Some preferred foods could not be included.");
    return {
      plannedMeals: countPlannedMeals(plan),
      uniqueRecipes: countUniqueRecipes(plan),
      proteinGroups: Array.from(generationState.primaryProteinCounts.keys()).filter(Boolean),
      carbohydrateGroups: Array.from(generationState.carbohydrateGroupCounts.keys()).filter(Boolean),
      produceGroups: Array.from(generationState.produceGroupCounts.keys()).filter(Boolean),
      nutritionDataCoverage: calculatePlanNutritionCoverage(dailySummaries),
      generationNotes: Array.from(new Set(generationNotes)),
      estimateOnly: true
    };
  }

  function calculatePlanNutritionCoverage(dailySummaries) {
    const totalPlannedMeals = Object.values(dailySummaries || {}).reduce((sum, day) => sum + (day.plannedMeals || 0), 0);
    const mealsWithNutritionData = Object.values(dailySummaries || {}).reduce((sum, day) => sum + (day.mealsWithNutritionData || 0), 0);
    return { mealsWithNutritionData, totalPlannedMeals, percentage: totalPlannedMeals ? Math.round((mealsWithNutritionData / totalPlannedMeals) * 100) : 0 };
  }

  function countPlannedMeals(plan) {
    return getAllMealsFromPlan(plan).length;
  }

  function countUniqueRecipes(plan) {
    return new Set(getAllMealsFromPlan(plan).map((meal) => meal.entry?.recipeId).filter(Boolean)).size;
  }

  function identifyUnmatchedMealPlanPreferences(plan, context) {
    const notes = [];
    const preferences = context.mealPlanPreferences || {};
    const recipeIds = getRecipeIdsFromMealPlan(plan);
    const recipes = recipeIds.map((id) => context.recipeLookup.get(id) || findRecipeById(id)).filter(Boolean);
    const terms = (preferences.preferredFoods || []).map(normalizeIngredient).filter(Boolean);
    const includedTerms = new Set();
    recipes.forEach((recipe) => {
      const recipeTerms = [recipe.name, recipe.subcategory, ...(recipe.keywords || []), ...normalizeIngredientList(recipe.ingredients).map((item) => item.name)].map(normalizeIngredient);
      terms.forEach((term) => { if (recipeTerms.some((recipeTerm) => recipeTerm === term || recipeTerm.includes(term))) includedTerms.add(term); });
    });
    terms.filter((term) => !includedTerms.has(term)).forEach((term) => notes.push(term));
    return notes;
  }

  function applyGeneratedMealPlan(generatedResult) {
    if (!generatedResult?.success || !generatedResult?.plan) {
      showToast("The suggested plan could not be applied.", "error");
      return false;
    }
    state.mealPlans = normalizeMealPlan(generatedResult.plan);
    saveMealPlan();
    displayMealPlanner();
    updateWeeklyNutritionSummary({ showNotification: true });
    showToast(state.guestMode ? `Suggested meal plan applied for this session. ${GUEST_TEMPORARY_MESSAGE}` : "Suggested meal plan applied", state.guestMode ? "info" : "success", state.guestMode ? {} : { saveToHistory: true, actionName: "View Meal Planner", actionTarget: "planner" });
    return true;
  }

  function getRecipeIdsFromMealPlan(plan) {
    return DAYS.flatMap((day) => MEALS.map((meal) => normalizeMealPlanEntry((plan || {})[day]?.[meal])?.recipeId).filter(Boolean));
  }

  function getRecipePrimaryProteinGroup(recipe) {
    const ingredients = normalizeIngredientList(recipe?.ingredients || []).map((ingredient) => normalizeIngredient(ingredient.name));
    const has = (terms) => ingredients.some((ingredient) => terms.some((term) => ingredient.includes(term)));
    if (has(["chicken", "turkey"])) return "poultry";
    if (has(["salmon", "shrimp", "fish", "tuna"])) return "fish";
    if (has(["egg"])) return "eggs";
    if (has(["milk", "cheddar", "parmesan", "yogurt", "mozzarella", "cream"])) return "dairy";
    if (has(["lentils", "chickpeas", "black beans", "beans"])) return "beans and lentils";
    if (has(["tofu", "soy"])) return "tofu and soy foods";
    if (has(["peanut", "nuts", "seeds", "chia", "tahini"])) return "nuts and seeds";
    if (has(["beef"])) return "beef";
    if (has(["pork", "ham", "bacon"])) return "pork";
    return "other plant proteins";
  }

  function hasUnsaturatedFatSource(recipe) {
    const ingredients = normalizeIngredientList(recipe?.ingredients || []).map((ingredient) => normalizeIngredient(ingredient.name));
    return ingredients.some((ingredient) => ["nuts", "seeds", "chia seeds", "sesame seeds", "avocado", "olive oil", "canola oil", "salmon", "tahini"].some((term) => ingredient.includes(term)));
  }

  function buildGeneratedMealPlanSummary(plan, context, generationState) {
    const summary = getWeeklyNutritionSummary(plan);
    const proteinGroups = new Set(getRecipeIdsFromMealPlan(plan).map((id) => getRecipePrimaryProteinGroup(findRecipeById(id))).filter(Boolean));
    const preferences = context.preferredMeals || {};
    const longerThanPreferred = preferences.maximumCookingMinutes ? getRecipeIdsFromMealPlan(plan).map(findRecipeById).filter((recipe) => recipe && getRecipeTotalMinutes(recipe) > preferences.maximumCookingMinutes).length : 0;
    return { nutrition: summary, proteinGroupCount: proteinGroups.size, longerThanPreferred, repeatedRecipes: Array.from(generationState.recipeUseCounts.values()).some((count) => count > DEFAULT_MAX_RECIPE_USES_PER_WEEK) };
  }

  function renderGeneratedMealPlanPreview(result, mode) {
    const context = buildMealPlanGenerationContext();
    const summary = result.summary || buildGeneratedMealPlanSummary(result.plan, context, createMealPlanGenerationState(result.plan));
    const target = getCurrentDailyNutritionTarget(getCurrentNutritionProfile());
    const nutrition = summary.nutrition;
    const coverage = calculateNutritionDataCoverage(nutrition.mealsWithNutrition, nutrition.plannedMeals);
    const statusMessages = ["Suggested plan created"];
    if (!target) statusMessages.push("Personalized nutrition-range matching is unavailable. This plan uses general meal variety and your saved preferences.");
    if (nutrition.mealsWithoutNutrition) statusMessages.push("Some nutrition information is unavailable");
    if (summary.longerThanPreferred) statusMessages.push("Some suggestions exceed your preferred cooking time because there were not enough compatible recipes.");
    if (summary.repeatedRecipes) statusMessages.push("Some recipes repeat because the eligible recipe selection is limited.");
    (result.generationNotes || []).forEach((note) => statusMessages.push(note));
    if (matchesUserAvoidedFoodInPlan(result.plan, context.preferredMeals?.foodsToAvoid)) statusMessages.push("Recipes containing foods you chose to avoid were not included.");
    const minorNote = context.ageSafetyStatus === "minor" ? `<p class="meal-generation-note">For users under 18, suggested meal plans focus on regular balanced meals, food variety, and activity support rather than calorie restriction.</p>` : "";
    return `<div class="meal-generation-heading">
      <span class="eyebrow">SUGGESTED MEAL PLAN PREVIEW</span>
      <h2 id="mealPlanGenerationTitle">Suggested Meal Plan Preview</h2>
      <p>Review the plan before applying it. Generated meal plans remain editable after they are saved.</p>
    </div>
    <div class="meal-generation-status" role="status" aria-live="polite">${statusMessages.map((message) => `<p>${escapeHtml(message)}</p>`).join("")}</div>
    <section class="generated-plan-summary" aria-label="Suggested plan summary">
      <h3>This suggested plan aims to include:</h3>
      <ul><li>Multiple protein sources</li><li>Vegetables and fruit</li><li>Different carbohydrate sources</li><li>Sources of unsaturated fats</li><li>Recipe variety</li><li>Meals matching your cooking-time preference</li></ul>
      <p>This plan is based on recipes and information available in Chef Nova. It may not include snacks, drinks, restaurant meals, ingredient substitutions, or portion changes.</p>
      <p>Suggested meal plans are general planning tools and are not medical advice or precise nutrition prescriptions.</p>
      ${minorNote}
    </section>
    ${renderGeneratedNutritionSummary(nutrition, target, coverage)}
    <div class="generated-plan-grid">${DAYS.map((day) => renderGeneratedDayPreview(day, result.plan[day] || {}, context)).join("")}</div>
    <div class="meal-generation-actions">
      <button class="button primary" type="button" data-apply-generated-plan>Apply Suggested Plan</button>
      <button class="button secondary" type="button" data-regenerate-meal-plan>Regenerate Suggestions</button>
      <button class="button secondary" type="button" data-cancel-generated-plan>Cancel</button>
    </div>`;
  }

  function renderGeneratedNutritionSummary(summary, target, coverage) {
    const averages = {
      calories: summary.averageCaloriesPerDay,
      protein: summary.averageProteinPerDay,
      carbohydrates: summary.averageCarbohydratesPerDay,
      fat: summary.averageFatPerDay,
      vegetableServings: summary.averageVegetableServingsPerDay
    };
    const targetText = target ? `<p>Estimated daily ranges: ${target.calorieMin.toLocaleString()}-${target.calorieMax.toLocaleString()} calories, ${target.proteinMin}-${target.proteinMax} g protein, ${target.carbohydrateMin}-${target.carbohydrateMax} g carbohydrates, ${target.fatMin}-${target.fatMax} g fat.</p>` : "";
    return `<section class="generated-nutrition-summary" aria-label="Estimated planned daily averages">
      <h3>Estimated Planned Daily Averages</h3>
      <div class="generated-nutrition-grid">
        <span><b>Calories</b>${formatNutritionNumber(averages.calories, 0)}</span>
        <span><b>Protein</b>${formatNutritionNumber(averages.protein)} g</span>
        <span><b>Carbohydrates</b>${formatNutritionNumber(averages.carbohydrates)} g</span>
        <span><b>Fat</b>${formatNutritionNumber(averages.fat)} g</span>
        <span><b>Vegetable servings</b>${formatNutritionNumber(averages.vegetableServings)}</span>
        <span><b>Coverage</b>${coverage.available ? `${coverage.percentage}%` : "Not available"}</span>
      </div>
      ${targetText}
    </section>`;
  }

  function renderGeneratedDayPreview(day, dayPlan, context) {
    return `<article class="generated-day-card"><h3>${escapeHtml(day)}</h3>${MEALS.map((mealType) => renderGeneratedMealPreview(day, mealType, dayPlan[mealType], context)).join("")}</article>`;
  }

  function renderGeneratedMealPreview(day, mealType, entry, context) {
    const meal = normalizeMealPlanEntry(entry);
    if (!meal) return `<div class="generated-meal-row"><b>${escapeHtml(mealType)}</b><p>No meal planned</p></div>`;
    const recipe = meal.recipeId ? findRecipeById(meal.recipeId) : null;
    const pantry = recipe ? calculatePantryMatch(recipe, context.pantryItems) : null;
    const tags = recipe ? getRecipeCardNutritionTags(recipe, []).slice(0, 3) : [];
    const reasons = Array.isArray(entry?.suggestionReasons) ? entry.suggestionReasons : recipe ? buildRecipeMatchReasons(recipe, { ...context, goal: context.goalType }, []) : [];
    const minutes = recipe ? getRecipeTotalMinutes(recipe) : null;
    return `<div class="generated-meal-row">
      <b>${escapeHtml(mealType)}</b>
      <h4>${escapeHtml(meal.recipeName)}</h4>
      <p>${recipe ? (Number.isFinite(minutes) ? `${escapeHtml(String(minutes))} minutes` : "Cooking time unavailable") : "Custom meal"}</p>
      ${tags.length ? `<div class="recipe-nutrition-tags">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      ${pantry?.available ? `<p>Pantry match: ${pantry.percentage}%</p>` : ""}
      ${reasons.length ? `<ul>${reasons.slice(0, 3).map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>` : ""}
    </div>`;
  }

  function matchesUserAvoidedFoodInPlan(plan, foodsToAvoid = []) {
    return getRecipeIdsFromMealPlan(plan).map(findRecipeById).some((recipe) => recipe && matchesUserAvoidedFood(recipe, foodsToAvoid));
  }

  function addGeneratedPlanMissingIngredientsToShoppingList() {
    const plan = pendingGeneratedMealPlan?.plan || state.mealPlans;
    const context = buildMealPlanGenerationContext();
    const pantryNames = context.pantryItems.map((item) => normalizeIngredient(item.name));
    const avoid = context.preferredMeals?.foodsToAvoid || [];
    const existing = getShoppingListItems();
    const additions = [];
    getRecipeIdsFromMealPlan(plan).map(findRecipeById).filter(Boolean).forEach((recipe) => {
      if (!isRecipeSafeForUser(recipe, context.userProfile) || matchesUserAvoidedFood(recipe, avoid)) return;
      normalizeIngredientList(recipe.ingredients).forEach((ingredient) => {
        const normalized = normalizeIngredient(ingredient.name);
        if (pantryNames.some((name) => ingredientsMatch(name, ingredient.name))) return;
        if (existing.some((item) => normalizeIngredient(item.name) === normalized) || additions.some((item) => normalizeIngredient(item.name) === normalized)) return;
        additions.push({ id: "s" + Date.now() + "-" + normalized, name: ingredient.name, quantity: ingredient.quantity || 1, unit: ingredient.unit || "", recipeId: recipe.id, checked: false });
      });
    });
    if (!additions.length) return showToast("No new missing ingredients to add", "info");
    saveShoppingListItems([...existing, ...additions]);
    displayShoppingList();
    showToast(state.guestMode ? `Missing ingredients added for this session. ${GUEST_TEMPORARY_MESSAGE}` : "Missing ingredients added to shopping list", state.guestMode ? "info" : "success", state.guestMode ? {} : { saveToHistory: true, actionName: "View Shopping List", actionTarget: "shopping-list" });
  }

  function displayMealPlanner() {
    updateMealPlannerControls();
    renderMealPlanPreferences();
    const plannedCount = DAYS.reduce((count, day) => count + MEALS.filter((mealType) => normalizeMealPlanEntry((state.mealPlans[day] || {})[mealType])).length, 0);
    const notice = state.guestMode ? guestNotice("Temporary Guest Meal Plan", GUEST_TEMPORARY_MESSAGE) : "";
    $("#mealPlanner").innerHTML = `${notice}<div class="planner-summary"><span>Weekly Plan Progress</span><strong>${plannedCount} / ${DAYS.length * MEALS.length} meals planned</strong></div>${renderAppliedGeneratedPlanActions()}${renderWorkoutSupportingSuggestions()}${renderDayTabs()}<div class="active-day-panel">${displayActiveMealDay()}</div>`;
  }

  function renderAppliedGeneratedPlanActions() {
    const hasSuggestedMeals = DAYS.some((day) => MEALS.some((meal) => (state.mealPlans[day] || {})[meal]?.source === "suggested"));
    if (!hasSuggestedMeals) return "";
    return `<section class="generated-plan-applied-actions"><p>This suggested plan has been applied. You can still edit every meal and serving.</p><div><button class="button secondary small" type="button" data-generated-shopping-list>Add Missing Ingredients to Shopping List</button><button class="button secondary small" type="button" data-meal-generation-mode="${MEAL_PLAN_GENERATION_MODES.REPLACE_ALL}">Regenerate Suggestions</button></div></section>`;
  }

  function renderWorkoutSupportingSuggestions() {
    const profile = getCurrentNutritionProfile();
    const suggestions = getWorkoutMealSuggestions(profile);
    if (!suggestions.length) return "";
    const tags = getWorkoutRecommendationTags(profile);
    const guidance = shouldShowWorkoutProfessionalGuidance(profile) ? `<p class="workout-guidance-note">People who participate regularly in intense activity may benefit from speaking with a registered dietitian for individualized nutrition recommendations.</p>` : "";
    const minorNote = profile?.ageSafetyStatus === "minor" ? `<p class="workout-guidance-note">Because your body may still be growing, Chef Nova focuses on regular balanced meals and activity support rather than restrictive calorie targets.</p>` : "";
    return `<section class="workout-suggestions-panel" aria-labelledby="workoutSuggestionsTitle">
      <div><span class="eyebrow">WORKOUT SUPPORT</span><h2 id="workoutSuggestionsTitle">Workout-Supporting Suggestions</h2><p>General meal ideas based on your optional workout profile.</p></div>
      <ul>${suggestions.slice(0, 4).map((suggestion) => `<li>${escapeHtml(suggestion)}</li>`).join("")}</ul>
      ${tags.length ? `<div class="workout-tag-row">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      ${minorNote}${guidance}
    </section>`;
  }

  function getWorkoutMealSuggestions(profile) {
    if (profile?.goal !== "support-workouts") return [];
    const workout = normalizeWorkoutProfile(profile.workoutProfile);
    if (!workout) return ["Choose balanced meals with carbohydrates, protein, vegetables or fruit, and unsaturated fats."];
    const suggestions = [];
    switch (workout.trainingFocus) {
      case "strength-training":
        suggestions.push("Include a protein source across meals and snacks.");
        suggestions.push("Include carbohydrates to support training energy and recovery.");
        break;
      case "endurance":
        suggestions.push("Include carbohydrate-rich foods before and after longer training sessions.");
        suggestions.push("Drink water regularly and include meals or snacks after longer activity.");
        break;
      case "team-sport":
        suggestions.push("Include carbohydrates before practices or games to support activity.");
        suggestions.push("After activity, include a meal or snack with carbohydrates and a protein source.");
        suggestions.push("Drink water regularly during active days.");
        break;
      case "mixed-training":
        suggestions.push("Choose meals that combine carbohydrates, protein, vegetables or fruit, and unsaturated fats.");
        suggestions.push("Vary meal and snack suggestions based on the type and length of the day's activity.");
        break;
      case "general-fitness":
      default:
        suggestions.push("Choose balanced meals with carbohydrates, protein, vegetables, and healthy fats.");
        break;
    }
    if (Number.isInteger(workout.workoutDaysPerWeek)) {
      if (workout.workoutDaysPerWeek <= 2) suggestions.push("Use general balanced-meal suggestions.");
      else if (workout.workoutDaysPerWeek <= 4) suggestions.push("Include regular meal and snack planning around active days.");
      else suggestions.push("Emphasize consistent meals, carbohydrates for activity, protein sources, variety, and regular hydration.");
    }
    if (workout.typicalWorkoutLength === "90-minutes-or-longer") suggestions.push("Longer activity sessions may require additional meals, snacks, fluids, or individualized advice depending on the activity and conditions.");
    if (profile.ageSafetyStatus === "unknown") suggestions.push("Age is optional, so Chef Nova keeps workout suggestions general.");
    return suggestions;
  }

  function shouldShowWorkoutProfessionalGuidance(profile) {
    const workout = normalizeWorkoutProfile(profile?.workoutProfile);
    if (profile?.goal !== "support-workouts" || !workout) return false;
    return workout.trainingFocus === "endurance" || workout.typicalWorkoutLength === "90-minutes-or-longer" || (Number.isInteger(workout.workoutDaysPerWeek) && workout.workoutDaysPerWeek >= 5);
  }

  function getWorkoutRecommendationTags(profile) {
    const workout = normalizeWorkoutProfile(profile?.workoutProfile);
    if (profile?.goal !== "support-workouts") return [];
    const tags = ["Workout-supporting", "Balanced meal"];
    if (workout?.trainingFocus === "strength-training") tags.push("Protein source");
    if (workout?.trainingFocus === "endurance" || workout?.trainingFocus === "team-sport") tags.push("Carbohydrate source", "Post-activity option");
    if (workout?.workoutDaysPerWeek >= 3) tags.push("Active-day snack");
    return Array.from(new Set(tags));
  }

  function updateMealPlannerControls() {
    const saveButton = $("#saveWeeklyPlanButton");
    if (!saveButton) return;
    saveButton.textContent = state.guestMode ? "Save for This Session" : "Save Weekly Plan";
    saveButton.title = state.guestMode ? GUEST_TEMPORARY_MESSAGE : "";
    saveButton.setAttribute("aria-label", state.guestMode ? "Save guest meal plan for this session" : "Save weekly meal plan");
  }

  function setActiveMealDay(day) {
    if (!DAYS.includes(day)) return;
    state.activeMealDay = day;
    displayMealPlanner();
  }

  function renderDayTabs() {
    return `<div class="day-tabs" role="tablist" aria-label="Meal planner days">${DAYS.map((day) => `<button class="day-tab ${day === state.activeMealDay ? "active" : ""}" type="button" role="tab" aria-selected="${day === state.activeMealDay}" data-meal-day="${day}">${day}</button>`).join("")}</div>`;
  }

  function displayActiveMealDay() {
    const day = DAYS.includes(state.activeMealDay) ? state.activeMealDay : "Monday";
    return `<article class="day-card active-day-card">
      <div class="day-card-header"><span class="day-orbit">✦</span><h2>${day}</h2></div>
      <div class="meal-slot-list">${MEALS.map((mealType) => mealSlot(day, mealType)).join("")}</div>
    </article>`;
  }

  function mealSlot(day, mealType) {
    const currentMeal = normalizeMealPlanEntry((state.mealPlans[day] || {})[mealType]);
    const mealName = currentMeal ? currentMeal.recipeName : "";
    const servings = currentMeal ? currentMeal.servings : 1;
    const fieldId = `meal-${day}-${mealType}`.replace(/\s+/g, "-").toLowerCase();
    const listId = `${fieldId}-suggestions`;
    return `<section class="meal-slot" data-day="${day}" data-meal="${mealType}">
      <h3>${mealType}</h3>
      <p class="${currentMeal ? "planned-meal" : "empty-meal"}">${currentMeal ? `Planned: ${escapeHtml(mealName)} — ${servings} ${servings === 1 ? "serving" : "servings"}` : "No meal planned"}</p>
      <div class="meal-combobox" data-meal-combobox="${day}-${mealType}">
        <label for="${fieldId}">Meal</label>
        <input id="${fieldId}" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${listId}" aria-label="${day} ${mealType} meal" data-meal-input="${day}-${mealType}" data-selected-recipe-id="${escapeHtml(currentMeal && currentMeal.recipeId ? currentMeal.recipeId : "")}" value="${escapeHtml(mealName)}" placeholder="Select a recipe or type a custom meal" autocomplete="off">
        <div class="meal-suggestion-list hidden" id="${listId}" role="listbox" data-meal-suggestions="${day}-${mealType}"></div>
      </div>
      <label class="meal-servings-label">Servings<input type="number" min="1" step="1" value="${escapeHtml(servings)}" data-meal-servings="${day}-${mealType}" aria-label="${day} ${mealType} servings"></label>
      <div class="meal-actions">
        <button class="button primary small" data-meal-action="add" data-day="${day}" data-meal="${mealType}">${state.guestMode ? "Save for This Session" : "Save"}</button>
        <button class="button secondary small delete-meal-button" data-meal-action="delete" data-day="${day}" data-meal="${mealType}">Delete</button>
      </div>
    </section>`;
  }

  function addMeal(day, mealType) {
    if (!DAYS.includes(day)) {
      showToast("Missing day", "error");
      return;
    }
    if (!MEALS.includes(mealType)) {
      showToast("Missing meal type", "error");
      return;
    }
    const input = $(`[data-meal-input="${day}-${mealType}"]`);
    const servingsInput = $(`[data-meal-servings="${day}-${mealType}"]`);
    const chosenMeal = input ? input.value.trim() : "";
    if (!chosenMeal) return showToast("Please select a recipe or enter a custom meal", "error");
    const servings = Number(servingsInput ? servingsInput.value : 1);
    if (!Number.isInteger(servings) || servings < 1) return showToast("Please enter a valid number of servings", "error");
    const selectedRecipe = findRecipeById(input.dataset.selectedRecipeId);
    const recipe = selectedRecipe && normalizeIngredient(selectedRecipe.name) === normalizeIngredient(chosenMeal) ? selectedRecipe : findRecipeByName(chosenMeal);
    const entry = recipe ? createRecipeMealEntry(recipe, servings) : createCustomMealEntry(chosenMeal, servings);
    saveMealPlanEntry(day, mealType, entry);
  }

  function deleteMeal(day, mealType) {
    if (!DAYS.includes(day)) {
      showToast("Missing day", "error");
      return;
    }
    if (!MEALS.includes(mealType)) {
      showToast("Missing meal type", "error");
      return;
    }
    deleteMealPlanEntry(day, mealType);
  }

  function renderMealSuggestions(input) {
    const key = input.dataset.mealInput;
    const list = $(`[data-meal-suggestions="${key}"]`);
    if (!list) return;
    const options = getRecipeOptions(input.value);
    list.dataset.activeIndex = options.length ? "0" : "-1";
    input.setAttribute("aria-expanded", options.length ? "true" : "false");
    input.removeAttribute("aria-activedescendant");
    list.classList.toggle("hidden", !options.length);
    list.innerHTML = options.map((recipe, index) => mealSuggestionOption(key, recipe, index)).join("");
    updateMealSuggestionActive(list, input);
  }

  function mealSuggestionOption(key, recipe, index) {
    const optionId = `meal-option-${key}-${index}`.replace(/[^a-zA-Z0-9_-]/g, "-");
    return `<button class="meal-suggestion-option ${index === 0 ? "active" : ""}" id="${optionId}" type="button" role="option" aria-selected="${index === 0}" data-meal-suggestion="${key}" data-meal-value="${escapeHtml(recipe.name)}" data-meal-recipe-id="${escapeHtml(recipe.id)}">${escapeHtml(recipe.name)}</button>`;
  }

  function selectMealSuggestion(button) {
    const input = $(`[data-meal-input="${button.dataset.mealSuggestion}"]`);
    if (!input) return;
    input.value = button.dataset.mealValue || "";
    input.dataset.selectedRecipeId = button.dataset.mealRecipeId || "";
    closeMealSuggestions();
    input.focus();
  }

  function handleMealComboboxKeydown(event, input) {
    const list = $(`[data-meal-suggestions="${input.dataset.mealInput}"]`);
    if (!list || list.classList.contains("hidden")) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        renderMealSuggestions(input);
      }
      return;
    }
    const options = $$(".meal-suggestion-option", list);
    if (!options.length) return;
    let activeIndex = Number(list.dataset.activeIndex || 0);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeIndex = Math.min(options.length - 1, activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      activeIndex = Math.max(0, activeIndex - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      options[activeIndex].click();
      return;
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeMealSuggestions();
      return;
    } else {
      return;
    }
    list.dataset.activeIndex = String(activeIndex);
    updateMealSuggestionActive(list, input);
  }

  function updateMealSuggestionActive(list, input) {
    const activeIndex = Number(list.dataset.activeIndex || 0);
    $$(".meal-suggestion-option", list).forEach((option, index) => {
      const active = index === activeIndex;
      option.classList.toggle("active", active);
      option.setAttribute("aria-selected", String(active));
      if (active) input.setAttribute("aria-activedescendant", option.id);
    });
  }

  function closeMealSuggestions() {
    $$("[data-meal-suggestions]").forEach((list) => {
      list.classList.add("hidden");
      list.innerHTML = "";
      list.dataset.activeIndex = "-1";
    });
    $$("[data-meal-input]").forEach((input) => {
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
    });
  }

  function getRecipeOptions(query = "") {
    const normalizedQuery = normalizeIngredient(query);
    const recipesByName = new Map();
    state.recipes.forEach((recipe) => { if (recipe.name && !recipesByName.has(recipe.name)) recipesByName.set(recipe.name, recipe); });
    return Array.from(recipesByName.values())
      .filter((recipe) => !normalizedQuery || normalizeIngredient(recipe.name).includes(normalizedQuery))
      .filter((recipe) => !recipeContainsUserAllergy(recipe))
      .sort((a, b) => getWorkoutRecipePriority(b) - getWorkoutRecipePriority(a) || a.name.localeCompare(b.name))
      .slice(0, 8);
  }

  function getWorkoutRecipePriority(recipe) {
    const profile = getCurrentNutritionProfile();
    const workout = normalizeWorkoutProfile(profile?.workoutProfile);
    if (profile?.goal !== "support-workouts") return 0;
    // Workout details influence meal ideas only; energy estimates still use the Activity level multiplier once.
    const protein = Number(recipe?.protein) || 0;
    const carbohydrates = Number(recipe?.carbohydrates) || 0;
    const vegetables = Number(recipe?.vegetableServings) || 0;
    let score = 0;
    if (protein >= 20) score += 2;
    if (carbohydrates >= 30) score += 2;
    if (vegetables > 0) score += 1;
    if (workout?.trainingFocus === "strength-training" && protein >= 25) score += 3;
    if ((workout?.trainingFocus === "endurance" || workout?.trainingFocus === "team-sport") && carbohydrates >= 40) score += 3;
    if (workout?.trainingFocus === "mixed-training" && protein >= 15 && carbohydrates >= 25) score += 2;
    return score;
  }

  function normalizeMealPlan(plan) {
    return DAYS.reduce((weeklyPlan, day) => {
      weeklyPlan[day] = MEALS.reduce((dayPlan, mealType) => {
        dayPlan[mealType] = normalizeMealPlanEntry(((plan || {})[day] || {})[mealType]);
        return dayPlan;
      }, {});
      return weeklyPlan;
    }, {});
  }

  function normalizeMealPlanEntry(entry) {
    if (!entry) return null;
    if (typeof entry === "string") {
      const mealName = entry.trim();
      if (!mealName) return null;
      const recipe = findRecipeByName(mealName);
      return recipe ? createRecipeMealEntry(recipe, 1) : createCustomMealEntry(mealName, 1);
    }
    if (typeof entry !== "object") return null;
    const recipe = entry.recipeId ? findRecipeById(entry.recipeId) : findRecipeByName(entry.recipeName || entry.recipe || entry.customMeal || "");
    const mealName = String(entry.recipeName || entry.recipe || entry.customMeal || (recipe && recipe.name) || "").trim();
    if (!mealName && !recipe) return null;
    const servings = Math.max(1, parseInt(entry.servings, 10) || 1);
    if (recipe && normalizeIngredient(mealName || recipe.name) === normalizeIngredient(recipe.name)) return createRecipeMealEntry(recipe, servings);
    return createCustomMealEntry(mealName, servings, getManualMealNutrition(entry));
  }

  function findRecipeById(recipeId) {
    return state.recipes.find((recipe) => recipe.id === recipeId) || null;
  }

  function findRecipeByName(recipeName) {
    const normalized = normalizeIngredient(recipeName);
    return state.recipes.find((recipe) => normalizeIngredient(recipe.name) === normalized) || null;
  }

  function createRecipeMealEntry(recipe, servings) {
    return { recipeId: recipe.id, recipeName: recipe.name, servings, nutritionAvailable: true };
  }

  function getManualMealNutrition(entry) {
    const source = entry?.nutrition && typeof entry.nutrition === "object" ? entry.nutrition : entry;
    if (!source || typeof source !== "object") return null;
    const nutrition = {
      calories: Number(source.calories),
      protein: Number(source.protein),
      carbohydrates: Number(source.carbohydrates),
      fat: Number(source.fat),
      sugar: Number(source.sugar),
      vegetableServings: Number(source.vegetableServings)
    };
    return Object.values(nutrition).every((value) => Number.isFinite(value) && value >= 0) ? nutrition : null;
  }

  function createCustomMealEntry(recipeName, servings, nutrition = null) {
    const manualNutrition = getManualMealNutrition(nutrition);
    return manualNutrition
      ? { recipeId: null, recipeName: String(recipeName || "").trim(), servings, nutritionAvailable: true, ...manualNutrition }
      : { recipeId: null, recipeName: String(recipeName || "").trim(), servings, nutritionAvailable: false };
  }

  function saveMealPlanEntry(day, mealType, entry) {
    if (!entry || !entry.recipeName) return showToast("Unable to save meal plan", "error");
    state.mealPlans[day] = state.mealPlans[day] || {};
    state.mealPlans[day][mealType] = entry;
    saveMealPlan();
    displayMealPlanner();
    updateWeeklyNutritionSummary({ showNotification: true });
    if (state.guestMode) showToast(`Meal plan saved for this session. ${GUEST_TEMPORARY_MESSAGE}`, "info");
    else showToast("Meal plan updated", "success", { saveToHistory: true, actionName: "View Meal Planner", actionTarget: "planner" });
  }

  function deleteMealPlanEntry(day, mealType) {
    state.mealPlans[day] = state.mealPlans[day] || {};
    state.mealPlans[day][mealType] = null;
    saveMealPlan();
    displayMealPlanner();
    updateWeeklyNutritionSummary({ showNotification: true });
    if (state.guestMode) showToast(`Meal removed for this session. ${GUEST_TEMPORARY_MESSAGE}`, "info");
    else showToast("Meal removed", "success", { saveToHistory: true, actionName: "View Meal Planner", actionTarget: "planner" });
  }

  function getPlannedMeals() {
    const mealPlan = getSavedMealPlan();
    return DAYS.flatMap((day) => MEALS.map((mealType) => ({ day, mealType, entry: normalizeMealPlanEntry((mealPlan[day] || {})[mealType]) }))).filter((meal) => meal.entry);
  }

  function getSavedMealPlan() {
    if (state.guestMode) return normalizeMealPlan(state.mealPlans || guestSessionData.mealPlans || {});
    const savedPlan = readUserStorage(KEYS.plans, null);
    return normalizeMealPlan(savedPlan || state.mealPlans || {});
  }

  function isRecipeNutritionValid(recipe) {
    return ["calories", "protein", "carbohydrates", "fat", "sugar", "vegetableServings"].every((field) => typeof recipe?.[field] === "number" && Number.isFinite(recipe[field]) && recipe[field] >= 0);
  }

  function getRecipeNutrition(recipeId) {
    const recipe = findRecipeById(recipeId);
    return recipe && isRecipeNutritionValid(recipe) ? recipe : null;
  }

  function calculateMealNutrition(mealEntry) {
    const servings = normalizeSelectedServings(mealEntry.servings);
    if (!mealEntry.nutritionAvailable) return { hasNutrition: false, servings };
    if (!mealEntry.recipeId) {
      const manualNutrition = getManualMealNutrition(mealEntry);
      if (!manualNutrition) return { hasNutrition: false, servings };
      return {
        hasNutrition: true,
        servings,
        calories: manualNutrition.calories * servings,
        protein: manualNutrition.protein * servings,
        carbohydrates: manualNutrition.carbohydrates * servings,
        fat: manualNutrition.fat * servings,
        sugar: manualNutrition.sugar * servings,
        vegetableServings: manualNutrition.vegetableServings * servings
      };
    }
    const recipe = getRecipeNutrition(mealEntry.recipeId);
    if (!recipe) return { hasNutrition: false, servings };
    return {
      hasNutrition: true,
      servings,
      calories: recipe.calories * servings,
      protein: recipe.protein * servings,
      carbohydrates: recipe.carbohydrates * servings,
      fat: recipe.fat * servings,
      sugar: recipe.sugar * servings,
      vegetableServings: recipe.vegetableServings * servings
    };
  }

  function getWeeklyNutritionSummary(mealPlan = getSavedMealPlan()) {
    const summary = createEmptyWeeklyNutritionSummary();
    summary.days = getDailyNutritionBreakdown(mealPlan);
    DAYS.forEach((day) => {
      const daily = summary.days[day];
      summary.plannedMeals += daily.plannedMeals;
      summary.mealsWithNutrition += daily.mealsWithNutrition;
      summary.mealsWithoutNutrition += daily.mealsWithoutNutrition;
      summary.totalCalories += daily.calories;
      summary.totalProtein += daily.protein;
      summary.totalCarbohydrates += daily.carbohydrates;
      summary.totalFat += daily.fat;
      summary.totalVegetableServings += daily.vegetableServings;
      summary.totalSugar += daily.sugar;
    });
    summary.averageCaloriesPerDay = summary.totalCalories / DAYS.length;
    summary.averageProteinPerDay = summary.totalProtein / DAYS.length;
    summary.averageCarbohydratesPerDay = summary.totalCarbohydrates / DAYS.length;
    summary.averageFatPerDay = summary.totalFat / DAYS.length;
    summary.averageVegetableServingsPerDay = summary.totalVegetableServings / DAYS.length;
    summary.averageSugarPerDay = summary.totalSugar / DAYS.length;
    return summary;
  }

  function calculateWeeklyNutrition() {
    return getWeeklyNutritionSummary(getSavedMealPlan());
  }

  function createEmptyWeeklyNutritionSummary() {
    return {
      totalCalories: 0,
      averageCaloriesPerDay: 0,
      totalProtein: 0,
      averageProteinPerDay: 0,
      totalCarbohydrates: 0,
      averageCarbohydratesPerDay: 0,
      totalFat: 0,
      averageFatPerDay: 0,
      totalVegetableServings: 0,
      averageVegetableServingsPerDay: 0,
      totalSugar: 0,
      averageSugarPerDay: 0,
      mealsWithNutrition: 0,
      mealsWithoutNutrition: 0,
      plannedMeals: 0,
      days: DAYS.reduce((days, day) => {
        days[day] = { calories: 0, protein: 0, carbohydrates: 0, fat: 0, vegetableServings: 0, sugar: 0, mealsWithNutrition: 0, mealsWithoutNutrition: 0, plannedMeals: 0 };
        return days;
      }, {})
    };
  }

  function createEmptyDailyNutritionSummary() {
    return { calories: 0, protein: 0, carbohydrates: 0, fat: 0, vegetableServings: 0, sugar: 0, mealsWithNutrition: 0, mealsWithoutNutrition: 0, plannedMeals: 0 };
  }

  function calculateDailyNutrition(dayPlan = {}) {
    if (typeof dayPlan === "string") dayPlan = (getSavedMealPlan()[dayPlan] || {});
    const daily = createEmptyDailyNutritionSummary();
    MEALS.forEach((mealType) => {
      const rawEntry = dayPlan[mealType];
      const entry = normalizeMealPlanEntry(rawEntry);
      if (!entry) return;
      daily.plannedMeals += 1;
      if (!rawEntry || typeof rawEntry !== "object" || !rawEntry.recipeId) {
        daily.mealsWithoutNutrition += 1;
        return;
      }
      const nutrition = calculateMealNutrition(entry);
      if (!nutrition.hasNutrition) {
        daily.mealsWithoutNutrition += 1;
        return;
      }
      daily.mealsWithNutrition += 1;
      daily.calories += nutrition.calories;
      daily.protein += nutrition.protein;
      daily.carbohydrates += nutrition.carbohydrates;
      daily.fat += nutrition.fat;
      daily.vegetableServings += nutrition.vegetableServings;
      daily.sugar += nutrition.sugar;
    });
    return daily;
  }

  function getDailyNutritionBreakdown(mealPlan = getSavedMealPlan()) {
    return DAYS.reduce((dailySummaries, day) => {
      dailySummaries[day] = calculateDailyNutrition((mealPlan || {})[day] || {});
      return dailySummaries;
    }, {});
  }

  function normalizeSelectedServings(value) {
    const servings = Number(value);
    return Number.isInteger(servings) && servings > 0 ? servings : 1;
  }

  function displayWeeklyNutrition() {
    updateWeeklyNutritionControls();
    updateWeeklyNutritionSummary();
  }

  function updateNutritionSummary(options = {}) {
    return updateWeeklyNutritionSummary(options);
  }

  function renderWeeklyNutrition(summary, ratings, recommendations) {
    const target = $("#weeklyNutritionContent");
    if (!target) return;
    const profile = getCurrentNutritionProfile();
    const planningContext = buildNutritionPlanningContext(profile);
    const dailyTarget = getCurrentDailyNutritionTarget(profile);
    const estimateReady = Boolean(dailyTarget);
    const weeklyComparison = buildWeeklyNutritionComparison(
      {
        calories: summary.totalCalories,
        protein: summary.totalProtein,
        carbohydrates: summary.totalCarbohydrates,
        fat: summary.totalFat
      },
      dailyTarget,
      {
        mealsWithNutritionData: summary.mealsWithNutrition,
        totalPlannedMeals: summary.plannedMeals,
        daysWithPlannedMeals: Object.values(summary.days || {}).filter((day) => day?.plannedMeals > 0).length
      }
    );
    const notice = state.guestMode ? guestNotice("Temporary Guest Nutrition", "Weekly Nutrition uses your guest meal plan for this session. Nutrition history requires an account.") : "";
    target.innerHTML = `${notice}${renderNutritionSafetyPanel(planningContext)}${renderDailyNutritionRangeCard(summary, dailyTarget)}${plannedWeeklyNutritionHeading()}${weeklyNutritionSummaryCards(summary)}
      ${summary.plannedMeals ? weeklyNutritionStatus(summary) : weeklyNutritionEmptyState()}
      ${renderEstimatedWeeklyRangeSection(weeklyComparison, profile)}
      ${renderNutritionProgress(summary, ratings)}
      ${estimateReady ? weeklyNutritionRatingsSection(summary, ratings) : ""}
      ${weeklyNutritionRecommendationsSection(summary, ratings, recommendations)}
      ${weeklyNutritionDailyBreakdown(summary)}
      ${renderNutritionHistory()}`;
  }

  function renderNutritionSafetyPanel(context = buildNutritionPlanningContext(getCurrentNutritionProfile())) {
    const messages = [`<p>${escapeHtml(BODY_MEASUREMENT_SAFETY_MESSAGE)}</p>`];
    if (context.ageSafetyStatus === "minor") messages.push(`<p>${escapeHtml(TEEN_BODY_MEASUREMENT_MESSAGE)}</p>`);
    if (context.ageSafetyStatus === "unknown") messages.push(`<p>${escapeHtml(UNKNOWN_AGE_NUTRITION_MESSAGE)}</p>`);
    return `<section class="nutrition-safety-panel" aria-label="Nutrition safety information">${messages.join("")}</section>`;
  }

  function plannedWeeklyNutritionHeading() {
    return `<div class="section-heading compact"><div><span class="eyebrow">PLANNED WEEKLY NUTRITION</span><h2>Planned Weekly Nutrition</h2><p>These totals come from the recipes and servings in your Meal Planner.</p></div></div>`;
  }

  function renderDailyNutritionRangeCard(summary, target = getCurrentDailyNutritionTarget(getCurrentNutritionProfile())) {
    const formatted = target ? {
      calories: `${target.calorieMin.toLocaleString()}\u2013${target.calorieMax.toLocaleString()}`,
      protein: `${target.proteinMin.toLocaleString()}\u2013${target.proteinMax.toLocaleString()} g`,
      carbohydrates: `${target.carbohydrateMin.toLocaleString()}\u2013${target.carbohydrateMax.toLocaleString()} g`,
      fat: `${target.fatMin.toLocaleString()}\u2013${target.fatMax.toLocaleString()} g`
    } : null;
    const average = Number(summary?.averageCaloriesPerDay) || 0;
    if (!target || !formatted) {
      return `<section class="daily-energy-card unavailable" aria-labelledby="dailyEnergyRangeHeading">
        <h2 id="dailyEnergyRangeHeading">Estimated Daily Nutrition Range</h2>
        <strong>Personal estimate unavailable</strong>
        <p>Chef Nova will use general balanced-eating suggestions because there is not enough information for a safe estimate.</p>
        <ul class="general-suggestion-list compact">
          <li>Include a source of protein with meals.</li>
          <li>Include carbohydrates that support energy and activity.</li>
          <li>Include foods containing unsaturated fats.</li>
          <li>Add vegetables and fruit throughout the day.</li>
          <li>Include fibre-rich foods regularly.</li>
          <li>Drink water regularly.</li>
        </ul>
      </section>`;
    }
    const comparison = dailyEnergyComparisonText(average, target);
    const plannedAverages = dailyMacroPlanningRows(summary);
    const adjustmentNote = target.estimateType === "adult-general-goal-adjusted" ? "<p>This range includes a small general adjustment based on your selected goal.</p>" : "";
    const minorNote = target.ageSafetyStatus === "minor"
      ? "<p>For users under 18, these ranges are based on an estimated maintenance range and are intended to support balanced meals and activity, not calorie restriction.</p><p>Chef Nova uses an estimated maintenance range and does not automatically reduce calories for weight change. Balanced meals, variety, regular eating, and activity support are the focus.</p><p>For intentional weight change, consider speaking with a parent, doctor, or registered dietitian.</p>"
      : "";
    return `<section class="daily-energy-card" aria-labelledby="dailyEnergyRangeHeading">
      <h2 id="dailyEnergyRangeHeading">Estimated Daily Nutrition Range</h2>
      <dl class="nutrition-range-list">
        <div><dt>Calories</dt><dd>${escapeHtml(formatted.calories)}</dd></div>
        <div><dt>Protein</dt><dd>${escapeHtml(formatted.protein)}</dd></div>
        <div><dt>Carbohydrates</dt><dd>${escapeHtml(formatted.carbohydrates)}</dd></div>
        <div><dt>Fat</dt><dd>${escapeHtml(formatted.fat)}</dd></div>
        <div><dt>Fibre</dt><dd>General daily goal</dd></div>
        <div><dt>Vegetables and fruit</dt><dd>Include throughout the day</dd></div>
        <div><dt>Water</dt><dd>Drink regularly</dd></div>
      </dl>
      <p>These are general estimated ranges, not precise personal prescriptions.</p>
      <p>${escapeHtml(BODY_MEASUREMENT_SAFETY_MESSAGE)}</p>
      ${adjustmentNote}
      <div class="planned-calorie-average">
        <span>Planned daily averages</span>
        <dl class="planned-average-list">${plannedAverages.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>
        <p>${escapeHtml(comparison)}</p>
      </div>
      ${minorNote}
      <p>Meal plans may not include every snack, drink, or portion adjustment.</p>
    </section>`;
  }

  function dailyMacroPlanningRows(summary) {
    return [
      ["Calories", `${formatNutritionNumber(summary?.averageCaloriesPerDay || 0, 0)} calories per day`],
      ["Protein", `${formatNutritionNumber(summary?.averageProteinPerDay || 0, 0)} g per day`],
      ["Carbohydrates", `${formatNutritionNumber(summary?.averageCarbohydratesPerDay || 0, 0)} g per day`],
      ["Fat", `${formatNutritionNumber(summary?.averageFatPerDay || 0, 0)} g per day`]
    ];
  }

  function dailyEnergyComparisonText(averageCalories, result) {
    if (!Number.isFinite(averageCalories) || averageCalories <= 0) return "Add planned meals with nutrition data to compare your average planned calories with this estimate.";
    if (result?.ageSafetyStatus === "minor") return "Your meal plan is one part of your daily eating. Regular meals, snacks, variety, and activity support are also important.";
    if (averageCalories < result.calorieMin) return "Your current meal plan average is below the estimated range.";
    if (averageCalories > result.calorieMax) return "Your current meal plan average is above the estimated range.";
    return "Your current meal plan average is within the estimated range.";
  }

  function updateWeeklyNutritionControls() {
    const saveButton = $("#saveNutritionHistoryButton");
    const clearButton = $("#clearNutritionHistoryButton");
    if (saveButton) {
      saveButton.textContent = state.guestMode ? "Save History Requires Account" : "Save This Week";
      saveButton.title = state.guestMode ? "Create an account or log in to save nutrition history." : "";
      saveButton.setAttribute("aria-label", state.guestMode ? "Save nutrition history requires an account" : "Save this week's nutrition history");
    }
    if (clearButton) {
      clearButton.classList.toggle("hidden", state.guestMode);
      clearButton.setAttribute("aria-hidden", String(state.guestMode));
    }
  }

  function updateWeeklyNutritionPage(options = {}) {
    updateWeeklyNutritionSummary(options);
  }

  function updateWeeklyNutritionSummary(options = {}) {
    try {
      const mealPlan = getSavedMealPlan();
      state.mealPlans = mealPlan;
      if (state.guestMode) {
        guestSessionData.mealPlans = mealPlan;
        persistGuestProgress();
      } else writeUserStorage(KEYS.plans, mealPlan);
      const summary = getWeeklyNutritionSummary(mealPlan);
      const ratings = getWeeklyNutritionRatings(summary);
      const mealPlanStats = getMealPlanCompletionStats(mealPlan);
      const recommendations = generateWeeklyNutritionRecommendations(summary, ratings, mealPlanStats);
      renderWeeklyNutrition(summary, ratings, recommendations);
      if (options.showNotification) showToast("Weekly nutrition summary updated.", "success", { saveToHistory: false });
      return { summary, ratings, recommendations };
    } catch (error) {
      console.error("Unable to update weekly nutrition summary:", error);
      if (options.showNotification) showToast("Unable to update weekly nutrition summary.", "error", { saveToHistory: false });
      return null;
    }
  }

  function getNutritionHistory() {
    if (state.guestMode) return guestSessionData.nutritionHistory.filter(isNutritionHistoryEntryValid).sort(sortNutritionHistoryNewestFirst);
    try {
      const parsed = loadUserData("NutritionHistory");
      return Array.isArray(parsed) ? parsed.filter(isNutritionHistoryEntryValid).sort(sortNutritionHistoryNewestFirst) : [];
    } catch (error) {
      console.error("Unable to load nutrition history:", error);
      showToast("Unable to load nutrition history.", "error");
      return [];
    }
  }

  function saveNutritionHistory(history) {
    if (state.guestMode) {
      guestSessionData.nutritionHistory = history.filter(isNutritionHistoryEntryValid).sort(sortNutritionHistoryNewestFirst);
      persistGuestProgress();
      return false;
    }
    writeUserStorage(KEYS.nutritionHistory, history.filter(isNutritionHistoryEntryValid).sort(sortNutritionHistoryNewestFirst));
    return true;
  }

  function isNutritionHistoryEntryValid(entry) {
    return entry && typeof entry === "object" && /^\d{4}-\d{2}-\d{2}$/.test(String(entry.weekStart || "")) && ["calories", "protein", "vegetableServings", "sugar"].every((field) => typeof entry[field] === "number" && Number.isFinite(entry[field]));
  }

  function sortNutritionHistoryNewestFirst(a, b) {
    return new Date(`${b.weekStart}T00:00:00`) - new Date(`${a.weekStart}T00:00:00`);
  }

  function getStartOfWeek(date = new Date()) {
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = start.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + mondayOffset);
    return start;
  }

  function getEndOfWeek(date = new Date()) {
    const end = getStartOfWeek(date);
    end.setDate(end.getDate() + 6);
    return end;
  }

  function formatDateAsLocalISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function createWeeklyHistoryEntry(summary, date = new Date()) {
    return {
      weekStart: formatDateAsLocalISO(getStartOfWeek(date)),
      weekEnd: formatDateAsLocalISO(getEndOfWeek(date)),
      savedAt: new Date().toISOString(),
      calories: Number(summary.totalCalories) || 0,
      protein: Number(summary.totalProtein) || 0,
      vegetableServings: Number(summary.totalVegetableServings) || 0,
      sugar: Number(summary.totalSugar) || 0,
      mealsWithNutrition: Number(summary.mealsWithNutrition) || 0,
      mealsWithoutNutrition: Number(summary.mealsWithoutNutrition) || 0
    };
  }

  function saveCurrentWeeklySummary() {
    try {
      if (!requireAccount("save nutrition history")) return;
      const result = updateWeeklyNutritionSummary();
      const summary = result && result.summary;
      if (!summary || summary.mealsWithNutrition === 0) return showToast("Add meals with nutrition data before saving this week.", "warning");
      const entry = createWeeklyHistoryEntry(summary);
      const history = getNutritionHistory();
      const existingIndex = history.findIndex((item) => item.weekStart === entry.weekStart);
      const isUpdate = existingIndex >= 0;
      if (isUpdate) history[existingIndex] = entry;
      else history.push(entry);
      saveNutritionHistory(history);
      updateWeeklyNutritionSummary();
      showToast(isUpdate ? "Weekly nutrition summary updated in history." : "Weekly nutrition summary saved.", "success");
    } catch (error) {
      console.error("Unable to save weekly nutrition summary:", error);
      showToast("Unable to save weekly nutrition summary.", "error");
    }
  }

  function deleteNutritionHistoryEntry(weekStart) {
    try {
      if (!weekStart) return;
      if (!window.confirm("Delete this saved weekly summary?")) return;
      const nextHistory = getNutritionHistory().filter((entry) => entry.weekStart !== weekStart);
      saveNutritionHistory(nextHistory);
      updateWeeklyNutritionSummary();
      showToast("Saved weekly summary deleted.", "success");
    } catch (error) {
      console.error("Unable to delete saved weekly summary:", error);
      showToast("Unable to delete saved weekly summary.", "error");
    }
  }

  function clearNutritionHistory() {
    const history = getNutritionHistory();
    if (!history.length) return showToast("No saved weekly summaries to clear.", "info");
    if (!window.confirm("Clear all saved weekly nutrition summaries?")) return;
    if (state.guestMode) {
      guestSessionData.nutritionHistory = [];
      persistGuestProgress();
    } else removeUserData("NutritionHistory");
    updateWeeklyNutritionSummary();
    showToast("Nutrition history cleared.", "success");
  }

  function renderNutritionHistory() {
    if (state.guestMode) return guestNotice("Nutrition History Requires an Account", "Guests can view weekly nutrition totals, ratings, recommendations, progress bars, and daily breakdowns, but cannot permanently save nutrition history.");
    const history = getNutritionHistory();
    const content = history.length ? `<div class="nutrition-history-grid">${history.map(nutritionHistoryCard).join("")}</div>` : emptyState("No weekly summaries saved yet.", "Save a completed week to compare your nutrition over time.");
    return `<section class="nutrition-history-section" aria-labelledby="nutritionHistoryHeading">
      <div class="section-heading compact"><div><span class="eyebrow">SAVED WEEKLY SUMMARIES</span><h2 id="nutritionHistoryHeading">Saved Weekly Summaries</h2><p>Saved summaries contain estimated nutrition values from the week at the time they were saved.</p></div></div>
      ${content}
    </section>`;
  }

  function nutritionHistoryCard(entry) {
    return `<article class="nutrition-history-card">
      <h3>${escapeHtml(formatWeekDateRange(entry.weekStart))}</h3>
      <p><b>Calories:</b> ${formatNutritionNumber(entry.calories, 0)} kcal</p>
      <p><b>Protein:</b> ${formatNutritionNumber(entry.protein)} g</p>
      <p><b>Vegetables:</b> ${formatNutritionNumber(entry.vegetableServings)} ${entry.vegetableServings === 1 ? "serving" : "servings"}</p>
      <p><b>Sugar:</b> ${formatNutritionNumber(entry.sugar)} g</p>
      <p class="nutrition-history-saved"><b>Saved:</b> ${escapeHtml(formatSavedDate(entry.savedAt))}</p>
      <button class="button secondary small delete-history-button" type="button" data-delete-nutrition-history="${escapeHtml(entry.weekStart)}">Delete</button>
    </article>`;
  }

  function formatWeekDateRange(weekStart) {
    const [year, month, day] = String(weekStart).split("-").map(Number);
    const start = new Date(year, month - 1, day);
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
    const startLabel = start.toLocaleDateString(undefined, { month: "long", day: "numeric" });
    const endLabel = end.toLocaleDateString(undefined, { day: "numeric", year: "numeric" });
    return `${startLabel}-${endLabel}`;
  }

  function formatSavedDate(savedAt) {
    const date = savedAt ? new Date(savedAt) : null;
    if (!date || Number.isNaN(date.getTime())) return "Unknown date";
    return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  }

  function weeklyNutritionSummaryCards(summary) {
    const cards = [
      ["Planned Calories", `${formatNutritionNumber(summary.totalCalories, 0)} kcal`],
      ["Average Planned Calories per Day", `${formatNutritionNumber(summary.averageCaloriesPerDay, 0)} kcal`],
      ["Planned Protein", `${formatNutritionNumber(summary.totalProtein)} g`],
      ["Average Planned Protein per Day", `${formatNutritionNumber(summary.averageProteinPerDay)} g`],
      ["Planned Vegetable Servings", `${formatNutritionNumber(summary.totalVegetableServings)} ${summary.totalVegetableServings === 1 ? "serving" : "servings"}`],
      ["Planned Sugar", `${formatNutritionNumber(summary.totalSugar)} g`],
      ["Meals Included", `${summary.mealsWithNutrition} ${summary.mealsWithNutrition === 1 ? "meal" : "meals"}`],
      ["Meals with Nutrition Information Unavailable", `${summary.mealsWithoutNutrition} ${summary.mealsWithoutNutrition === 1 ? "meal" : "meals"}`]
    ];
    return `<div class="weekly-summary-grid">${cards.map(([label, value]) => `<article class="weekly-summary-card"><span>${label}</span><strong>${value}</strong></article>`).join("")}</div>`;
  }

  function weeklyNutritionStatus(summary) {
    const missingNotice = summary.mealsWithoutNutrition ? `<div class="nutrition-missing-notice"><h2>Some planned meals have nutrition information unavailable and are not included in the nutrition totals.</h2><p>${summary.mealsWithoutNutrition} ${summary.mealsWithoutNutrition === 1 ? "meal is" : "meals are"} not included in the nutrition totals.</p></div>` : "";
    const message = summary.mealsWithoutNutrition ? "Some planned meals have nutrition information unavailable." : "All planned meals include nutrition information.";
    return `<div class="weekly-nutrition-status"><p>${message}</p></div>${missingNotice}`;
  }

  function weeklyNutritionEmptyState() {
    return emptyState("No meals are planned yet.", "Add recipes to your Meal Planner to view your weekly nutrition summary.", "Open Meal Planner", "planner");
  }

  function renderEstimatedWeeklyRangeSection(comparison, profile = getCurrentNutritionProfile()) {
    const scope = getWeeklyNutritionDataScope();
    const limitationNotice = renderWeeklyComparisonLimitationNotice(comparison?.limitationMessage || WEEKLY_COMPARISON_LIMITATION_MESSAGE, scope);
    if (!comparison?.available) {
      const emptyPlan = !comparison?.coverage?.totalPlannedMeals;
      const coverage = comparison?.coverage || calculateNutritionDataCoverage(0, 0);
      const coverageText = coverage.available ? `${coverage.percentage}% of planned meals` : "No planned meals this week";
      const coverageDetail = coverage.available
        ? `${formatNutritionNumber(coverage.mealsWithNutritionData, 0)} of ${formatNutritionNumber(coverage.totalPlannedMeals, 0)} planned meals include nutrition data.`
        : "No planned meals this week";
      const message = emptyPlan
        ? "Add meals to the Meal Planner to compare your plan with the estimated weekly range."
        : "Chef Nova will use general balanced-eating suggestions because there is not enough information for a safe estimate.";
      return `<section class="estimated-weekly-range-section unavailable" aria-labelledby="estimatedWeeklyRangeHeading" aria-live="polite">
        <div class="section-heading compact"><div><span class="eyebrow">ESTIMATED WEEKLY RANGE</span><h2 id="estimatedWeeklyRangeHeading">Your Estimated Weekly Range</h2><p>Personal estimate unavailable</p></div></div>
        ${limitationNotice}
        <div class="weekly-range-empty-card">
          <strong>${emptyPlan ? "No planned meals this week" : "Personal estimate unavailable"}</strong>
          <p>${escapeHtml(message)}</p>
          <p><b>Nutrition data coverage:</b> ${escapeHtml(coverageText)}</p>
          <p>${escapeHtml(coverageDetail)} Nutrition data coverage shows how many planned meals have nutrition details. It does not measure whether every food or drink was entered.</p>
          <p><b>Comparison confidence:</b> ${escapeHtml(weeklyConfidenceLabel(comparison?.confidence || "unavailable"))}</p>
          <p><b>General status:</b> ${escapeHtml(WEEKLY_NUTRITION_STATUS_LABELS["not-enough-meal-data"])}</p>
        </div>
      </section>`;
    }
    const coverage = comparison.coverage;
    const nutrientRows = [
      ["Calories", "calories", comparison.nutrients.calories, ""],
      ["Protein", "protein", comparison.nutrients.protein, "g"],
      ["Carbohydrates", "carbohydrates", comparison.nutrients.carbohydrates, "g"],
      ["Fat", "fat", comparison.nutrients.fat, "g"]
    ];
    const coverageText = coverage.available
      ? `${coverage.percentage}% of planned meals`
      : "No planned meals this week";
    const coverageDetail = coverage.available
      ? `${formatNutritionNumber(coverage.mealsWithNutritionData, 0)} of ${formatNutritionNumber(coverage.totalPlannedMeals, 0)} planned meals include nutrition data.`
      : "No planned meals this week";
    const coverageClarification = "Nutrition data coverage shows how many planned meals have nutrition details. It does not measure whether every food or drink was entered.";
    const minorNote = profile?.ageSafetyStatus === "minor"
      ? `<p class="weekly-range-minor-note">For users under 18, these comparisons are intended to support regular balanced meals and activity, not calorie restriction.</p>`
      : "";
    const suggestionItems = weeklyRangeRecommendationItems(comparison, profile);
    return `<section class="estimated-weekly-range-section" aria-labelledby="estimatedWeeklyRangeHeading" aria-live="polite">
      <div class="section-heading compact"><div><span class="eyebrow">ESTIMATED WEEKLY RANGE</span><h2 id="estimatedWeeklyRangeHeading">Your Estimated Weekly Range</h2><p>Compare planned weekly totals with seven days of estimated daily ranges.</p></div></div>
      ${limitationNotice}
      <div class="weekly-range-overview">
        <article>
          <span>Nutrition Data Coverage</span>
          <strong>${escapeHtml(coverageText)}</strong>
          <p>${escapeHtml(coverageDetail)}</p>
          <p>${escapeHtml(coverageClarification)}</p>
        </article>
        <article>
          <span>Comparison confidence</span>
          <strong>${escapeHtml(weeklyConfidenceLabel(comparison.confidence))}</strong>
          <p>${escapeHtml(weeklyConfidenceDescription(comparison.confidence))}</p>
        </article>
        <article>
          <span>Planning comparison status</span>
          <strong class="${weeklyStatusClass(comparison.overallStatus)}">${escapeHtml(weeklyStatusLabel(comparison.overallStatus))}</strong>
          <p>Based on entered meal data.</p>
        </article>
      </div>
      <div class="weekly-range-table-wrap">
        <table class="weekly-range-table">
          <thead><tr><th scope="col">Nutrient</th><th scope="col">Planned amount</th><th scope="col">Estimated range</th><th scope="col">Status</th></tr></thead>
          <tbody>${nutrientRows.map(([label, key, nutrient, unit]) => weeklyRangeTableRow(label, key, nutrient, unit)).join("")}</tbody>
        </table>
      </div>
      <div class="weekly-range-card-grid">${nutrientRows.map(([label, key, nutrient, unit]) => weeklyRangeMobileCard(label, key, nutrient, unit)).join("")}</div>
      <div class="weekly-range-suggestions" aria-label="Weekly nutrition planning notes">
        <h3>Planning notes</h3>
        <ul>${suggestionItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
      ${minorNote}
      <p class="weekly-range-disclaimer">These weekly ranges are based on seven days of estimated daily ranges. They are general planning references, not precise personal prescriptions.</p>
      <p class="weekly-range-disclaimer">Planned totals may not include snacks, drinks, restaurant meals, portion changes, custom meals without nutrition data, or ingredients added during cooking.</p>
    </section>`;
  }

  function renderWeeklyComparisonLimitationNotice(message, scope = getWeeklyNutritionDataScope()) {
    const mayExclude = scope.mayExclude.join(", ");
    return `<aside class="weekly-comparison-limit" aria-labelledby="weeklyComparisonLimitHeading">
      <h3 id="weeklyComparisonLimitHeading">Important limitation</h3>
      <p>${escapeHtml(message)}</p>
      <p>Planned totals may not include snacks, drinks, restaurant meals, portion changes, custom meals without nutrition data, or ingredients added during cooking.</p>
      <p>Snacks may not be included unless they were entered as a custom meal. Ingredients added during cooking may not be included unless the recipe or custom meal nutrition was updated.</p>
      <p>Recipe substitutions and added ingredients may change the actual nutrition compared with the saved recipe estimate.</p>
      <p class="weekly-scope-note">May exclude: ${escapeHtml(mayExclude)}.</p>
    </aside>`;
  }

  function weeklyRangeTableRow(label, key, nutrient, unit) {
    const plannedLabel = `Planned ${label.toLowerCase()}`;
    return `<tr>
      <th scope="row">${escapeHtml(label)}</th>
      <td data-label="${escapeHtml(plannedLabel)}">${escapeHtml(formatWeeklyPlannedValue(nutrient?.planned, unit))}</td>
      <td data-label="Estimated range">${escapeHtml(formatWeeklyRange(nutrient?.estimatedRange, unit))}</td>
      <td data-label="Status"><span class="weekly-range-status ${weeklyStatusClass(nutrient?.status)}">${escapeHtml(weeklyStatusLabel(nutrient?.status))}</span><span class="weekly-status-context">Based on entered meal data</span></td>
    </tr>`;
  }

  function weeklyRangeMobileCard(label, key, nutrient, unit) {
    const plannedLabel = `Planned ${label.toLowerCase()}`;
    return `<article class="weekly-range-mobile-card">
      <h3>${escapeHtml(label)}</h3>
      <p><b>${escapeHtml(plannedLabel)}:</b> ${escapeHtml(formatWeeklyPlannedValue(nutrient?.planned, unit))}</p>
      <p><b>Estimated range:</b> ${escapeHtml(formatWeeklyRange(nutrient?.estimatedRange, unit))}</p>
      <p><b>Status:</b> <span class="weekly-range-status ${weeklyStatusClass(nutrient?.status)}">${escapeHtml(weeklyStatusLabel(nutrient?.status))}</span></p>
      <p class="weekly-status-context">Based on entered meal data</p>
    </article>`;
  }

  function weeklyConfidenceLabel(confidence) {
    return WEEKLY_COMPARISON_CONFIDENCE_LABELS[confidence] || WEEKLY_COMPARISON_CONFIDENCE_LABELS.unavailable;
  }

  function weeklyConfidenceDescription(confidence) {
    return WEEKLY_COMPARISON_CONFIDENCE_DESCRIPTIONS[confidence] || WEEKLY_COMPARISON_CONFIDENCE_DESCRIPTIONS.unavailable;
  }

  function weeklyStatusLabel(status) {
    return WEEKLY_NUTRITION_STATUS_LABELS[status] || WEEKLY_NUTRITION_STATUS_LABELS["not-enough-meal-data"];
  }

  function weeklyStatusClass(status) {
    const classes = {
      "within-estimated-range": "status-within-range",
      "below-estimated-range": "status-below-range",
      "above-estimated-range": "status-above-range",
      "not-enough-meal-data": "status-insufficient-data"
    };
    return classes[status] || classes["not-enough-meal-data"];
  }

  function buildSafeWeeklyNutritionRecommendation(nutrientName, status, comparisonContext) {
    const limitation = "This comparison only reflects meals entered in Chef Nova.";
    if (status === "not-enough-meal-data") {
      return `Add nutrition information to more planned meals for a more useful comparison. ${limitation}`;
    }
    if (comparisonContext?.confidence === "limited" || comparisonContext?.confidence === "unavailable") {
      return `There is not enough meal information to suggest changing your eating. ${limitation}`;
    }
    if (comparisonContext?.ageSafetyStatus === "minor" && status === "below-estimated-range") {
      return `The planned ${nutrientName} total is below the estimated range, but snacks, drinks, portions, and meals outside the planner may be missing. Focus on regular balanced meals and activity support.`;
    }
    if (comparisonContext?.ageSafetyStatus === "minor" && status === "above-estimated-range") {
      return `The planned ${nutrientName} total is above the estimated range, but the planner may not reflect actual portions, activity, appetite, snacks, drinks, or all meals. No change is recommended from this comparison alone.`;
    }
    if (status === "below-estimated-range") {
      return `The planned ${nutrientName} total is below the estimated range. Snacks, drinks, portions, and meals not entered may change this comparison.`;
    }
    if (status === "above-estimated-range") {
      return `The planned ${nutrientName} total is above the estimated range. This does not confirm the full week because foods and portions outside the planner may be missing.`;
    }
    return `The planned ${nutrientName} total falls within the estimated range. ${limitation}`;
  }

  function weeklyRangeRecommendationItems(comparison, profile = getCurrentNutritionProfile()) {
    const baseContext = {
      confidence: comparison?.confidence || "unavailable",
      ageSafetyStatus: profile?.ageSafetyStatus || "unknown",
      goalType: comparison?.goalType || profile?.goal || null
    };
    if (!comparison?.available || !comparison.nutrients) {
      return [
        buildSafeWeeklyNutritionRecommendation("nutrition", "not-enough-meal-data", baseContext),
        "Before using this comparison, check whether snacks, drinks, restaurant meals, serving sizes, and custom meals have been entered."
      ];
    }
    const rows = [
      ["calories", "calories"],
      ["protein", "protein"],
      ["carbohydrates", "carbohydrates"],
      ["fat", "fat"]
    ];
    const priority = rows.find(([key]) => comparison.nutrients[key]?.status !== "within-estimated-range");
    const notes = [];
    if (baseContext.confidence === "limited" || baseContext.confidence === "partial") {
      notes.push("Before using this comparison, check whether snacks, drinks, restaurant meals, serving sizes, and custom meals have been entered.");
    }
    if (priority) {
      notes.push(buildSafeWeeklyNutritionRecommendation(priority[1], comparison.nutrients[priority[0]].status, baseContext));
    } else {
      notes.push(buildSafeWeeklyNutritionRecommendation("nutrition", "within-estimated-range", baseContext));
    }
    if (baseContext.goalType === "support-workouts") {
      notes.push("Workout-support suggestions remain general and separate from this weekly comparison.");
    }
    return notes;
  }

  function weeklyNutritionDailyBreakdown(summary) {
    return renderDailyNutritionBreakdown(summary.days);
  }

  function renderDailyNutritionBreakdown(dailySummaries) {
    return `<section class="daily-nutrition-section" aria-labelledby="dailyNutritionHeading">
      <div class="section-heading compact"><div><span class="eyebrow">DAILY BREAKDOWN</span><h2 id="dailyNutritionHeading">Daily Nutrition Breakdown</h2><p>See how your planned nutrition is distributed throughout the week.</p></div></div>
      <div class="daily-nutrition-grid">${DAYS.map((day) => dailyNutritionCard(day, dailySummaries[day] || createEmptyDailyNutritionSummary())).join("")}</div>
    </section>`;
  }

  function dailyNutritionCard(day, daily) {
    const stateMessage = !daily.plannedMeals ? "No planned meal nutrition information for this day." : (!daily.mealsWithNutrition ? "Nutrition information unavailable for this day." : "");
    return `<article class="daily-nutrition-card">
      <h3>${day}</h3>
      ${stateMessage ? `<p class="daily-nutrition-state">${stateMessage}</p>` : ""}
      <p><b>Planned calories:</b> ${formatNutritionNumber(daily.calories, 0)} kcal</p>
      <p><b>Planned protein:</b> ${formatNutritionNumber(daily.protein)} g</p>
      <p><b>Planned vegetables:</b> ${formatNutritionNumber(daily.vegetableServings)} ${daily.vegetableServings === 1 ? "serving" : "servings"}</p>
      <p><b>Planned sugar:</b> ${formatNutritionNumber(daily.sugar)} g</p>
      <p><b>Nutrition available:</b> ${daily.mealsWithNutrition} ${daily.mealsWithNutrition === 1 ? "meal" : "meals"}</p>
      <p><b>Nutrition information unavailable:</b> ${daily.mealsWithoutNutrition} ${daily.mealsWithoutNutrition === 1 ? "meal" : "meals"}</p>
    </article>`;
  }

  function formatNutritionNumber(value, decimals = 1) {
    const number = Number(value) || 0;
    const rounded = decimals === 0 ? Math.round(number) : Math.round(number * 10) / 10;
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: decimals }).format(rounded);
  }

  function formatWeeklyCalories(value) {
    return Number.isFinite(value) ? value.toLocaleString() : "Not available";
  }

  function formatWeeklyGrams(value) {
    return Number.isFinite(value) ? `${value.toLocaleString()} g` : "Not available";
  }

  function formatWeeklyPlannedValue(value, unit = "") {
    if (!Number.isFinite(value)) return "No data";
    return unit === "g" ? formatWeeklyGrams(value) : formatWeeklyCalories(value);
  }

  function formatWeeklyRange(range, unit = "") {
    if (!range || !Number.isFinite(range.minimum) || !Number.isFinite(range.maximum)) return "Not available";
    const suffix = unit ? ` ${unit}` : "";
    return `${range.minimum.toLocaleString()}\u2013${range.maximum.toLocaleString()}${suffix}`;
  }

  function getProteinRating(totalProtein) {
    if (totalProtein >= 350) return "Excellent";
    if (totalProtein >= 250) return "Good";
    if (totalProtein >= 150) return "Moderate";
    return "Low";
  }

  function getVegetableRating(totalVegetableServings) {
    if (totalVegetableServings >= 21) return "Excellent";
    if (totalVegetableServings >= 14) return "Good";
    if (totalVegetableServings >= 7) return "Moderate";
    return "Low";
  }

  function getSugarRating(totalSugar) {
    if (totalSugar > 350) return "High";
    if (totalSugar >= 175) return "Moderate";
    return "Low";
  }

  function calculateNutritionRating(type, value) {
    if (type === "protein") return getProteinRating(value);
    if (type === "vegetables" || type === "vegetableServings") return getVegetableRating(value);
    if (type === "sugar") return getSugarRating(value);
    return "Not enough data";
  }

  function getWeeklyNutritionRatings(summary) {
    if (!summary.mealsWithNutrition) {
      return {
        protein: { value: summary.totalProtein, rating: "Not enough data", explanation: "Add Chef Nova recipes to your Meal Planner to calculate this rating." },
        vegetables: { value: summary.totalVegetableServings, rating: "Not enough data", explanation: "Add Chef Nova recipes to your Meal Planner to calculate this rating." },
        sugar: { value: summary.totalSugar, rating: "Not enough data", explanation: "Add Chef Nova recipes to your Meal Planner to calculate this rating." }
      };
    }
    return {
      protein: { value: summary.totalProtein, rating: getProteinRating(summary.totalProtein), explanation: nutritionRatingExplanation("protein", getProteinRating(summary.totalProtein)) },
      vegetables: { value: summary.totalVegetableServings, rating: getVegetableRating(summary.totalVegetableServings), explanation: nutritionRatingExplanation("vegetables", getVegetableRating(summary.totalVegetableServings)) },
      sugar: { value: summary.totalSugar, rating: getSugarRating(summary.totalSugar), explanation: nutritionRatingExplanation("sugar", getSugarRating(summary.totalSugar)) }
    };
  }

  function nutritionRatingExplanation(category, rating) {
    const explanations = {
      protein: {
        Excellent: "350 g or more this week.",
        Good: "250-349 g this week.",
        Moderate: "150-249 g this week.",
        Low: "Below 150 g this week."
      },
      vegetables: {
        Excellent: "21 or more servings this week.",
        Good: "14-20 servings this week.",
        Moderate: "7-13 servings this week.",
        Low: "Below 7 servings this week."
      },
      sugar: {
        Low: "Below 175 g this week.",
        Moderate: "175-350 g this week.",
        High: "Above 350 g this week."
      }
    };
    return explanations[category][rating];
  }

  function weeklyNutritionRatingsSection(summary, ratings = getWeeklyNutritionRatings(summary)) {
    const missingNote = summary.mealsWithoutNutrition ? `<p class="nutrition-rating-note">These ratings only use meals with available nutrition data. ${summary.mealsWithoutNutrition} planned ${summary.mealsWithoutNutrition === 1 ? "meal was" : "meals were"} not included because nutrition data was unavailable.</p>` : "";
    const cards = [
      ["Protein", `${formatNutritionNumber(ratings.protein.value)} g this week`, ratings.protein],
      ["Vegetables", `${formatNutritionNumber(ratings.vegetables.value)} ${ratings.vegetables.value === 1 ? "serving" : "servings"} this week`, ratings.vegetables],
      ["Sugar", `${formatNutritionNumber(ratings.sugar.value)} g this week`, ratings.sugar]
    ];
    return `<section class="nutrition-ratings-section">
      <div class="section-heading compact"><div><span class="eyebrow">WEEKLY NUTRITION RATINGS</span><h2>Weekly Nutrition Ratings</h2></div></div>
      ${missingNote}
      <div class="nutrition-rating-grid">${cards.map(([title, value, rating]) => nutritionRatingCard(title, value, rating)).join("")}</div>
    </section>`;
  }

  function nutritionRatingCard(title, value, rating) {
    const className = normalizeIngredient(rating.rating).replace(/\s+/g, "-");
    return `<article class="nutrition-rating-card rating-${className}">
      <span class="nutrition-rating-category">${title}</span>
      <strong>${value}</strong>
      <span class="nutrition-rating-word">${rating.rating}</span>
      <p>${rating.explanation}</p>
    </article>`;
  }

  function calculateProgressPercentage(value, target) {
    const progressValue = Number(value);
    const progressTarget = Number(target);
    if (!Number.isFinite(progressValue) || !Number.isFinite(progressTarget) || progressValue <= 0 || progressTarget <= 0) return 0;
    return Math.min((progressValue / progressTarget) * 100, 100);
  }

  function getNutritionProgress(summary, ratings) {
    const noData = summary.mealsWithNutrition === 0;
    return {
      protein: {
        type: "protein",
        label: "Protein",
        value: summary.totalProtein,
        target: 350,
        percentage: noData ? 0 : calculateProgressPercentage(summary.totalProtein, 350),
        rating: noData ? "Not enough data" : ratings.protein.rating,
        displayValue: `${formatNutritionNumber(summary.totalProtein)} g this week`,
        ariaLabel: "Weekly protein planning reference",
        explanation: noData ? "Add Chef Nova recipes to your Meal Planner to calculate this reference." : "Planning reference only, not an exact target."
      },
      vegetables: {
        type: "vegetables",
        label: "Vegetables",
        value: summary.totalVegetableServings,
        target: 21,
        percentage: noData ? 0 : calculateProgressPercentage(summary.totalVegetableServings, 21),
        rating: noData ? "Not enough data" : ratings.vegetables.rating,
        displayValue: `${formatNutritionNumber(summary.totalVegetableServings)} ${summary.totalVegetableServings === 1 ? "serving" : "servings"} this week`,
        ariaLabel: "Weekly vegetable planning reference",
        explanation: noData ? "Add Chef Nova recipes to your Meal Planner to calculate this reference." : "Planning reference only, not an exact target."
      },
      sugar: {
        type: "sugar",
        label: "Sugar",
        value: summary.totalSugar,
        reference: 350,
        target: 350,
        percentage: noData ? 0 : calculateProgressPercentage(summary.totalSugar, 350),
        rating: noData ? "Not enough data" : ratings.sugar.rating,
        isHigh: !noData && summary.totalSugar > 350,
        displayValue: `${formatNutritionNumber(summary.totalSugar)} g compared with 350 g`,
        ariaLabel: "Weekly sugar compared with 350 g reference range",
        explanation: noData ? "Add Chef Nova recipes to your Meal Planner to calculate progress." : "Weekly reference limit, not a goal to reach."
      }
    };
  }

  function renderNutritionProgress(summary, ratings) {
    const profile = getCurrentNutritionProfile();
    if (!canCalculateNutritionEstimates(profile)) return renderGeneralNutritionSuggestions(profile);
    const progress = getNutritionProgress(summary, ratings);
    const progressItems = [progress.protein, progress.vegetables, progress.sugar];
    const missingNote = summary.mealsWithoutNutrition ? `<p class="nutrition-progress-note">Progress is based only on meals with available nutrition data. ${summary.mealsWithoutNutrition} planned ${summary.mealsWithoutNutrition === 1 ? "meal was" : "meals were"} not included.</p>` : "";
    const sugarWarning = progress.sugar.isHigh ? `<div class="nutrition-progress-warning"><span aria-hidden="true">!</span><div><b>Sugar is above Chef Nova's weekly reference range.</b><p>Consider replacing some desserts or sweet drinks with lower-sugar options.</p></div></div>` : "";
    return `<section class="nutrition-progress-section" aria-labelledby="nutritionProgressHeading">
      <div class="section-heading compact"><div><span class="eyebrow">WEEKLY PLANNING REFERENCE</span><h2 id="nutritionProgressHeading">Weekly Planning Reference</h2><p>See simple planning references from the meals in your weekly plan.</p></div></div>
      ${missingNote}
      <div class="nutrition-progress-grid">${progressItems.map(nutritionProgressCard).join("")}</div>
      ${sugarWarning}
      <p class="nutrition-progress-disclaimer">These planning references are simple Chef Nova estimates based on planned meals and available recipe data. They are not exact targets, medical advice, or professional dietary advice.</p>
    </section>`;
  }

  function renderGeneralNutritionSuggestions(profile) {
    const completeness = profile?.profileCompleteness || "limited";
    const safetyNotes = [];
    if (profile?.ageSafetyStatus === "minor") {
      safetyNotes.push("<p>Age-sensitive safety protections are active, so Chef Nova will keep suggestions general and supportive.</p>");
      safetyNotes.push(`<p>${escapeHtml(TEEN_BODY_MEASUREMENT_MESSAGE)}</p>`);
    }
    if (profile?.ageSafetyStatus === "unknown") safetyNotes.push(`<p>${escapeHtml(UNKNOWN_AGE_NUTRITION_MESSAGE)}</p>`);
    return `<section class="nutrition-progress-section general-nutrition-suggestions" aria-labelledby="generalNutritionSuggestionsHeading">
      <div class="section-heading compact"><div><span class="eyebrow">GENERAL SUGGESTIONS</span><h2 id="generalNutritionSuggestionsHeading">General Nutrition Suggestions</h2><p>Add more optional information in your Nutrition Profile for estimated personal goals. For now, Chef Nova will provide general balanced-eating suggestions.</p></div></div>
      <div class="nutrition-missing-notice">
        <h2>Personal estimate unavailable</h2>
        <p>Information level: ${escapeHtml(nutritionCompletenessLabel(completeness))}. Weekly Nutrition still displays totals from planned meals, but it will not compare them against personal energy estimates.</p>
        ${safetyNotes.join("")}
      </div>
      <ul class="general-suggestion-list">
        <li>Include vegetables or fruit across the day.</li>
        <li>Add a source of protein to meals.</li>
        <li>Include filling carbohydrates such as whole grains, rice, pasta, potatoes, or similar foods.</li>
        <li>Eat regular meals that support your school, work, and activity schedule.</li>
        <li>Drink water regularly.</li>
        <li>Choose a variety of foods over time.</li>
        <li>Adjust portions based on hunger, energy, and activity.</li>
      </ul>
      <p class="nutrition-progress-disclaimer">General suggestions are not calculated targets and are not medical or professional dietary advice.</p>
    </section>`;
  }

  function nutritionProgressCard(item) {
    const width = calculateProgressPercentage(item.value, item.target);
    return `<article class="nutrition-progress-card ${getProgressRatingClass(item.type, item.rating)}">
      <div class="nutrition-progress-header">
        <h3>${escapeHtml(item.label)}</h3>
        <span>${escapeHtml(item.displayValue)}</span>
      </div>
      <div class="nutrition-progress-track" role="progressbar" aria-label="${escapeHtml(item.ariaLabel)}" aria-valuemin="0" aria-valuemax="${escapeHtml(String(item.target))}" aria-valuenow="${escapeHtml(String(formatProgressAriaValue(item.value)))}">
        <div class="nutrition-progress-fill" style="width: ${width}%;"></div>
      </div>
      <p class="nutrition-progress-rating">${escapeHtml(item.rating)}</p>
      <p>${escapeHtml(item.explanation)}</p>
    </article>`;
  }

  function formatProgressAriaValue(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? Math.round(number * 10) / 10 : 0;
  }

  function getProgressRatingClass(type, rating) {
    return `progress-${normalizeIngredient(type).replace(/\s+/g, "-")} progress-${normalizeIngredient(rating).replace(/\s+/g, "-")}`;
  }

  function updateProgressBar(element, percentage) {
    if (!element) return;
    element.style.width = `${calculateProgressPercentage(percentage, 100)}%`;
  }

  function getMealPlanCompletionStats(mealPlan = getSavedMealPlan()) {
    const plannedMeals = DAYS.reduce((count, day) => count + MEALS.filter((mealType) => normalizeMealPlanEntry((mealPlan[day] || {})[mealType])).length, 0);
    const totalSlots = DAYS.length * MEALS.length;
    return {
      totalSlots,
      plannedMeals,
      emptySlots: totalSlots - plannedMeals,
      completionPercentage: Math.round((plannedMeals / totalSlots) * 100)
    };
  }

  function generateWeeklyNutritionRecommendations(summary, ratings, mealPlanStats) {
    const recommendations = [];
    const planningContext = buildNutritionPlanningContext(getCurrentNutritionProfile());

    if (mealPlanStats.plannedMeals < 5) return [createEmptyPlanRecommendation(mealPlanStats)];
    if (summary.mealsWithNutrition === 0) return [createNoNutritionDataRecommendation()];
    if (shouldUseGeneralTeenGuidance(planningContext) || !canUseBodyBasedEstimate(planningContext)) return [createGeneralNutritionSuggestionRecommendation(planningContext)];

    if (summary.mealsWithoutNutrition >= 3 || summary.mealsWithoutNutrition > summary.mealsWithNutrition) recommendations.push(createMissingNutritionRecommendation(summary.mealsWithoutNutrition));
    if (ratings.sugar.rating === "High") recommendations.push(createHighSugarRecommendation());
    if (ratings.vegetables.rating === "Low") recommendations.push(createLowVegetableRecommendation());
    if (ratings.protein.rating === "Low") recommendations.push(createLowProteinRecommendation());
    if (!recommendations.length) recommendations.push(createPositiveRecommendation());

    return Array.from(new Map(recommendations.map((recommendation) => [recommendation.id, recommendation])).values())
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 3);
  }

  function generateNutritionRecommendations() {
    const summary = getWeeklyNutritionSummary();
    return generateWeeklyNutritionRecommendations(summary, getWeeklyNutritionRatings(summary), getMealPlanCompletionStats());
  }

  function createEmptyPlanRecommendation(stats) {
    return {
      id: "mostly-empty-plan",
      type: "empty-plan",
      title: "Plan More Meals",
      message: "Plan more meals before viewing your weekly nutrition summary.",
      reason: `Only ${stats.plannedMeals} of ${stats.totalSlots} meal slots are currently filled.`,
      priority: 1,
      actionLabel: "Open Meal Planner",
      actionPage: "planner"
    };
  }

  function createNoNutritionDataRecommendation() {
    return {
      id: "no-nutrition-data",
      type: "no-data",
      title: "Use Chef Nova Recipes",
      message: "Add Chef Nova recipes to your meal plan to calculate nutrition totals and receive more useful recommendations.",
      reason: "None of your planned meals currently include nutrition data.",
      priority: 1,
      actionLabel: "Find Recipes",
      actionPage: "recipes"
    };
  }

  function createGeneralNutritionSuggestionRecommendation(context = buildNutritionPlanningContext(getCurrentNutritionProfile())) {
    const reason = context.ageSafetyStatus === "minor"
      ? "Chef Nova keeps nutrition guidance general for teenagers."
      : (context.ageSafetyStatus === "unknown" ? "Chef Nova does not assume adult body-based estimates without age information." : "You can add more optional information from Profile at any time.");
    return {
      id: "general-nutrition-suggestions",
      type: "general-suggestions",
      title: "Use General Suggestions",
      message: "Chef Nova is using general balanced-eating suggestions because your optional Nutrition Profile does not have enough information for safe estimates.",
      reason,
      priority: 1,
      actionLabel: "Edit Nutrition Profile",
      actionPage: "account"
    };
  }

  function createMissingNutritionRecommendation(mealsWithoutNutrition) {
    return {
      id: "missing-nutrition-data",
      type: "missing-data",
      title: "Improve Nutrition Accuracy",
      message: "Add recipes from Chef Nova to your meal plan for a more accurate nutrition summary.",
      reason: `${mealsWithoutNutrition} planned ${mealsWithoutNutrition === 1 ? "meal does" : "meals do"} not have nutrition data.`,
      priority: 2,
      actionLabel: "Open Meal Planner",
      actionPage: "planner"
    };
  }

  function createHighSugarRecommendation() {
    return {
      id: "high-sugar",
      type: "sugar",
      title: "Choose Lower-Sugar Options",
      message: "Consider replacing some desserts or sweet drinks with lower-sugar options.",
      reason: "Your planned meals contain more than 350 g of sugar this week.",
      priority: 3,
      actionLabel: "Find Lower-Sugar Recipes",
      actionPage: "recipes"
    };
  }

  function createLowVegetableRecommendation() {
    return {
      id: "low-vegetables",
      type: "vegetables",
      title: "Add More Vegetables",
      message: "Try adding more vegetables to your lunches and dinners this week.",
      reason: "Your planned meals include fewer than 7 vegetable servings this week.",
      priority: 4,
      actionLabel: "Find Vegetable Recipes",
      actionPage: "recipes"
    };
  }

  function createLowProteinRecommendation() {
    return {
      id: "low-protein",
      type: "protein",
      title: "Add More Protein",
      message: "Add a protein source such as eggs, chicken, tofu, beans, fish, or yogurt.",
      reason: "Your planned meals contain less than 150 g of protein this week.",
      priority: 5,
      actionLabel: "Find High-Protein Recipes",
      actionPage: "recipes"
    };
  }

  function createPositiveRecommendation() {
    return {
      id: "positive-state",
      type: "positive",
      title: "No Major Suggestions",
      message: "Your planned meals do not currently trigger any nutrition suggestions.",
      reason: "Continue adding complete recipe information to keep your summary accurate.",
      priority: 10,
      actionLabel: "",
      actionPage: ""
    };
  }

  function weeklyNutritionRecommendationsSection(summary, ratings = getWeeklyNutritionRatings(summary), recommendations = null) {
    const renderedRecommendations = recommendations || generateWeeklyNutritionRecommendations(summary, ratings, getMealPlanCompletionStats());
    const dataNote = summary.mealsWithoutNutrition ? `<p class="nutrition-recommendation-note">Recommendations are based only on meals with available nutrition data.</p>` : "";
    return `<section class="nutrition-recommendations-section" aria-labelledby="weeklyRecommendationHeading">
      <div class="section-heading compact"><div><span class="eyebrow">CHEF NOVA RECOMMENDATIONS</span><h2 id="weeklyRecommendationHeading">Chef Nova Recommendations</h2><p>Suggestions based on your planned meals and available nutrition data.</p></div></div>
      ${dataNote}
      <div class="nutrition-recommendation-grid">${renderedRecommendations.map(recommendationCard).join("")}</div>
      <p class="nutrition-recommendation-disclaimer">These recommendations are simple Chef Nova suggestions based on planned meals and available recipe data. They are not medical or professional dietary advice.</p>
    </section>`;
  }

  function recommendationCard(recommendation) {
    const className = normalizeIngredient(recommendation.type).replace(/\s+/g, "-");
    const action = recommendation.actionLabel && recommendation.actionPage ? `<button class="button secondary small" type="button" data-weekly-recommendation-action="${escapeHtml(recommendation.actionPage)}" data-recommendation-type="${escapeHtml(recommendation.type)}">${escapeHtml(recommendation.actionLabel)}</button>` : "";
    return `<article class="nutrition-recommendation-card recommendation-${className}">
      <span class="recommendation-visual" aria-hidden="true">${recommendationVisual(recommendation.type)}</span>
      <div>
        <span class="recommendation-type">${escapeHtml(recommendation.type.replace(/-/g, " "))}</span>
        <h3>${escapeHtml(recommendation.title)}</h3>
        <p>${escapeHtml(recommendation.message)}</p>
        <p class="recommendation-reason">${escapeHtml(recommendation.reason)}</p>
        ${action}
      </div>
    </article>`;
  }

  function recommendationVisual(type) {
    const visuals = {
      "empty-plan": "Calendar",
      "no-data": "Recipe",
      "missing-data": "Data",
      sugar: "Sugar",
      vegetables: "Greens",
      protein: "Protein",
      positive: "Check"
    };
    return visuals[type] || "Tip";
  }

  function handleWeeklyRecommendationAction(button) {
    const page = button.dataset.weeklyRecommendationAction;
    const type = button.dataset.recommendationType;
    navigate(page);
    if (page !== "recipes") return;
    resetRecipeFinderControls();
    if (type === "vegetables") {
      $("#recipeSearch").value = "vegetable";
    } else if (type === "protein") {
      $("#recipeSearch").value = "protein";
      $("#recipeDietaryFilter").value = "High Protein";
    }
    updateRecipeFilters();
  }

  function resetRecipeFinderControls() {
    $("#recipeSearch").value = "";
    $("#recipeCategoryFilter").value = "All";
    $("#recipeCuisineFilter").value = "All";
    $("#recipeDifficultyFilter").value = "All";
    $("#recipeMaxTimeFilter").value = "";
    $("#recipeDietaryFilter").value = "All";
    $("#hideAllergyRecipesFilter").checked = false;
  }

  function renderRules() {
    renderRuleCategories();
    displayCookingRules(state.ruleFilter);
  }

  function renderRuleCategories() {
    const categories = ["All", "Safety", "Hygiene", "Storage", "Cooking Tips"];
    $("#ruleFilters").innerHTML = categories.map((category) => `<button class="filter-button cooking-filter ${category === state.ruleFilter ? "active" : ""}" data-rule-filter="${category}">${category}</button>`).join("");
    $$("[data-rule-filter]").forEach((button) => button.addEventListener("click", () => filterCookingRules(button.dataset.ruleFilter)));
  }

  function filterCookingRules(category) {
    state.ruleFilter = category || "All";
    renderRuleCategories();
    displayCookingRules(state.ruleFilter);
  }

  function displayCookingRules(category = "All") {
    const rules = window.cookingRules || [];
    const visibleRules = category === "All" ? rules : rules.filter((rule) => rule.category === category);
    $("#ruleList").innerHTML = visibleRules.length ? visibleRules.map((rule) => `<article class="learning-card cooking-rule-card">
      <span class="learning-icon rule-visual">${escapeHtml(rule.visual)}</span>
      <span class="rule-badge">${escapeHtml(rule.category)}</span>
      <h3>${escapeHtml(rule.title)}</h3>
      <p>${escapeHtml(rule.shortDescription)}</p>
      <button class="button secondary small rule-detail-button" data-rule-details="${rule.id}">View Details</button>
    </article>`).join("") : emptyState("No rules found", "Choose another category to keep learning.");
    if (!visibleRules.length) showToast("No matching cooking rules found", "info");
  }

  function openRuleModal(ruleId) {
    const rule = (window.cookingRules || []).find((item) => item.id === ruleId);
    if (!rule) return;
    $("#ruleModalContent").innerHTML = `<div class="rule-modal-heading">
      <span class="rule-badge">${escapeHtml(rule.category)}</span>
      <h2 id="ruleModalTitle">${escapeHtml(rule.title)}</h2>
      <p>${escapeHtml(rule.fullExplanation)}</p>
    </div>
    <div class="rule-detail-section"><h3>Why it matters</h3><p>${escapeHtml(rule.whyItMatters)}</p></div>
    <div class="rule-detail-section"><h3>Step-by-step</h3><ol>${rule.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol></div>
    <div class="rule-detail-section"><h3>Common mistakes</h3><ul>${rule.commonMistakes.map((mistake) => `<li>${escapeHtml(mistake)}</li>`).join("")}</ul></div>
    <div class="rule-example"><h3>Example</h3><p>${escapeHtml(rule.example)}</p></div>`;
    $("#ruleModal").classList.remove("hidden");
    $("#ruleModal").setAttribute("aria-hidden", "false");
  }

  function closeRuleModal() {
    const modal = $("#ruleModal");
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    $("#ruleModalContent").innerHTML = "";
  }

  function showAuthMode(mode) {
    state.authMode = mode === "register" ? "register" : "login"; const register = state.authMode === "register";
    $("#loginForm").classList.toggle("hidden", register); $("#registerForm").classList.toggle("hidden", !register);
    $("#loginTab").classList.toggle("active", !register); $("#registerTab").classList.toggle("active", register);
    clearAllAuthErrors($("#loginForm"));
    clearAllAuthErrors($("#registerForm"));
  }

  /* Create an account and persist the complete profile locally. */
  function createAccount(event) {
    event.preventDefault();
    if (isCreatingAccount) return;
    const form = event.currentTarget;
    clearAllAuthErrors(form);
    const validation = validateSignupForm(form);
    if (!validation.isValid) {
      showAuthErrors(form, validation.errors, "register");
      return;
    }
    const { name, email, password, age, gender, phone, dietaryPreference, allergies } = validation.normalizedData;
    const shouldOfferGuestUpgrade = hasGuestUpgradeSession();
    // SCHOOL PROJECT DEMONSTRATION ONLY:
    // Demo only: passwords are stored locally in plain text.
    // Passwords are stored in localStorage for this front-end demo.
    // This is not secure and must not be used for a real production website.
    // A real website must use a secure backend, password hashing,
    // protected authentication, and server-side storage.
    const nextUsers = [...state.users, { id: generateUserId(state.users), name, email, password, age, gender, phone, dietaryPreference, allergies }];
    const newUser = nextUsers[nextUsers.length - 1];
    isCreatingAccount = true;
    try {
      if (!saveRegisteredUsers(nextUsers)) throw new Error("Invalid account list");
      state.users = nextUsers;
      initializeNewUserStorage(newUser);
      form.reset();
      clearAllAuthErrors(form);
      clearWelcomePasswordFields();
      showToast("Account created successfully.", "success", { saveToHistory: true, actionName: "View Profile", actionTarget: "account" });
      if (shouldOfferGuestUpgrade) {
        showGuestUpgradeModal(newUser);
        return;
      }
      completeNewAccountEntry(newUser);
    } catch (error) {
      console.error("Unable to create account:", error);
      showAuthMessage("register", "Unable to start your login session.", "error");
    } finally {
      isCreatingAccount = false;
    }
  }

  /* Validate credentials against locally stored accounts. */
  function login(event) {
    event.preventDefault();
    if (isLoggingIn) return;
    const form = event.currentTarget;
    clearAllAuthErrors(form);
    const validation = validateLoginForm(form);
    if (!validation.isValid) {
      showAuthErrors(form, validation.errors, "login");
      return;
    }
    isLoggingIn = true;
    try {
      setSession(validation.user, "home");
      form.reset();
      clearAllAuthErrors(form);
      showToast("Login successful.", "success", { saveToHistory: true, actionName: "View Profile", actionTarget: "account" });
    } catch (error) {
      console.error("Unable to start login session:", error);
      return showAuthMessage("login", "Unable to start your login session.", "error");
    } finally {
      isLoggingIn = false;
    }
  }

  function validateSignupForm(form) {
    const data = new FormData(form);
    const errors = {};
    const name = String(data.get("name") || "").trim();
    const email = normalizeEmail(data.get("email"));
    const password = String(data.get("password") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");
    const ageValue = data.get("age");
    const gender = String(data.get("gender") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const dietaryPreference = String(data.get("dietaryPreference") || "").trim();
    const allergiesRaw = String(data.get("allergies") || "").trim();

    if (!name) errors.name = "Please enter your name.";

    if (!email) errors.email = "Please enter your email.";
    else if (!isValidEmail(email)) errors.email = "Please enter a valid email address.";
    else if (findUserByEmail(email)) errors.email = "This email is already registered.";

    if (!password.trim()) errors.password = "Please enter your password.";
    else if (password.length < MIN_PASSWORD_LENGTH) errors.password = "Password must be at least 8 characters.";

    if (!confirmPassword.trim()) errors.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";

    if (!isValidAge(ageValue)) errors.age = "Please enter a valid age.";
    if (form.elements.gender?.required && !gender) errors.gender = "Please complete all required selections.";
    if (form.elements.dietaryPreference?.required && !dietaryPreference) errors.dietaryPreference = "Please complete all required selections.";
    if (form.elements.allergies?.required && !allergiesRaw) errors.allergies = "Please complete all required selections.";

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      normalizedData: {
        name,
        email,
        password,
        age: Number(ageValue),
        gender,
        phone,
        dietaryPreference,
        allergies: normalizeAllergies(allergiesRaw)
      }
    };
  }

  function validateLoginForm(form) {
    const data = new FormData(form);
    const errors = {};
    const email = normalizeEmail(data.get("email"));
    const password = String(data.get("password") || "");

    if (!email) errors.email = "Please enter your email.";
    else if (!isValidEmail(email)) errors.email = "Please enter a valid email address.";
    if (!password.trim()) errors.password = "Please enter your password.";

    if (Object.keys(errors).length) return { isValid: false, errors, user: null };

    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      return { isValid: false, errors: { credentials: "Incorrect email or password." }, user: null };
    }

    return { isValid: true, errors: {}, user };
  }

  function showAuthErrors(form, errors, mode) {
    Object.entries(errors).forEach(([fieldName, message]) => {
      if (fieldName === "credentials") return;
      displayAuthFieldError(form.elements[fieldName], message);
    });
    const firstMessage = errors.credentials || Object.values(errors)[0] || "";
    if (errors.credentials) displayAuthSummaryError(form, errors.credentials);
    else displayAuthSummaryError(form, firstMessage);
    focusFirstInvalidField(form, errors);
    if (firstMessage) showToast(firstMessage, "error");
  }

  function displayAuthFieldError(field, message) {
    if (!field) return;
    field.setAttribute("aria-invalid", "true");
    const errorElement = getAuthFieldErrorElement(field);
    if (!errorElement) return;
    errorElement.textContent = message;
    errorElement.hidden = false;
    const describedBy = new Set(String(field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    describedBy.add(errorElement.id);
    field.setAttribute("aria-describedby", Array.from(describedBy).join(" "));
  }

  function getAuthFieldErrorElement(field) {
    if (!field.id) field.id = `${field.name || "auth"}-${Date.now()}`;
    const errorId = `${field.id}Error`;
    let errorElement = $("#" + errorId);
    if (!errorElement) {
      errorElement = document.createElement("p");
      errorElement.id = errorId;
      errorElement.className = "form-error";
      errorElement.setAttribute("role", "alert");
      errorElement.hidden = true;
      const container = field.closest("label") || field.parentElement;
      container?.appendChild(errorElement);
    }
    return errorElement;
  }

  function displayAuthSummaryError(form, message) {
    const messageTarget = form.querySelector(".form-message");
    if (!messageTarget) return;
    messageTarget.textContent = message || "";
    messageTarget.classList.toggle("form-error-summary", Boolean(message));
    if (message) messageTarget.setAttribute("role", "alert");
    else messageTarget.removeAttribute("role");
  }

  function clearAllAuthErrors(form) {
    if (!form) return;
    form.querySelectorAll("[aria-invalid='true']").forEach(clearAuthFieldError);
    form.querySelectorAll(".form-error").forEach((errorElement) => {
      errorElement.textContent = "";
      errorElement.hidden = true;
    });
    displayAuthSummaryError(form, "");
  }

  function clearAuthFieldError(field) {
    if (!field) return;
    field.removeAttribute("aria-invalid");
    const describedBy = String(field.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter((id) => id && !id.endsWith("Error"));
    if (describedBy.length) field.setAttribute("aria-describedby", describedBy.join(" "));
    else field.removeAttribute("aria-describedby");
  }

  function focusFirstInvalidField(form, errors) {
    const firstFieldName = Object.keys(errors).find((fieldName) => fieldName !== "credentials");
    const field = firstFieldName ? form.elements[firstFieldName] : form.elements.email;
    if (field && typeof field.focus === "function") field.focus();
    else form.querySelector(".form-message")?.focus?.();
  }

  /* Save a minimal session and load the full profile from the users collection. */
  function completeNewAccountEntry(user) {
    if (!user) return;
    closeOpenDialogsForAuthChange();
    clearCurrentPageData();
    clearGuestMode();
    initializeNewUserStorage(user);
    setCurrentUserId(user.id);
    state.currentUser = user;
    state.guestMode = false;
    state.profileMenuOpen = false;
    showNutritionSetupIntro(user);
  }

  function setSession(user, targetPage = "home") {
    closeOpenDialogsForAuthChange();
    clearCurrentPageData();
    clearGuestMode();
    setCurrentUserId(user.id);
    state.currentUser = user;
    state.guestMode = false;
    state.profileMenuOpen = false;
    enterMainApp(user, { navigateHome: false });
    navigate(targetPage);
  }
  // Logging out removes only the active session ID.
  // Registered account information and user-specific progress remain saved.
  function logout() {
    const user = getCurrentUser();
    if (!user || state.guestMode || isGuestMode()) {
      console.warn("Logout ignored because no registered user is active.");
      updateNavigationForCurrentMode();
      renderAccount();
      return;
    }

    try {
      hideNutritionSetupIntro();
      closeOpenDialogsForAuthChange();
      localStorage.removeItem("chefNovaCurrentUser");
      localStorage.removeItem(KEYS.oldSession);
      sessionStorage.removeItem(GUEST_KEYS.mode);
      state.guestMode = false;
      clearRegisteredDashboardState();
      hideMainApp();
      hideNavigation();
      hideGuestBanner();
      showAuthPage();
      selectAuthTab("login", { focus: false });
      focusWelcomeAuthField("login");
      showToast("You have been logged out.", "success");
    } catch (error) {
      console.error("Unable to log out:", error);
      showToast("Unable to log out.", "error");
    }
  }
  function clearAuthInvalidState(form) {
    if (!form) return;
    form.querySelectorAll("[aria-invalid='true']").forEach((field) => {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    });
  }
  function showAuthMessage(mode, message, type = "error", field = null) {
    const selectors = mode === "register" ? ["#registerMessage", "#welcomeRegisterMessage"] : ["#loginMessage", "#welcomeLoginMessage"];
    selectors.forEach((selector) => { const target = $(selector); if (target) target.textContent = message; });
    if (field) {
      const formMessage = field.closest("form")?.querySelector(".form-message");
      field.setAttribute("aria-invalid", "true");
      if (formMessage?.id) field.setAttribute("aria-describedby", formMessage.id);
      field.focus();
    }
    showToast(message, type);
  }
  function notifyInvalidField(field) {
    if (!field) return;
    if (field.name === "quantity") showToast("Please enter a valid quantity", "error");
    else if (field.name === "age") showToast("Please enter a valid age", "error");
    else if (field.name === "phone") showToast("Please enter a valid phone number", "error");
    else if (field.type === "email") showToast("Invalid email format", "error");
    else if (field.type === "password") showToast("Weak or invalid password", "error");
    else showToast("Please enter all required fields", "error");
  }

  /* Save important toast activity to the dedicated Notifications page. */
  function addNotification(message, type = "info", options = {}) {
    const safeType = ["success", "error", "warning", "info"].includes(type) ? type : "info";
    const notifications = getNotifications();
    const now = new Date();
    const duplicate = notifications.find((item) => item.message === message && item.type === safeType && now - new Date(item.timestamp) < 5000);
    if (duplicate) return duplicate.id;
    const notification = {
      id: "notification-" + now.getTime() + "-" + Math.random().toString(36).slice(2, 8),
      message,
      type: safeType,
      timestamp: now.toISOString(),
      isRead: Boolean(options.isRead),
      actionName: options.actionName || "",
      actionTarget: options.actionTarget || ""
    };
    saveNotifications([notification, ...notifications].slice(0, 100));
    updateNotificationBadge();
    if (isPageVisible("notifications")) displayNotifications();
    return notification.id;
  }

  function getNotifications() {
    if (state.guestMode) return guestSessionData.notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const notifications = readUserStorage(KEYS.notifications, []);
    return Array.isArray(notifications) ? notifications.filter((item) => item && item.id && item.message).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) : [];
  }

  function saveNotifications(notifications) {
    if (state.guestMode) {
      guestSessionData.notifications = Array.isArray(notifications) ? notifications : [];
      persistGuestProgress();
      return false;
    }
    writeUserStorage(KEYS.notifications, Array.isArray(notifications) ? notifications : []);
    return true;
  }

  function displayNotifications() {
    const list = $("#notificationList");
    if (!list) return;
    const notifications = filterNotificationList(getNotifications(), state.notificationFilter);
    updateNotificationBadge();
    updateNotificationFilters();
    const unreadCount = getUnreadNotificationCount();
    $("#notificationsUnreadCount").textContent = String(unreadCount);
    const notice = state.guestMode ? guestNotice("Guest Notifications", "Guest notifications are available only during this session.") : "";
    list.innerHTML = notice + (notifications.length ? notifications.map(notificationCard).join("") : notificationEmptyState());
  }

  function notificationCard(notification) {
    const typeLabel = notificationTypeLabel(notification.type);
    const status = notification.isRead ? "Read" : "Unread";
    return `<article class="notification-card ${notification.isRead ? "read" : "unread"} notification-${notification.type}" role="listitem">
      <div class="notification-type-icon" aria-hidden="true">${notificationIcon(notification.type)}</div>
      <div class="notification-card-body">
        <div class="notification-card-topline">
          <span class="notification-type-label">${typeLabel}</span>
          <span class="notification-status">${status}</span>
        </div>
        <h2>${escapeHtml(notification.message)}</h2>
        <time datetime="${escapeHtml(notification.timestamp)}">${formatNotificationTime(notification.timestamp)}</time>
        <div class="notification-card-actions">
          ${notification.actionName && notification.actionTarget ? `<button class="button primary small" type="button" data-notification-action="${notification.id}">${escapeHtml(notification.actionName)}</button>` : ""}
          ${notification.isRead ? "" : `<button class="button secondary small" type="button" data-notification-read="${notification.id}">Mark as Read</button>`}
          <button class="button secondary small delete-notification-button" type="button" data-notification-delete="${notification.id}" aria-label="Delete notification">Delete</button>
        </div>
      </div>
    </article>`;
  }

  function markNotificationAsRead(notificationId) {
    const notifications = getNotifications().map((notification) => notification.id === notificationId ? { ...notification, isRead: true } : notification);
    saveNotifications(notifications);
    displayNotifications();
    updateNotificationBadge();
  }

  function markAllNotificationsAsRead() {
    const notifications = getNotifications();
    if (!notifications.length) return showToast("No notifications yet", "info");
    saveNotifications(notifications.map((notification) => ({ ...notification, isRead: true })));
    displayNotifications();
    updateNotificationBadge();
    showToast(state.guestMode ? "Guest notifications marked as read for this session." : "All notifications marked as read.", state.guestMode ? "info" : "success");
  }

  function deleteNotification(notificationId) {
    saveNotifications(getNotifications().filter((notification) => notification.id !== notificationId));
    displayNotifications();
    updateNotificationBadge();
  }

  function clearAllNotifications() {
    saveNotifications([]);
    closeClearNotificationsConfirm();
    displayNotifications();
    updateNotificationBadge();
    showToast(state.guestMode ? "Guest notification history cleared for this session." : "Notification history cleared", state.guestMode ? "info" : "success");
  }

  function getUnreadNotificationCount() {
    return Math.max(0, getNotifications().filter((notification) => !notification.isRead).length);
  }

  function updateNotificationBadge() {
    const badge = $("#notificationBadge");
    if (!badge) return;
    const count = getUnreadNotificationCount();
    badge.textContent = count > 99 ? "99+" : String(count);
    badge.classList.toggle("hidden", count <= 0);
    badge.setAttribute("aria-label", `${count} unread notifications`);
    const unreadCount = $("#notificationsUnreadCount");
    if (unreadCount) unreadCount.textContent = String(count);
  }

  function filterNotifications(filterType) {
    state.notificationFilter = filterType || "All";
    displayNotifications();
  }

  function filterNotificationList(notifications, filterType) {
    if (filterType === "Unread") return notifications.filter((notification) => !notification.isRead);
    if (["success", "error", "warning", "info"].includes(filterType)) return notifications.filter((notification) => notification.type === filterType);
    return notifications;
  }

  function updateNotificationFilters() {
    $$("[data-notification-filter]").forEach((button) => button.classList.toggle("active", button.dataset.notificationFilter === state.notificationFilter));
  }

  function openNotificationAction(notificationId) {
    const notification = getNotifications().find((item) => item.id === notificationId);
    if (!notification) return;
    markNotificationAsRead(notificationId);
    if (notification.actionTarget) navigate(notification.actionTarget);
  }

  function openClearNotificationsConfirm() {
    const modal = $("#notificationConfirmModal");
    if (!modal) return;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeClearNotificationsConfirm() {
    const modal = $("#notificationConfirmModal");
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  function notificationEmptyState() {
    return `<div class="empty-state notification-empty-state" role="listitem">
      <span class="empty-bell" aria-hidden="true">${notificationIcon("info")}</span>
      <h3>No notifications yet</h3>
      <p>Important updates and activity from Chef Nova will appear here.</p>
    </div>`;
  }

  function formatNotificationTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.max(0, Math.floor((now - date) / 1000));
    if (Number.isNaN(date.getTime())) return "Just now";
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  }

  function notificationTypeLabel(type) {
    return { success: "Success", error: "Error", warning: "Warning", info: "Information" }[type] || "Information";
  }

  function notificationIcon(type) {
    const paths = {
      success: '<path d="M20 6 9 17l-5-5"></path>',
      error: '<path d="M12 8v5"></path><path d="M12 17h.01"></path><path d="M4.9 19.1 12 4l7.1 15.1H4.9Z"></path>',
      warning: '<path d="M12 7v6"></path><path d="M12 17h.01"></path><path d="M3 20h18L12 4 3 20Z"></path>',
      info: '<path d="M12 11v6"></path><path d="M12 7h.01"></path><circle cx="12" cy="12" r="9"></circle>'
    };
    return `<svg viewBox="0 0 24 24" focusable="false">${paths[type] || paths.info}</svg>`;
  }

  function isPageVisible(page) {
    const section = $(`[data-page-section="${page}"]`);
    return Boolean(section && section.classList.contains("active"));
  }

  function daysUntil(date) { if (!date) return Infinity; const today = new Date(); today.setHours(0,0,0,0); return Math.ceil((new Date(date + "T00:00:00") - today) / 86400000); }
  function formatDate(date) { return new Date(date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
  }
  function isValidPhone(phone) {
    return /^[+()\d\s.-]{7,24}$/.test(String(phone || "").trim());
  }
  function normalizeAllergies(value) {
    const items = (Array.isArray(value) ? value : String(value || "").split(/,|;/)).map((item) => String(item || "").trim()).filter(Boolean);
    const seen = new Set();
    return items.filter((item) => {
      const normalized = normalizeIngredient(item);
      if (!normalized || normalized === "none" || normalized === "no allergy" || normalized === "no allergies") return false;
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
  }
  function formatAllergies(value) {
    const allergies = normalizeAllergies(value);
    return allergies.length ? allergies.join(", ") : "None listed";
  }
  function formatAllergiesForInput(value) {
    return normalizeAllergies(value).join(", ");
  }
  function normalizeIngredient(value) {
    let normalized = String(value || "").toLowerCase().trim().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ");
    if (normalized.endsWith("ies")) normalized = normalized.slice(0, -3) + "y";
    else if (normalized.endsWith("oes")) normalized = normalized.slice(0, -2);
    else if (normalized.endsWith("s") && !normalized.endsWith("ss")) normalized = normalized.slice(0, -1);
    return normalized;
  }
  function emptyState(title, copy, label, page) { return `<div class="empty-state"><span>✦</span><h3>${title}</h3><p>${copy}</p>${label ? `<button class="button primary" data-page="${page}">${label}</button>` : ""}</div>`; }
  function guestNotice(title, copy) { return `<div class="guest-page-notice" role="status"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(copy)}</span></div>`; }
  function escapeHtml(value) { return String(value == null ? "" : value).replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]); }
  /* Create a reusable stacked toast notification with typed styles and duplicate throttling. */
  function showToast(message, type = "info", options = {}) {
    const container = $("#toastContainer");
    if (!container || !message) return "";
    const safeType = ["success", "error", "warning", "info"].includes(type) ? type : "info";
    const duplicateKey = `${safeType}:${message}`;
    const now = Date.now();
    if (recentToasts.has(duplicateKey) && now - recentToasts.get(duplicateKey) < 1000) return "";
    recentToasts.set(duplicateKey, now);
    if (options.saveToHistory) addNotification(message, safeType, options);
    const toastId = "toast-" + now + "-" + Math.random().toString(36).slice(2, 7);
    const toast = document.createElement("div");
    toast.className = `toast toast-${safeType}`;
    toast.id = toastId;
    toast.setAttribute("role", "status");
    toast.innerHTML = `<div class="toast-icon" aria-hidden="true">${toastVisual(safeType)}</div><p>${escapeHtml(message)}</p><button class="toast-close" type="button" aria-label="Close notification">×</button>`;
    $(".toast-close", toast).addEventListener("click", () => removeToast(toastId));
    container.appendChild(toast);
    window.setTimeout(() => toast.classList.add("show"), 20);
    window.setTimeout(() => removeToast(toastId), 4000);
    return toastId;
  }

  function notifySafely(message, type = "info", options = {}) {
    try {
      const toastId = showToast(message, type, options);
      if (toastId || !message) return toastId;
      console.log(`[${type}] ${message}`);
      return "";
    } catch (error) {
      console.log(`[${type}] ${message}`);
      return "";
    }
  }

  function removeToast(toastId) {
    const toast = $("#" + toastId);
    if (!toast || toast.classList.contains("closing")) return;
    toast.classList.add("closing");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
    window.setTimeout(() => { if (toast.isConnected) toast.remove(); }, 450);
  }

  function toastVisual(type) {
    return { success: "OK", error: "!", warning: "!", info: "i" }[type] || "i";
  }
  window.showToast = showToast;
  window.removeToast = removeToast;
  window.generatePersonalizedMealPlan = generatePersonalizedMealPlan;
  initialize();
})();
