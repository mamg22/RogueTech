const CACHE_VERSION = "v15"

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
            '/static/res/bgm/main_game.mp3',
            '/static/res/decoration/door.png',
            '/static/res/decoration/stair-down.png',
            '/static/res/decoration/stair-up.png',
            '/static/res/decoration/vending_machine.png',
            '/static/res/demo_map.png',
            '/static/res/etc/boom.gif',
            '/static/res/item/Descripcion de objetos Proyecto.txt',
            '/static/res/item/antivirus.png',
            '/static/res/item/cd.png',
            '/static/res/item/cpu.png',
            '/static/res/item/fancooler.png',
            '/static/res/item/firewall.png',
            '/static/res/item/floppy.png',
            '/static/res/item/gpu.png',
            '/static/res/item/hdd.png',
            '/static/res/item/junk.png',
            '/static/res/item/level-up-chip.png',
            '/static/res/item/pastatermica.png',
            '/static/res/item/pendrive.png',
            '/static/res/item/psu.png',
            '/static/res/item/ram.png',
            '/static/res/item/toolbox.png',
            '/static/res/item/toolkit.png',
            '/static/res/item/water_bottle.png',
            '/static/res/npc/boss-ghost/attack.apng',
            '/static/res/npc/boss-ghost/dying.apng',
            '/static/res/npc/boss-ghost/standing.apng',
            '/static/res/npc/boss-ghost/standing.png',
            '/static/res/npc/boss-spectre/attack.png',
            '/static/res/npc/boss-spectre/dying.apng',
            '/static/res/npc/boss-spectre/standing.apng',
            '/static/res/npc/boss-spectre/standing.png',
            '/static/res/npc/bot-1/attack.png',
            '/static/res/npc/bot-1/dead.png',
            '/static/res/npc/bot-1/dying.gif',
            '/static/res/npc/bot-1/exploding.png',
            '/static/res/npc/bot-1/standing.gif',
            '/static/res/npc/bot-1/standing.png',
            '/static/res/npc/bot-2/attack.png',
            '/static/res/npc/bot-2/dying.gif',
            '/static/res/npc/bot-2/standing.gif',
            '/static/res/npc/bot-2/standing.png',
            '/static/res/npc/bot-3/attack.png',
            '/static/res/npc/bot-3/dying.gif',
            '/static/res/npc/bot-3/standing.apng',
            '/static/res/npc/bot-3/standing.png',
            '/static/res/npc/bot-4/attack.png',
            '/static/res/npc/bot-4/dying.apng',
            '/static/res/npc/bot-4/standing.apng',
            '/static/res/npc/bot-4/standing.png',
            '/static/res/npc/bot-5/attack.png',
            '/static/res/npc/bot-5/dying.apng',
            '/static/res/npc/bot-5/standing.apng',
            '/static/res/npc/bot-5/standing.png',
            '/static/res/npc/bot-6/attack.png',
            '/static/res/npc/bot-6/dying.apng',
            '/static/res/npc/bot-6/standing.apng',
            '/static/res/npc/bot-6/standing.png',
            '/static/res/player/attack.png',
            '/static/res/player/moving.png',
            '/static/res/player/standing.gif',
            '/static/res/player/standing.png',
            '/static/res/sfx/Disparo2.wav',
            '/static/res/sfx/boom.mp3',
            '/static/res/sfx/boom2.wav',
            '/static/res/sfx/booster.mp3',
            '/static/res/sfx/pickup.mp3',
            '/static/t2.jpg',
            '/static/floor1.png',
            '/static/main-icon.png',
            '/static/game.css',
            '/static/tablet.png',
            '/static/tablet-v.png',
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
        // if (!response || response.status !== 200) {
        //     if (event.request == 'navigate') {
        //         return caches.match('/offline');
        //     }
        // }
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
  