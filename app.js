/* Chef Nova front-end application. All personal data is stored locally in the browser. */
(function () {
  "use strict";

  const KEYS = { users: "chefNova.users", session: "chefNova.session", favorites: "chefNovaFavorites", oldFavorites: "chefNova.favorites", pantry: "chefNova.pantry", plans: "chefNovaMealPlan", oldPlans: "chefNova.mealPlans" };
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const MEALS = ["Breakfast", "Lunch", "Dinner"];
  const BUILT_IN_RECIPES = [
    { id: "pasta", name: "Pasta", imagePlaceholder: "Pasta bowl", ingredients: ["pasta", "tomato sauce", "garlic", "olive oil", "parmesan", "basil"], steps: ["Boil pasta until al dente.", "Warm olive oil and garlic in a pan.", "Stir in tomato sauce and simmer for 5 minutes.", "Toss pasta with sauce, parmesan, and basil."], cookingTime: "25 min", difficulty: "Easy", calories: 520, protein: "18g", allergyWarnings: ["Gluten", "Dairy"] },
    { id: "fried-rice", name: "Fried Rice", imagePlaceholder: "Rice skillet", ingredients: ["rice", "eggs", "peas", "carrots", "soy sauce", "green onion"], steps: ["Scramble eggs and set aside.", "Stir-fry carrots and peas until tender.", "Add rice and soy sauce.", "Fold in eggs and green onion before serving."], cookingTime: "20 min", difficulty: "Easy", calories: 430, protein: "14g", allergyWarnings: ["Eggs", "Soy", "Gluten"] },
    { id: "chicken-wrap", name: "Chicken Wrap", imagePlaceholder: "Wrapped tortilla", ingredients: ["chicken", "tortilla", "lettuce", "tomato", "cheddar", "yogurt sauce"], steps: ["Warm the tortilla.", "Slice cooked chicken.", "Layer lettuce, tomato, chicken, cheddar, and sauce.", "Roll tightly and toast if desired."], cookingTime: "15 min", difficulty: "Easy", calories: 470, protein: "32g", allergyWarnings: ["Gluten", "Dairy"] },
    { id: "vegetable-soup", name: "Vegetable Soup", imagePlaceholder: "Soup pot", ingredients: ["carrots", "celery", "onion", "potatoes", "vegetable stock", "tomato"], steps: ["Saute onion, carrots, and celery.", "Add potatoes, tomato, and vegetable stock.", "Simmer until vegetables are tender.", "Season and serve warm."], cookingTime: "40 min", difficulty: "Easy", calories: 260, protein: "8g", allergyWarnings: ["None"] },
    { id: "omelette", name: "Omelette", imagePlaceholder: "Golden omelette", ingredients: ["eggs", "milk", "cheddar", "spinach", "mushrooms", "butter"], steps: ["Whisk eggs with milk.", "Cook mushrooms and spinach in butter.", "Pour in eggs and cook gently.", "Add cheddar, fold, and serve."], cookingTime: "12 min", difficulty: "Easy", calories: 350, protein: "24g", allergyWarnings: ["Eggs", "Dairy"] },
    { id: "salmon-bowl", name: "Salmon Bowl", imagePlaceholder: "Salmon rice bowl", ingredients: ["salmon", "rice", "cucumber", "avocado", "soy sauce", "sesame seeds"], steps: ["Cook rice.", "Sear or bake salmon until flaky.", "Slice cucumber and avocado.", "Assemble the bowl with soy sauce and sesame seeds."], cookingTime: "30 min", difficulty: "Medium", calories: 610, protein: "38g", allergyWarnings: ["Fish", "Soy", "Sesame"] },
    { id: "beef-stir-fry", name: "Beef Stir Fry", imagePlaceholder: "Stir fry wok", ingredients: ["beef", "broccoli", "bell pepper", "garlic", "soy sauce", "rice"], steps: ["Slice beef thinly.", "Stir-fry beef until browned.", "Add broccoli, bell pepper, and garlic.", "Finish with soy sauce and serve over rice."], cookingTime: "25 min", difficulty: "Medium", calories: 560, protein: "36g", allergyWarnings: ["Soy", "Gluten"] },
    { id: "tofu-noodles", name: "Tofu Noodles", imagePlaceholder: "Noodle bowl", ingredients: ["tofu", "noodles", "broccoli", "carrots", "soy sauce", "ginger"], steps: ["Press and cube tofu.", "Cook noodles.", "Stir-fry tofu, broccoli, carrots, and ginger.", "Toss with noodles and soy sauce."], cookingTime: "25 min", difficulty: "Easy", calories: 480, protein: "22g", allergyWarnings: ["Soy", "Gluten"] },
    { id: "pancakes", name: "Pancakes", imagePlaceholder: "Pancake stack", ingredients: ["flour", "eggs", "milk", "baking powder", "butter", "maple syrup"], steps: ["Whisk dry ingredients.", "Mix in eggs and milk.", "Cook batter on a buttered skillet.", "Serve with maple syrup."], cookingTime: "20 min", difficulty: "Easy", calories: 430, protein: "12g", allergyWarnings: ["Gluten", "Eggs", "Dairy"] },
    { id: "caesar-salad", name: "Caesar Salad", imagePlaceholder: "Crisp salad", ingredients: ["romaine", "croutons", "parmesan", "caesar dressing", "lemon", "black pepper"], steps: ["Chop romaine.", "Toss with caesar dressing and lemon.", "Add croutons and parmesan.", "Finish with black pepper."], cookingTime: "10 min", difficulty: "Easy", calories: 310, protein: "11g", allergyWarnings: ["Gluten", "Dairy", "Fish"] },
    { id: "chicken-curry", name: "Chicken Curry", imagePlaceholder: "Curry bowl", ingredients: ["chicken", "rice", "coconut milk", "curry powder", "onion", "garlic"], steps: ["Saute onion and garlic.", "Add chicken and curry powder.", "Pour in coconut milk and simmer.", "Serve over rice."], cookingTime: "35 min", difficulty: "Medium", calories: 650, protein: "40g", allergyWarnings: ["None"] },
    { id: "smoothie-bowl", name: "Smoothie Bowl", imagePlaceholder: "Fruit smoothie bowl", ingredients: ["banana", "berries", "yogurt", "granola", "honey", "chia seeds"], steps: ["Blend banana, berries, and yogurt.", "Pour into a bowl.", "Top with granola, honey, and chia seeds.", "Serve cold."], cookingTime: "8 min", difficulty: "Easy", calories: 390, protein: "16g", allergyWarnings: ["Dairy", "Gluten"] }
  ];
  const STARTER = {
    recipes: BUILT_IN_RECIPES,
    users: [{ id: "demo", name: "Nova Cook", email: "demo@chefnova.local", password: "demo123", age: 28, gender: "Prefer not to say", phone: "", dietaryPreference: "No preference", allergies: "None" }],
    pantry: [
      { id: "p1", name: "Cherry tomatoes", quantity: 2, category: "Vegetables", expirationDate: "2026-07-12" },
      { id: "p2", name: "Eggs", quantity: 8, category: "Dairy", expirationDate: "2026-07-18" },
      { id: "p3", name: "Pasta", quantity: 1, category: "Grains", expirationDate: "2027-01-20" },
      { id: "p4", name: "Parmesan", quantity: 1, category: "Dairy", expirationDate: "2026-07-22" }
    ],
    mealPlans: {
      Monday: { Breakfast: "Omelette", Lunch: "Chicken Wrap", Dinner: "Pasta" },
      Tuesday: { Breakfast: "Pancakes", Lunch: "Caesar Salad", Dinner: "Chicken Curry" },
      Wednesday: { Breakfast: "", Lunch: "", Dinner: "" },
      Thursday: { Breakfast: "", Lunch: "", Dinner: "" },
      Friday: { Breakfast: "", Lunch: "", Dinner: "Salmon Bowl" },
      Saturday: { Breakfast: "", Lunch: "", Dinner: "" },
      Sunday: { Breakfast: "Smoothie Bowl", Lunch: "", Dinner: "Vegetable Soup" }
    }
  };
  const INSTRUCTION_STEPS = [
    { id: 1, title: "Create an Account", shortDescription: "Save your cooking profile and food needs.", whatItDoes: "Saves your profile and preferences.", howToUse: "Click Create Account, enter name, email, password, age, gender, optional phone number, dietary preference, and allergies.", example: "If your allergy is peanuts, type \"peanuts\" in the allergies field.", tip: "Use accurate allergies so Chef Nova can warn you." },
    { id: 2, title: "Search for Recipes", shortDescription: "Find recipes from ingredients you already have.", whatItDoes: "Finds recipes based on ingredients you already have.", howToUse: "Go to AI Recipe Finder, enter ingredients separated by commas, then click Search Recipes.", example: "chicken, rice, eggs", tip: "Add more ingredients for better recipe matches." },
    { id: 3, title: "Track Pantry Items", shortDescription: "Keep ingredient quantities and expiry dates organized.", whatItDoes: "Keeps track of ingredients, quantities, categories, and expiry dates.", howToUse: "Go to Pantry Tracker, enter ingredient name, number quantity, category, and expiration date.", example: "Milk, Quantity 1, Dairy, July 20.", tip: "Check the Expiring Soon label before cooking." },
    { id: 4, title: "Create a Meal Plan", shortDescription: "Plan breakfast, lunch, and dinner by day.", whatItDoes: "Helps plan breakfast, lunch, and dinner for each day.", howToUse: "Go to Meal Planner, choose a day button, then add meals for breakfast, lunch, and dinner.", example: "Monday Breakfast: Omelette.", tip: "Save your weekly plan after editing." },
    { id: 5, title: "Use Favorites", shortDescription: "Save recipes you want to find again quickly.", whatItDoes: "Saves recipes you like.", howToUse: "Click Favorite on any recipe card. Go to Favorites to view saved recipes.", example: "Save Chicken Curry so you can find it quickly later.", tip: "Remove favorites you no longer need." },
    { id: 6, title: "Learn Cooking Rules", shortDescription: "Review safety, hygiene, storage, and cooking tips.", whatItDoes: "Teaches safety, hygiene, storage, and cooking tips.", howToUse: "Go to Cooking Rules, choose a category, then click View Details on a rule.", example: "Safety rules explain how to handle raw chicken safely.", tip: "Read rules before trying a new cooking skill." },
    { id: 7, title: "Use the Shopping List", shortDescription: "Track ingredients you still need to buy.", whatItDoes: "Helps track ingredients you still need to buy.", howToUse: "Add items manually or add missing ingredients from a recipe.", example: "If a recipe needs soy sauce and you do not have it, add it to the shopping list.", tip: "Check off items after buying them." }
  ];

  const state = { recipes: [], users: [], pantry: [], favorites: [], mealPlans: {}, currentUser: null, authMode: "login", ruleFilter: "All", activeMealDay: "Monday" };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const read = (key, fallback) => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch (_) { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  async function loadStarter(path, fallback) {
    if (location.protocol === "file:") return fallback;
    try { const response = await fetch(path); if (!response.ok) throw new Error("Unavailable"); return await response.json(); }
    catch (_) { return fallback; }
  }

  /* Load recipe data from recipes.json, with the same recipes built in for direct file opening. */
  async function loadRecipes() {
    return loadStarter("data/recipes.json", STARTER.recipes);
  }

  async function initialize() {
    const [recipes, users, pantry, plans] = await Promise.all([
      loadRecipes(), loadStarter("data/users.json", STARTER.users),
      loadStarter("data/pantry.json", STARTER.pantry), loadStarter("data/mealPlans.json", STARTER.mealPlans)
    ]);
    state.recipes = recipes;
    state.users = read(KEYS.users, users);
    state.pantry = loadPantryFromStorage(pantry);
    state.favorites = loadFavorites();
    state.mealPlans = loadMealPlan(plans);
    state.currentUser = read(KEYS.session, null);
    bindEvents(); renderAll(); navigate(location.hash.slice(1) || "home");
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const pageTarget = event.target.closest("[data-page]");
      if (pageTarget) { event.preventDefault(); navigate(pageTarget.dataset.page); }
      const instructionDetails = event.target.closest("[data-instruction-details]");
      if (instructionDetails) openInstructionModal(Number(instructionDetails.dataset.instructionDetails));
      const favorite = event.target.closest("[data-favorite]");
      if (favorite) toggleFavorite(favorite.dataset.favorite);
      const removeFavoriteButton = event.target.closest("[data-remove-favorite]");
      if (removeFavoriteButton) removeFavorite(removeFavoriteButton.dataset.removeFavorite);
      const favoriteStepsButton = event.target.closest("[data-favorite-steps]");
      if (favoriteStepsButton) openFavoriteRecipeModal(favoriteStepsButton.dataset.favoriteSteps);
      const remove = event.target.closest("[data-remove-pantry]");
      if (remove) removePantryItem(remove.dataset.removePantry);
      const ruleDetails = event.target.closest("[data-rule-details]");
      if (ruleDetails) openRuleModal(Number(ruleDetails.dataset.ruleDetails));
      const auth = event.target.closest("[data-auth]");
      if (auth && auth.dataset.auth === "logout") logout();
      const authMode = event.target.closest("[data-auth-mode]");
      if (authMode) { event.preventDefault(); showAuthMode(authMode.dataset.authMode); navigate("account"); }
    });
    $("#menuButton").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
    $("#recipeSearchButton").addEventListener("click", searchRecipes);
    $("#recipeSearch").addEventListener("input", searchRecipes);
    $("#clearRecipeSearchButton").addEventListener("click", clearRecipeSearch);
    $("#showPantryForm").addEventListener("click", () => $("#pantryForm input[name='name']").focus());
    $("#pantryForm").addEventListener("submit", addPantryItem);
    $("#saveWeeklyPlanButton").addEventListener("click", () => { saveMealPlan(); toast("Weekly plan saved"); });
    $("#mealPlanner").addEventListener("click", (event) => {
      const dayTab = event.target.closest("[data-meal-day]");
      if (dayTab) return setActiveMealDay(dayTab.dataset.mealDay);
      const action = event.target.closest("[data-meal-action]");
      if (!action) return;
      const { day, meal, mealAction } = action.dataset;
      if (mealAction === "add") addMeal(day, meal);
      if (mealAction === "edit") editMeal(day, meal);
      if (mealAction === "delete") deleteMeal(day, meal);
    });
    $("#mealPlanner").addEventListener("change", (event) => {
      const select = event.target.closest("[data-meal-select]");
      if (!select) return;
      const input = $(`[data-meal-input="${select.dataset.mealSelect}"]`);
      if (input && select.value) input.value = select.value;
    });
    $("#loginForm").addEventListener("submit", login);
    $("#registerForm").addEventListener("submit", createAccount);
    $("#ruleModalClose").addEventListener("click", closeRuleModal);
    $("#ruleModal").addEventListener("click", (event) => { if (event.target.id === "ruleModal") closeRuleModal(); });
    $("#favoriteRecipeModalClose").addEventListener("click", closeFavoriteRecipeModal);
    $("#favoriteRecipeModal").addEventListener("click", (event) => { if (event.target.id === "favoriteRecipeModal") closeFavoriteRecipeModal(); });
    $("#instructionModalClose").addEventListener("click", closeInstructionModal);
    $("#instructionModal").addEventListener("click", (event) => { if (event.target.id === "instructionModal") closeInstructionModal(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeRuleModal(); closeFavoriteRecipeModal(); closeInstructionModal(); } });
    window.addEventListener("hashchange", () => navigate(location.hash.slice(1) || "home", false));
  }

  function navigate(page, updateHash = true) {
    if (!$("[data-page-section='" + page + "']")) page = "home";
    $$(".page").forEach((el) => el.classList.toggle("active", el.dataset.pageSection === page));
    $$(".nav-link").forEach((el) => el.classList.toggle("active", el.dataset.page === page));
    if (updateHash && location.hash !== "#" + page) history.pushState(null, "", "#" + page);
    $("#sidebar").classList.remove("open"); window.scrollTo(0, 0);
    if (page === "favorites") renderFavorites();
    if (page === "account") renderAccountPage();
  }

  function renderAll() { renderAccount(); renderAccountPage(); searchRecipes(); renderPantry(); renderPlanner(); renderFavorites(); renderRules(); displayInstructions(); }

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
    $("#instructionModalContent").innerHTML = `<div class="instruction-modal-heading">
      <span class="instruction-step-badge">Step ${step.id}</span>
      <h2 id="instructionModalTitle">${escapeHtml(step.title)}</h2>
    </div>
    <div class="instruction-detail-section"><h3>What this feature does</h3><p>${escapeHtml(step.whatItDoes)}</p></div>
    <div class="instruction-detail-section"><h3>How to use it</h3><p>${escapeHtml(step.howToUse)}</p></div>
    <div class="instruction-example"><h3>Example</h3><p>${escapeHtml(step.example)}</p></div>
    <div class="instruction-detail-section"><h3>Helpful tip</h3><p>${escapeHtml(step.tip)}</p></div>`;
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
  function renderAccount() {
    $("#accountArea").innerHTML = state.currentUser
      ? `<span class="user-greeting">Hi, ${escapeHtml(state.currentUser.name.split(" ")[0])}</span><button class="avatar" data-page="account" title="View profile">${escapeHtml(state.currentUser.name.charAt(0).toUpperCase())}</button>`
      : `<button class="button small secondary" data-auth-mode="login">Sign in</button>`;
  }

  function renderAccountPage() {
    const guest = $("#accountGuest"); const profile = $("#accountProfile");
    guest.classList.toggle("hidden", Boolean(state.currentUser)); profile.classList.toggle("hidden", !state.currentUser);
    if (!state.currentUser) return;
    const user = state.users.find((candidate) => candidate.id === state.currentUser.id) || state.currentUser;
    const details = [["Email", user.email], ["Age", user.age || "Not provided"], ["Gender", user.gender || "Not provided"], ["Phone", user.phone || "Not provided"], ["Dietary preference", user.dietaryPreference || "No preference"], ["Allergies", user.allergies || "None listed"]];
    profile.innerHTML = `<div class="profile-hero"><div class="profile-avatar">${escapeHtml(user.name.charAt(0).toUpperCase())}</div><div><span class="eyebrow">CURRENT COOK</span><h2>${escapeHtml(user.name)}</h2><p>Chef Nova member · Profile saved on this device</p></div><button class="button secondary profile-logout" data-auth="logout">Logout</button></div><div class="profile-details">${details.map(([label, value]) => `<div class="profile-detail"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}</div><div class="profile-actions"><button class="feature-card mini accent-sage" data-page="favorites"><span class="feature-icon">♡</span><h3>${state.favorites.length} favorites</h3><span class="card-link">View cookbook →</span></button><button class="feature-card mini accent-peach" data-page="pantry"><span class="feature-icon">◫</span><h3>${state.pantry.length} pantry items</h3><span class="card-link">Open pantry →</span></button><button class="feature-card mini accent-gold" data-page="planner"><span class="feature-icon">▦</span><h3>Weekly plan</h3><span class="card-link">View meals →</span></button></div>`;
  }

  /* Search recipes by comma-separated ingredients and show best matches first. */
  function searchRecipes() {
    const userIngredients = ($("#recipeSearch").value || "").split(",").map((item) => item.trim()).filter(Boolean);
    const results = userIngredients.length
      ? state.recipes.map((recipe) => matchIngredients(userIngredients, recipe)).sort((a, b) => b.matchScore - a.matchScore || a.missingIngredients.length - b.missingIngredients.length)
      : state.recipes.map((recipe) => ({ ...recipe, matchedIngredients: [], missingIngredients: [] }));
    displayRecipeResults(results);
  }

  /* Compare user ingredients with one recipe's ingredient list. */
  function matchIngredients(userIngredients, recipe) {
    const owned = userIngredients.map(normalizeIngredient);
    const matchedIngredients = recipe.ingredients.filter((ingredient) => owned.some((item) => normalizeIngredient(ingredient).includes(item) || item.includes(normalizeIngredient(ingredient))));
    const missingIngredients = recipe.ingredients.filter((ingredient) => !matchedIngredients.includes(ingredient));
    return { ...recipe, matchedIngredients, missingIngredients, matchScore: matchedIngredients.length };
  }

  /* Render all recipe cards plus the finder favorites area. */
  function displayRecipeResults(results) {
    $("#recipeResults").innerHTML = results.length ? results.map(recipeCard).join("") : emptyState("No recipes found", "Try a broader ingredient list.");
    displayFinderFavorites();
  }

  function recipeCard(recipe, favoriteView = false) {
    const saved = isRecipeFavorite(recipe.id);
    const warnings = Array.isArray(recipe.allergyWarnings) ? recipe.allergyWarnings : [recipe.allergyWarnings || "None"];
    return `<article class="recipe-card expanded">
      <div class="recipe-image placeholder"><span>${escapeHtml(recipe.imagePlaceholder || recipe.name)}</span><button class="favorite-button ${saved ? "saved" : ""}" data-favorite="${recipe.id}" aria-label="${saved ? "Remove from" : "Add to"} favorites">${saved ? "♥" : "♡"}</button></div>
      <div class="recipe-body">
        <div class="recipe-meta"><span>◷ ${escapeHtml(recipe.cookingTime || recipe.time + " min")}</span><span>${escapeHtml(recipe.difficulty)}</span><span>${escapeHtml(recipe.calories)} cal</span><span>${escapeHtml(recipe.protein)} protein</span></div>
        <h3>${escapeHtml(recipe.name)}</h3>
        <div class="ingredient-block"><b>Ingredients</b><div class="ingredient-tags">${recipe.ingredients.map((i) => `<span>${escapeHtml(i)}</span>`).join("")}</div></div>
        <div class="ingredient-block"><b>Matched</b><div class="ingredient-tags matched-tags">${(recipe.matchedIngredients || []).length ? recipe.matchedIngredients.map((i) => `<span>${escapeHtml(i)}</span>`).join("") : `<span>Search to match ingredients</span>`}</div></div>
        <div class="ingredient-block"><b>Missing ingredients</b><div class="ingredient-tags missing-tags">${(recipe.missingIngredients || []).length ? recipe.missingIngredients.map((i) => `<span>${escapeHtml(i)}</span>`).join("") : `<span>None</span>`}</div></div>
        <div class="steps-block"><b>Cooking steps</b><ol>${recipe.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol></div>
        <div class="allergy-warning"><b>Allergy warnings:</b> ${warnings.map(escapeHtml).join(", ")}</div>
        ${favoriteView ? `<button class="button secondary full remove-favorite-button" data-remove-favorite="${recipe.id}">Remove favorite</button>` : ""}
      </div>
    </article>`;
  }

  function toggleFavorite(id) {
    if (isRecipeFavorite(id)) removeFavorite(id); else saveFavorite(id);
  }

  /* Save one recipe id to localStorage under chefNovaFavorites. */
  function saveFavorite(id) {
    state.favorites = Array.from(new Set([...state.favorites, id]));
    write(KEYS.favorites, state.favorites); searchRecipes(); displayFavoritesPage(); renderAccountPage(); toast("Saved to favorites");
  }

  /* Remove one recipe id from localStorage favorites. */
  function removeFavorite(id) {
    state.favorites = state.favorites.filter((item) => item !== id);
    write(KEYS.favorites, state.favorites); searchRecipes(); displayFavoritesPage(); renderAccountPage(); toast("Removed from favorites");
  }

  /* Read favorites and migrate the older Step 2 key if it exists. */
  function loadFavorites() {
    const saved = read(KEYS.favorites, null);
    if (saved) return Array.from(new Set(saved));
    const olderFavorites = read(KEYS.oldFavorites, []);
    const uniqueFavorites = Array.from(new Set(olderFavorites));
    if (uniqueFavorites.length) write(KEYS.favorites, uniqueFavorites);
    return uniqueFavorites;
  }

  function isRecipeFavorite(recipeId) {
    return state.favorites.includes(recipeId);
  }

  /* Clear the ingredient search input and restore the full recipe list. */
  function clearRecipeSearch() {
    $("#recipeSearch").value = "";
    searchRecipes();
  }

  function renderFavorites() {
    displayFavoritesPage();
  }

  function displayFavoritesPage() {
    const recipes = state.recipes.filter((recipe) => isRecipeFavorite(recipe.id));
    $("#favoriteResults").innerHTML = recipes.length ? recipes.map(favoriteRecipeCard).join("") : emptyState("No favorite recipes yet.", "Go to AI Recipe Finder to save recipes.", "AI Recipe Finder", "recipes");
    displayFinderFavorites();
  }

  function favoriteRecipeCard(recipe) {
    const warnings = Array.isArray(recipe.allergyWarnings) ? recipe.allergyWarnings : [recipe.allergyWarnings || "None"];
    return `<article class="favorite-recipe-card">
      <div class="favorite-recipe-image"><span>${escapeHtml(recipe.imagePlaceholder || recipe.name)}</span></div>
      <div class="favorite-recipe-body">
        <div class="recipe-meta"><span>◷ ${escapeHtml(recipe.cookingTime)}</span><span>${escapeHtml(recipe.difficulty)}</span><span>${escapeHtml(recipe.calories)} cal</span><span>${escapeHtml(recipe.protein)} protein</span></div>
        <h3>${escapeHtml(recipe.name)}</h3>
        <div class="ingredient-block"><b>Ingredients</b><div class="ingredient-tags">${recipe.ingredients.map((ingredient) => `<span>${escapeHtml(ingredient)}</span>`).join("")}</div></div>
        <div class="allergy-warning"><b>Allergy warnings:</b> ${warnings.map(escapeHtml).join(", ")}</div>
        <div class="favorite-card-actions">
          <button class="button primary small" data-favorite-steps="${recipe.id}">View Cooking Steps</button>
          <button class="button secondary small remove-favorite-card-button" data-remove-favorite="${recipe.id}">Remove Favorite</button>
        </div>
      </div>
    </article>`;
  }

  function openFavoriteRecipeModal(recipeId) {
    const recipe = state.recipes.find((item) => item.id === recipeId);
    if (!recipe) return;
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
    const recipes = state.recipes.filter((recipe) => state.favorites.includes(recipe.id));
    target.innerHTML = recipes.length ? recipes.map((recipe) => recipeCard({ ...recipe, matchedIngredients: [], missingIngredients: [] }, true)).join("") : emptyState("No favorites saved yet", "Tap the heart on a recipe to keep it here.");
  }

  function renderPantry() {
    displayPantry();
  }

  /* Add a pantry item from the form and save it on this device. */
  function addPantryItem(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const quantity = Number(data.get("quantity"));
    if (!Number.isInteger(quantity) || quantity < 1) {
      const quantityInput = event.currentTarget.elements.quantity;
      quantityInput.setCustomValidity("Quantity must be a whole number of 1 or more.");
      quantityInput.reportValidity();
      quantityInput.setCustomValidity("");
      return;
    }
    state.pantry.push({
      id: "p" + Date.now(),
      name: data.get("name").trim(),
      quantity,
      expirationDate: data.get("expirationDate"),
      category: data.get("category")
    });
    savePantryToStorage();
    event.currentTarget.reset();
    displayPantry();
    toast("Pantry item added");
  }

  /* Display all pantry items with their expiration status. */
  function displayPantry() {
    const expired = state.pantry.filter((item) => checkExpiration(item.expirationDate).status === "Expired").length;
    const attention = state.pantry.filter((item) => ["Expired", "Expires today", "Expires soon"].includes(checkExpiration(item.expirationDate).status)).length;
    const categories = new Set(state.pantry.map((item) => item.category).filter(Boolean)).size;
    $("#pantrySummary").innerHTML = `<div class="summary-card"><span>Pantry items</span><strong>${state.pantry.length}</strong></div><div class="summary-card warning"><span>Needs attention</span><strong>${attention}</strong></div><div class="summary-card ${expired ? "danger" : ""}"><span>Expired</span><strong>${expired}</strong></div><div class="summary-card"><span>Categories</span><strong>${categories}</strong></div>`;
    $("#pantryList").innerHTML = state.pantry.length ? state.pantry.map((item) => {
      const expiration = checkExpiration(item.expirationDate);
      return `<article class="pantry-card">
        <div class="pantry-card-top"><span class="pantry-category">${escapeHtml(item.category || "Other")}</span><span class="expiration-badge ${expiration.className}">${expiration.status}</span></div>
        <h3>${escapeHtml(item.name)}</h3>
        <div class="pantry-details"><span><b>Quantity</b>${escapeHtml(item.quantity)}</span><span><b>Expiration date</b>${item.expirationDate ? formatDate(item.expirationDate) : "Not set"}</span></div>
        <button class="remove-button pantry-remove" data-remove-pantry="${item.id}" aria-label="Remove ${escapeHtml(item.name)}">Remove</button>
      </article>`;
    }).join("") : emptyState("Your pantry is empty", "Add milk, rice, spices, or anything else you want Chef Nova to track.");
    suggestRecipes();
  }

  /* Remove an item from both the screen and localStorage. */
  function removePantryItem(id) {
    state.pantry = state.pantry.filter((item) => item.id !== id);
    savePantryToStorage();
    displayPantry();
    toast("Pantry item removed");
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
    const suggestions = pantryIngredients.length ? state.recipes.map((recipe) => matchIngredients(pantryIngredients, recipe)).filter((recipe) => recipe.matchedIngredients.length > 0).sort((a, b) => b.matchedIngredients.length - a.matchedIngredients.length || a.missingIngredients.length - b.missingIngredients.length) : [];
    target.innerHTML = suggestions.length ? suggestions.map((recipe) => `<article class="suggestion-card">
      <div class="recipe-meta"><span>◷ ${escapeHtml(recipe.cookingTime)}</span><span>${escapeHtml(recipe.difficulty)}</span></div>
      <h3>${escapeHtml(recipe.name)}</h3>
      <div class="ingredient-block"><b>Matching pantry ingredients</b><div class="ingredient-tags matched-tags">${recipe.matchedIngredients.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div></div>
      <div class="ingredient-block"><b>Missing ingredients</b><div class="ingredient-tags missing-tags">${recipe.missingIngredients.length ? recipe.missingIngredients.map((item) => `<span>${escapeHtml(item)}</span>`).join("") : "<span>None</span>"}</div></div>
    </article>`).join("") : emptyState("No recipe suggestions yet", "Add pantry items that match recipe ingredients, such as rice, eggs, chicken, pasta, or milk.");
  }

  function savePantryToStorage() {
    write(KEYS.pantry, state.pantry);
  }

  function loadPantryFromStorage(fallback = []) {
    return read(KEYS.pantry, fallback).map((item) => ({ ...item, quantity: Math.max(1, parseInt(item.quantity, 10) || 1) }));
  }

  function renderPlanner() {
    displayMealPlanner();
  }

  /* Load the saved weekly plan without overwriting user-created data. */
  function loadMealPlan(starterPlan = {}) {
    const savedPlan = read(KEYS.plans, null);
    if (savedPlan) return normalizeMealPlan(savedPlan);
    const olderPlan = read(KEYS.oldPlans, null);
    if (olderPlan) {
      const migrated = normalizeMealPlan(olderPlan);
      write(KEYS.plans, migrated);
      return migrated;
    }
    return normalizeMealPlan(starterPlan);
  }

  function saveMealPlan() {
    write(KEYS.plans, state.mealPlans);
  }

  function displayMealPlanner() {
    const plannedCount = DAYS.reduce((count, day) => count + MEALS.filter((mealType) => (state.mealPlans[day] || {})[mealType]).length, 0);
    $("#mealPlanner").innerHTML = `<div class="planner-summary"><span>Weekly Plan Progress</span><strong>${plannedCount} / ${DAYS.length * MEALS.length} meals planned</strong></div>${renderDayTabs()}<div class="active-day-panel">${displayActiveMealDay()}</div>`;
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
    const currentMeal = (state.mealPlans[day] || {})[mealType] || "";
    return `<section class="meal-slot" data-day="${day}" data-meal="${mealType}">
      <h3>${mealType}</h3>
      <p class="${currentMeal ? "planned-meal" : "empty-meal"}">${currentMeal ? `Planned: ${escapeHtml(currentMeal)}` : "No meal planned"}</p>
      <select aria-label="${day} ${mealType} recipe" data-meal-select="${day}-${mealType}">${getRecipeOptions(currentMeal)}</select>
      <input aria-label="${day} ${mealType} custom meal" data-meal-input="${day}-${mealType}" value="${escapeHtml(currentMeal)}" placeholder="Or type custom meal">
      <div class="meal-actions">
        <button class="button primary small" data-meal-action="add" data-day="${day}" data-meal="${mealType}">Save</button>
        <button class="button secondary small" data-meal-action="edit" data-day="${day}" data-meal="${mealType}">Edit</button>
        <button class="button secondary small delete-meal-button" data-meal-action="delete" data-day="${day}" data-meal="${mealType}">Delete</button>
      </div>
    </section>`;
  }

  function addMeal(day, mealType) {
    const select = $(`[data-meal-select="${day}-${mealType}"]`);
    const input = $(`[data-meal-input="${day}-${mealType}"]`);
    const chosenMeal = (input.value.trim() || select.value).trim();
    if (!chosenMeal) return toast("Choose a recipe or type a meal");
    state.mealPlans[day] = state.mealPlans[day] || {};
    state.mealPlans[day][mealType] = chosenMeal;
    saveMealPlan();
    displayMealPlanner();
    toast("Meal saved!");
  }

  function editMeal(day, mealType) {
    const input = $(`[data-meal-input="${day}-${mealType}"]`);
    if (!input) return;
    input.focus();
    input.select();
  }

  function deleteMeal(day, mealType) {
    state.mealPlans[day] = state.mealPlans[day] || {};
    state.mealPlans[day][mealType] = "";
    saveMealPlan();
    displayMealPlanner();
    toast(`${mealType} removed from ${day}`);
  }

  function getRecipeOptions(selectedMeal = "") {
    const options = [`<option value="">Select recipe</option>`].concat(state.recipes.map((recipe) => `<option value="${escapeHtml(recipe.name)}" ${recipe.name === selectedMeal ? "selected" : ""}>${escapeHtml(recipe.name)}</option>`));
    return options.join("");
  }

  function normalizeMealPlan(plan) {
    return DAYS.reduce((weeklyPlan, day) => {
      weeklyPlan[day] = MEALS.reduce((dayPlan, mealType) => {
        dayPlan[mealType] = String(((plan || {})[day] || {})[mealType] || "");
        return dayPlan;
      }, {});
      return weeklyPlan;
    }, {});
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
    $("#loginMessage").textContent = ""; $("#registerMessage").textContent = "";
  }

  /* Create an account and persist the complete profile locally. */
  function createAccount(event) {
    event.preventDefault(); const data = new FormData(event.currentTarget); const email = data.get("email").trim().toLowerCase();
    if (state.users.some((user) => user.email.toLowerCase() === email)) return showAuthMessage("register", "An account with that email already exists.");
    const user = { id: "u" + Date.now(), name: data.get("name").trim(), email, password: data.get("password"), age: Number(data.get("age")), gender: data.get("gender"), phone: data.get("phone").trim(), dietaryPreference: data.get("dietaryPreference"), allergies: data.get("allergies").trim() || "None" };
    state.users.push(user); write(KEYS.users, state.users); event.currentTarget.reset(); setSession(user);
  }

  /* Validate credentials against locally stored accounts. */
  function login(event) {
    event.preventDefault(); const data = new FormData(event.currentTarget); const email = data.get("email").trim().toLowerCase(); const password = data.get("password");
    const user = state.users.find((candidate) => candidate.email.toLowerCase() === email && candidate.password === password);
    if (!user) return showAuthMessage("login", "Email or password not recognized.");
    event.currentTarget.reset(); setSession(user);
  }

  /* Save a minimal session and load the full profile from the users collection. */
  function setSession(user) { state.currentUser = { id: user.id, name: user.name, email: user.email }; write(KEYS.session, state.currentUser); renderAccount(); renderAccountPage(); navigate("account"); toast("Welcome, " + user.name.split(" ")[0] + "!"); }
  function logout() { state.currentUser = null; localStorage.removeItem(KEYS.session); renderAccount(); renderAccountPage(); showAuthMode("login"); navigate("home"); toast("Signed out"); }
  function showAuthMessage(mode, message) { $(mode === "register" ? "#registerMessage" : "#loginMessage").textContent = message; }

  function daysUntil(date) { if (!date) return Infinity; const today = new Date(); today.setHours(0,0,0,0); return Math.ceil((new Date(date + "T00:00:00") - today) / 86400000); }
  function formatDate(date) { return new Date(date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
  function normalizeIngredient(value) { return String(value || "").toLowerCase().trim().replace(/s$/, ""); }
  function emptyState(title, copy, label, page) { return `<div class="empty-state"><span>✦</span><h3>${title}</h3><p>${copy}</p>${label ? `<button class="button primary" data-page="${page}">${label}</button>` : ""}</div>`; }
  function escapeHtml(value) { return String(value == null ? "" : value).replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]); }
  let toastTimer; function toast(message) { const el = $("#toast"); el.textContent = message; el.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2200); }
  initialize();
})();
