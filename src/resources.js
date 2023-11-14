export const sprites = {
    player: {
        standing: "/static/res/player/standing.png",
        moving: "/static/res/player/moving.png",
        attack: "/static/res/player/attack.png",
        dying: ""
    },
    bot1: {
        standing: "/static/res/npc/bot-1/standing.png",
        attack: "/static/res/npc/bot-1/attack.png",
        exploding: "/static/res/npc/bot-1/exploding.png",
        dead: "/static/res/npc/bot-1/dead.png",
        dying: "/static/res/npc/bot-1/dying.gif"
    },
    bot2: {
        standing: "/static/res/npc/bot-2/standing.png",
        attack: "/static/res/npc/bot-2/attack.png",
        dying: "/static/res/npc/bot-2/dying.gif",
    },
    bot3: {
        standing: "/static/res/npc/bot-3/standing.png",
        attack: "/static/res/npc/bot-3/attack.png",
        dying: "/static/res/npc/bot-3/dying.gif",
    },
    bot4: {
        standing: "/static/res/npc/bot-4/standing.png",
        attack: "/static/res/npc/bot-4/attack.png",
        dying: "/static/res/npc/bot-4/dying.apng",
    },
    bot5: {
        standing: "/static/res/npc/bot-5/standing.png",
        attack: "/static/res/npc/bot-5/attack.png",
        dying: "/static/res/npc/bot-5/dying.apng",
    },
    bot6: {
        standing: "/static/res/npc/bot-6/standing.png",
        attack: "/static/res/npc/bot-6/attack.png",
        dying: "/static/res/npc/bot-6/dying.apng",
    },
    spectre: {
        standing: "/static/res/npc/boss-spectre/standing.png",
        attack: "/static/res/npc/boss-spectre/attack.png",
        dying: "/static/res/npc/boss-spectre/dying.apng",
    },
    ghost: {
        standing: "/static/res/npc/boss-ghost/standing.png",
        attack: "/static/res/npc/boss-ghost/attack.apng",
        dying: "/static/res/npc/boss-ghost/dying.apng",
    },
    items: {
        antivirus: "/static/res/item/antivirus.png",
        cpu: "/static/res/item/cpu.png",
        cd: "/static/res/item/cd.png",
        fancooler: "/static/res/item/fancooler.png",
        firewall: "/static/res/item/firewall.png",
        floppy: "/static/res/item/floppy.png",
        gpu: "/static/res/item/gpu.png",
        hdd: "/static/res/item/hdd.png",
        junk: "/static/res/item/junk.png",
        level_up_chip: "/static/res/item/level-up-chip.png",
        pastatermica: "/static/res/item/pastatermica.png",
        pendrive: "/static/res/item/pendrive.png",
        psu: "/static/res/item/psu.png",
        ram: "/static/res/item/ram.png",
        toolbox: "/static/res/item/toolbox.png",
        toolkit: "/static/res/item/toolkit.png",
        water_bottle: "/static/res/item/water_bottle.png",
    },
    decoration: {
        vending_machine: "/static/res/decoration/vending_machine.png",
        boom: "/static/res/etc/boom.gif",
        stair_up: "/static/res/decoration/stair-up.png",
        stair_down: "/static/res/decoration/stair-down.png",
        door: "/static/res/decoration/stair-down.png",
    },
    etc: {
        boom: "/static/res/etc/boom.gif"
    }
};

function audio_resource(src, options) {
    const audio = new Audio();
    audio.src = src;
    audio.preload = true;

    for (const option in options) {
        audio[option] = options[option];

        if (option === 'volume') {
            audio._volume = options[option];
        }
    }

    audio.load();

    return audio;
}

export const audios = {
    bgm: {
        main: audio_resource(
            '/static/res/bgm/main_game.mp3', {
                loop: true,
                volume: 0.05,
        }),
    },
    sfx: {
        booster: audio_resource(
            '/static/res/sfx/booster.mp3', {
                volume: 0.4,
            }),
        pickup: audio_resource(
            '/static/res/sfx/pickup.mp3', {
                volume: 0.4,
            }),
        boom: audio_resource(
            '/static/res/sfx/boom.mp3', {
                volume: 0.1,
            }),
    }
};