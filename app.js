/* Chef Nova front-end application. All personal data is stored locally in the browser. */
(function () {
  "use strict";

  const KEYS = { users: "chefNova.users", session: "chefNova.session", favorites: "chefNovaFavorites", oldFavorites: "chefNova.favorites", pantry: "chefNova.pantry", plans: "chefNovaMealPlan", oldPlans: "chefNova.mealPlans" };
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

  const MEAL_CATEGORIES = ["Breakfast", "Brunch", "Lunch", "Dinner", "Desserts", "Drinks"];
  const DIFFICULTIES = ["Easy", "Medium", "Hard"];
  const DIETARY_PREFERENCES = ["Vegetarian", "Vegan", "Pescatarian", "Dairy-Free", "Gluten-Free", "Halal-Friendly", "High Protein", "Low Carb"];
  const state = { recipes: [], users: [], pantry: [], favorites: [], mealPlans: {}, currentUser: null, authMode: "login", ruleFilter: "All", activeMealDay: "Monday", recipeFilters: { category: "All", cuisine: "All", difficulty: "All", maxTime: "", dietary: "All", hideAllergies: false } };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const read = (key, fallback) => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch (_) { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

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
      const recipeDetailsButton = event.target.closest("[data-recipe-details]");
      if (recipeDetailsButton) displayRecipeDetails(recipeDetailsButton.dataset.recipeDetails);
      const missingButton = event.target.closest("[data-add-missing]");
      if (missingButton) addMissingIngredientsToShoppingList(missingButton.dataset.addMissing);
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
    ["recipeCategoryFilter", "recipeCuisineFilter", "recipeDifficultyFilter", "recipeMaxTimeFilter", "recipeDietaryFilter", "hideAllergyRecipesFilter"].forEach((id) => {
      const element = $("#" + id);
      if (!element) return;
      element.addEventListener("input", updateRecipeFilters);
      element.addEventListener("change", updateRecipeFilters);
    });
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
    $("#recipeDetailModalClose").addEventListener("click", closeRecipeDetailModal);
    $("#recipeDetailModal").addEventListener("click", (event) => { if (event.target.id === "recipeDetailModal") closeRecipeDetailModal(); });
    $("#instructionModalClose").addEventListener("click", closeInstructionModal);
    $("#instructionModal").addEventListener("click", (event) => { if (event.target.id === "instructionModal") closeInstructionModal(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeRuleModal(); closeFavoriteRecipeModal(); closeInstructionModal(); closeRecipeDetailModal(); } });
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

  function renderAll() { renderAccount(); renderAccountPage(); generateRecipeCategories(); searchRecipes(); renderPantry(); renderPlanner(); renderFavorites(); renderRules(); displayInstructions(); }

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

  /* Search every recipe from the data file, then apply filters and sort by match percentage. */
  function searchRecipes() {
    const userIngredients = parseIngredientInput($("#recipeSearch").value);
    const matched = state.recipes.map((recipe) => calculateRecipeMatch(userIngredients, normalizeRecipe(recipe)));
    displayRecipeResults(sortRecipesByMatch(filterRecipes(matched)));
  }

  function updateRecipeFilters() {
    const maxTimeInput = $("#recipeMaxTimeFilter");
    const maxTimeValue = maxTimeInput.value.trim();
    if (maxTimeValue && (!Number.isInteger(Number(maxTimeValue)) || Number(maxTimeValue) < 1)) {
      maxTimeInput.setCustomValidity("Please enter a valid cooking time in minutes.");
      maxTimeInput.reportValidity();
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
    return recipes.filter((recipe) => {
      if (filters.category !== "All" && recipe.category !== filters.category) return false;
      if (filters.cuisine !== "All" && recipe.cuisine !== filters.cuisine) return false;
      if (filters.difficulty !== "All" && recipe.difficulty !== filters.difficulty) return false;
      if (filters.dietary !== "All" && !recipe.dietaryTags.some((tag) => normalizeIngredient(tag) === normalizeIngredient(filters.dietary))) return false;
      if (filters.maxTime && recipe.cookingTime > maxTime) return false;
      if (filters.hideAllergies && recipeContainsUserAllergy(recipe)) return false;
      return true;
    });
  }

  function sortRecipesByMatch(recipes) {
    return [...recipes].sort((a, b) => b.matchPercentage - a.matchPercentage || a.missingIngredients.length - b.missingIngredients.length || a.totalTime - b.totalTime || a.name.localeCompare(b.name));
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
        <div class="recipe-meta"><span>${escapeHtml(recipe.category)}</span><span>${escapeHtml(recipe.cuisine)}</span><span>◷ ${recipe.cookingTime} min</span><span>${escapeHtml(recipe.difficulty)}</span><span>${recipe.calories} cal</span><span>${recipe.protein}g protein</span></div>
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
      calories: toNumber(recipe.calories),
      protein: toNumber(recipe.protein),
      carbohydrates: toNumber(recipe.carbohydrates),
      fat: toNumber(recipe.fat),
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
    const allergyText = String((user && user.allergies) || "").trim();
    if (!allergyText || normalizeIngredient(allergyText) === "none") return [];
    return allergyText.split(/,|;/).map((item) => item.trim()).filter(Boolean);
  }

  function recipeContainsUserAllergy(recipe) {
    const userAllergies = getUserAllergies().map(normalizeIngredient);
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
    if (!recipe) return;
    const result = calculateRecipeMatch(parseIngredientInput($("#recipeSearch").value), recipe);
    const saved = isRecipeFavorite(recipe.id);
    $("#recipeDetailModalContent").innerHTML = `<div class="recipe-detail-heading">
      <div class="recipe-detail-image"><span>${escapeHtml(recipe.imagePlaceholder || recipe.name)}</span></div>
      <div><span class="rule-badge">${escapeHtml(recipe.category)} · ${escapeHtml(recipe.cuisine)}</span><h2 id="recipeDetailModalTitle">${escapeHtml(recipe.name)}</h2><p>Check ingredient labels and confirm dietary suitability before cooking.</p></div>
    </div>
    <div class="recipe-detail-stats">
      <span><b>Servings</b>${recipe.servings}</span><span><b>Prep</b>${recipe.preparationTime} min</span><span><b>Cook</b>${recipe.cookingTime} min</span><span><b>Total</b>${recipe.totalTime} min</span>
      <span><b>Calories</b>${recipe.calories}</span><span><b>Protein</b>${recipe.protein}g</span><span><b>Carbs</b>${recipe.carbohydrates}g</span><span><b>Fat</b>${recipe.fat}g</span>
    </div>
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
    if (!recipe) return;
    const result = calculateRecipeMatch(parseIngredientInput($("#recipeSearch").value), recipe);
    const existing = read("chefNovaShoppingList", []);
    const additions = result.missingIngredients.map((ingredient) => ({ id: "s" + Date.now() + "-" + normalizeIngredient(ingredient.name), name: ingredient.name, quantity: ingredient.quantity || 1, unit: ingredient.unit || "", recipeId: recipe.id, checked: false }));
    const merged = [...existing];
    additions.forEach((item) => { if (!merged.some((existingItem) => normalizeIngredient(existingItem.name) === normalizeIngredient(item.name))) merged.push(item); });
    write("chefNovaShoppingList", merged);
    toast(additions.length ? "Missing ingredients added to shopping list" : "No missing ingredients to add");
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

  function toggleFavorite(id) {
    if (isRecipeFavorite(id)) removeFavorite(id); else saveFavorite(id);
  }

  /* Save one recipe id to localStorage under chefNovaFavorites. */
  function saveFavorite(id) {
    state.favorites = Array.from(new Set([...state.favorites, id]));
    write(KEYS.favorites, state.favorites); searchRecipes(); displayFavoritesPage(); renderAccountPage(); displayRecipeDetailsIfOpen(id); toast("Saved to favorites");
  }

  /* Remove one recipe id from localStorage favorites. */
  function removeFavorite(id) {
    state.favorites = state.favorites.filter((item) => item !== id);
    write(KEYS.favorites, state.favorites); searchRecipes(); displayFavoritesPage(); renderAccountPage(); displayRecipeDetailsIfOpen(id); toast("Removed from favorites");
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
    const recipes = state.recipes.map(normalizeRecipe).filter((recipe) => isRecipeFavorite(recipe.id));
    $("#favoriteResults").innerHTML = recipes.length ? recipes.map(favoriteRecipeCard).join("") : emptyState("No favorite recipes yet.", "Go to AI Recipe Finder to save recipes.", "AI Recipe Finder", "recipes");
    displayFinderFavorites();
  }

  function favoriteRecipeCard(recipe) {
    const warnings = getRecipeAllergies(recipe);
    return `<article class="favorite-recipe-card">
      <div class="favorite-recipe-image"><span>${escapeHtml(recipe.imagePlaceholder || recipe.name)}</span></div>
      <div class="favorite-recipe-body">
        <div class="recipe-meta"><span>${escapeHtml(recipe.category)}</span><span>${escapeHtml(recipe.cuisine)}</span><span>◷ ${escapeHtml(recipe.cookingTime)} min</span><span>${escapeHtml(recipe.difficulty)}</span><span>${escapeHtml(recipe.calories)} cal</span><span>${escapeHtml(recipe.protein)}g protein</span></div>
        <h3>${escapeHtml(recipe.name)}</h3>
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
    const recipes = state.recipes.map(normalizeRecipe).filter((recipe) => state.favorites.includes(recipe.id)).map((recipe) => calculateRecipeMatch(parseIngredientInput($("#recipeSearch").value), recipe));
    target.innerHTML = recipes.length ? recipes.map((recipe) => recipeCard(recipe, true)).join("") : emptyState("No favorites saved yet", "Tap the heart on a recipe to keep it here.");
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
    const suggestions = pantryIngredients.length ? sortRecipesByMatch(state.recipes.map((recipe) => calculateRecipeMatch(pantryIngredients, normalizeRecipe(recipe))).filter((recipe) => recipe.matchedIngredients.length > 0)) : [];
    target.innerHTML = suggestions.length ? suggestions.map((recipe) => `<article class="suggestion-card">
      <div class="recipe-meta"><span>${recipe.matchPercentage}% match</span><span>◷ ${escapeHtml(recipe.cookingTime)} min</span><span>${escapeHtml(recipe.difficulty)}</span></div>
      <h3>${escapeHtml(recipe.name)}</h3>
      <div class="ingredient-block"><b>Matching pantry ingredients</b><div class="ingredient-tags matched-tags">${recipe.matchedIngredients.map((item) => `<span>${escapeHtml(item.name)}</span>`).join("")}</div></div>
      <div class="ingredient-block"><b>Missing ingredients</b><div class="ingredient-tags missing-tags">${recipe.missingIngredients.length ? recipe.missingIngredients.slice(0, 5).map((item) => `<span>${escapeHtml(item.name)}</span>`).join("") : "<span>None</span>"}</div></div>
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
  function normalizeIngredient(value) {
    let normalized = String(value || "").toLowerCase().trim().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ");
    if (normalized.endsWith("ies")) normalized = normalized.slice(0, -3) + "y";
    else if (normalized.endsWith("oes")) normalized = normalized.slice(0, -2);
    else if (normalized.endsWith("s") && !normalized.endsWith("ss")) normalized = normalized.slice(0, -1);
    return normalized;
  }
  function emptyState(title, copy, label, page) { return `<div class="empty-state"><span>✦</span><h3>${title}</h3><p>${copy}</p>${label ? `<button class="button primary" data-page="${page}">${label}</button>` : ""}</div>`; }
  function escapeHtml(value) { return String(value == null ? "" : value).replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]); }
  let toastTimer; function toast(message) { const el = $("#toast"); el.textContent = message; el.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2200); }
  initialize();
})();
