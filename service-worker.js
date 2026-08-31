const CACHE_NAME = "chef-nova-shell-v71";
const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./rules.js",
  "./languageGuidelines.js",
  "./scripts/localization-service.js",
  "./scripts/rollout-management.js",
  "./scripts/offline-resilience.js",
  "./scripts/content-review-governance.js",
  "./scripts/accessibility-recovery.js",
  "./scripts/voice-safety.js",
  "./scripts/ingredient-data-shared.js",
  "./scripts/price-data-shared.js",
  "./scripts/cost-calculation-engine.js",
  "./scripts/pantry-first-planning.js",
  "./scripts/recipe-eligibility-ranking.js",
  "./scripts/ingredient-substitution-shared.js",
  "./data/recipes.js",
  "./data/ingredients.js",
  "./data/price-estimates-cad.js",
  "./data/ingredient-substitutions.js",
  "./data/freezer-guidance.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).catch(() => undefined));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .catch(() => undefined)
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || !request.url.startsWith(self.location.origin)) return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => undefined);
        return response;
      }).catch(() => {
        if (request.mode === "navigate") return caches.match("./index.html");
        return new Response("Offline", { status: 503, statusText: "Offline" });
      });
    })
  );
});
