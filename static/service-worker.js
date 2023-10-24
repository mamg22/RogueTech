const CACHE_VERSION = "v3"

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
        ]),
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
