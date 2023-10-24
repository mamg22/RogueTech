const CACHE_VERSION = "v4"

self.addEventListener("install", event => {
    console.log("Service worker installed");
});
self.addEventListener("activate", event => {
    console.log("Service worker activated");
});

const addResourcesToCache = async (resources) => {
    const cache = await caches.open(CACHE_VERSION);
    await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourcesToCache([
            "/",
            "/static/style.css",
            "/offline",
            '/static/res/bgm/main_game.mp3',
            '/static/res/sfx/booster.mp3',
            '/static/res/sfx/pickup.mp3',
            '/static/res/sfx/boom.mp3',
        ])
    );
});

async function handle_request(event) {
    try {
        let response = await caches.match(event.request);
        // If the response is in the cache, return it
        if (response) {
            return response;
        }
        // Otherwise, fetch the request from the network
        response = await fetch(event.request);
        // If the response is not ok, redirect to the offline page
        if (!response || response.status !== 200) {
            return caches.match('/offline');
        }
        // Otherwise, return the response
        return response;
    } catch (error) {
        console.error(error);
    }
}

self.addEventListener("fetch", async (event) => {
    event.respondWith(handle_request(event));
});

const deleteCache = async (key) => {
    await caches.delete(key);
  };
  
  const deleteOldCaches = async () => {
    const cacheKeepList = [CACHE_VERSION];
    const keyList = await caches.keys();
    const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
    await Promise.all(cachesToDelete.map(deleteCache));
  };
  
  self.addEventListener("activate", (event) => {
    event.waitUntil(deleteOldCaches());
  });
  