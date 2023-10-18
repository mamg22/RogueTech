const VERSION = 1


const sprites = {
    player: {
        standingr: "/static/res/player/standing-r.png",
        standingl: "/static/res/player/standing-l.png",
        movingr: "/static/res/player/moving-r.png",
        movingl: "/static/res/player/moving-l.png",
        attackr: "/static/res/player/attack-r.png",
        attackl: "/static/res/player/attack-l.png",
    },
    enemy: {
        standingr: "/static/res/npc/bot-1/standing-r.png",
        standingl: "/static/res/npc/bot-1/standing-l.png",
        attackr: "/static/res/npc/bot-1/attack-r.png",
        attackl: "/static/res/npc/bot-1/attack-l.png",
        exploding: "/static/res/npc/bot-1/exploding.png",
        dead: "/static/res/npc/bot-1/dead.png",
        dying: "/static/res/npc/bot-1/dying.gif"
    },
    items: {
        water_bottle: "/static/res/item/water_bottle.png",
        dvd: "/static/res/item/dvd.png",
        pendrive: "/static/res/item/pendrive.png"
    },
    decoration: {
        vending_machine: "/static/res/decoration/vending_machine.png",
        boom: "/static/res/etc/boom.gif"
    },
    etc: {
        boom: "/static/res/etc/boom.gif"
    }
};

const audios = {
    bgm: {
        main: '/static/res/bgm/main_game.mp3'
    },
    sfx: {
        booster: '/static/res/sfx/booster.mp3',
        pickup: '/static/res/sfx/pickup.mp3',
        boom: '/static/res/sfx/boom.mp3'
    }
};

function delay(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms);
    })
}

function wait_for(obj, event) {
    return new Promise(function (resolve, reject) {
        obj.addEventListener(event, resolve, {once: true});
    })
}

function world_to_grid(x) {
    return Math.floor(x / GRID_SIZE);
}

function grid_to_world(x) {
    return Math.floor(x * GRID_SIZE);
}

function push_msg(message, category) {
    const messages_elt = document.getElementById("messages");

    let message_elt = document.createElement("div");
    message_elt.innerText = message
    messages_elt.append(message_elt);
    setTimeout(function(e) {
        let m_anim = message_elt.animate([
            { opacity: 1 },
            { opacity: 0 }
        ],
            { duration: 3000 }
        );
        m_anim.addEventListener('finish', function(e) {
            message_elt.remove()
        })
    }, 7000);
    
    while (messages_elt.children.length > 8) {
        messages_elt.children[0].remove()
    }
}

// Firefox-specific polyfill
if (!CSS.px) {
    CSS.px = function(i) {
        return `${i}px`;
    }
}

const GRID_SIZE = 64;
const MAP_STR = `
######################################
######################################
#####                       #### #####
#####        #         #         #####
#####        ###########    #### #####
######## ###############    #### #####
######## ###############       # #   #
#####           ########       #     #
##### ##        ########        #### #
##### ##        ############    #### #
#      #        ############         #
# #### #        ############         #
# #  # ##       ###########          #
#      ##                   ##########
######################################
######################################
######################################`.trim();

let map_data = [];
for (const line of MAP_STR.split('\n')) {
    let line_array = Array.from(line).map(function (elem) {
        if (elem == '#') {
            return 0;
        }
        else {
            return 1;
        }
    })
    map_data.push(line_array);
}
const map_width = map_data[0].length;
const map_height = map_data.length;

let map = {
    data: map_data,
    element: document.getElementById("map"),
    width: map_width,
    height: map_height,
    get(x, y) {
        if (x < 0 || x >= map_width) {
            return null;
        }
        if (y < 0 || y >= map_height) {
            return null;
        }
        return map_data[y][x];
    },
}

function transpose_array(arr) {
    out = []
    for (let x = 0; x < arr[0].length; x++) {
        out[x] = []
        for (let y = 0; y < arr.length; y++) {
            out[x][y] = arr[y][x]
        }
    }
    return out
}

function get_move_dir(old_x, new_x) {
    return Math.sign(new_x - old_x);
}

let player = {
    x: 5,
    y: 3,
    element: document.getElementById("hero"),
    moving: false,
    facing: +1,
    set_facing(dir) {
        if (Math.abs(dir) == 1) {
            this.facing = dir
        }
    },
    async move(x, y) {
        if (this.moving) {
            return;
        }
        this.moving = true;
        state.player.set_facing(get_move_dir(this.x, x));
        let entity = state.get_entity(x, y);
        if (entity) {
        }
        transpose_array(state.map.data)
        let graph = new Graph(transpose_array(state.get_map_with_entities()), {
            diagonal: true
        });
        let start = graph.grid[this.x][this.y];
        let end = graph.grid[x][y];
        let result = astar.search(graph, start, end, {
            heuristic: astar.heuristics.diagonal,
            closest: true
        });
        console.log(result)
        
        if (entity) {
            if (result.length == 0 || result.length == 1 && !entity.solid) {
                entity.interact()
                this.moving = false
                return;
            }
        }
        
        player_sfx.currentTime = 0
        player_sfx.play()
        for (const step of result) {
            state.player.set_facing(get_move_dir(this.x, step.x));
            if (state.player.facing == +1) {
                this.element.src = sprites.player.movingr;
            }
            else {
                this.element.src = sprites.player.movingl;
            }
            let anim = this.element.animate(
                [
                    {
                        left: CSS.px(grid_to_world(this.x)),
                        top: CSS.px(grid_to_world(this.y))
                    },
                    {
                        left: CSS.px(grid_to_world(step.x)),
                        top: CSS.px(grid_to_world(step.y))
                    }
                ],
                {
                    duration: 125,
                    iterations: 1
                }
            );
            this.x = step.x;
            this.y = step.y;
            await wait_for(anim, 'finish');
            render();
            this.element.scrollIntoView({
                block: 'center',
                inline: 'center',
                behavior: 'smooth'
            })
        }
        if (state.player.facing == +1) {
            this.element.src = sprites.player.standingr;
        }
        else {
            this.element.src = sprites.player.standingl;
        }
        player_sfx.pause()
        this.moving = false;
    },
    move_relative(x_delta, y_delta) {
        this.move(this.x + x_delta, this.y + y_delta)
    }
}

async function enemy_interact() {
    this.health -= 1;
    if (state.player.facing == +1) {
        state.player.element.src = sprites.player.attackr;
    }
    else {
        state.player.element.src = sprites.player.attackl;
    }
    setTimeout(function() {
        if (state.player.facing == +1) {
            state.player.element.src = sprites.player.standingr;
        }
        else {
            state.player.element.src = sprites.player.standingl;
        }
    }, 200)
    if (this.health > 0) {
        push_msg(`Atacas al robot! Todavia puede aguantar ${this.health} ataques`)
    }
    else if (this.health == 0) {
        push_msg(`El robot ha sido derrotado!`)
        this.element.src = sprites.enemy.dying;
        await delay(1500);
        boom_sfx.play()
        state.remove_entity(this);
        this.element.src = sprites.decoration.boom;
        await delay(1500);
        this.element.remove()
    }
}

function item_interact() {
    push_msg(`Has recogido ${this.description}`)
    pickup_sfx.play()
    state.remove_entity(this);
    this.element.remove()
}

let state = {
    map: map,
    player: player,
    entities: [
        {
            x: 9, y: 3,
            health: 5,
            solid: true,
            interact: enemy_interact,
            sprite: sprites.enemy.standingl
        },
        {
            x: 11, y: 9,
            health: 3,
            solid: true,
            interact: enemy_interact,
            sprite: sprites.enemy.standingl
        },
        {
            x: 12, y: 9,
            health: 3,
            solid: true,
            interact: enemy_interact,
            sprite: sprites.enemy.standingl
        },
        {
            x: 31, y: 8,
            health: 15,
            solid: true,
            interact: enemy_interact,
            sprite: sprites.enemy.standingl
        },
        {
            x: 25, y: 4,
            health: 1,
            solid: true,
            interact: enemy_interact,
            sprite: sprites.enemy.standingl
        },
        {
            x: 26, y: 4,
            health: 1,
            solid: true,
            interact: enemy_interact,
            sprite: sprites.enemy.standingl
        },
        {
            x: 25, y: 5,
            health: 1,
            solid: true,
            interact: enemy_interact,
            sprite: sprites.enemy.standingl
        },
        {
            x: 26, y: 5,
            health: 1,
            solid: true,
            interact: enemy_interact,
            sprite: sprites.enemy.standingl
        },
        {
            x: 18, y: 13,
            health: 5,
            solid: true,
            interact: enemy_interact,
            sprite: sprites.enemy.standingl
        },
        {
            x: 16,
            y: 3,
            description: "Botella de agua",
            solid: false,
            interact: item_interact,
            sprite: sprites.items.water_bottle
        },
        {
            x: 24,
            y: 13,
            description: "Botella de agua",
            solid: false,
            interact: item_interact,
            sprite: sprites.items.water_bottle
        },
        {
            x: 3,
            y: 12,
            description: "DVD",
            solid: false,
            interact: item_interact,
            sprite: sprites.items.dvd
        },
        {
            x: 29,
            y: 7,
            description: "Pendrive",
            solid: false,
            interact: item_interact,
            sprite: sprites.items.pendrive
        },
        {
            x: 20,
            y: 2,
            solid: true,
            interact: () => push_msg("La maquina expendedora no parece funcionar"),
            sprite: sprites.decoration.vending_machine
        },
    ],
    get_map_with_entities() {
        let map_data = structuredClone(this.map.data);
        for (let entity of this.entities) {
            if (entity.solid) {
                map_data[entity.y][entity.x] = 0;
            }
        }
        return map_data;
    },
    get_entity(x, y) {
        for (const entity of this.entities) {
            if (entity.x == x && entity.y == y) {
                return entity;
            }
        }
        return null;
    },
    remove_entity(entity) {
        console.log(entity, this.entities)
        let idx = this.entities.indexOf(entity)
        console.log(idx)
        // TODO? Remove element asociated with entity, maybe conditionally based on a NO_REMOVE or SELF_REMOVING flag
        this.entities.splice(idx, 1)
    }
}

function render() {
    let player_elt = state.player.element;
    player_elt.style.left = CSS.px(grid_to_world(state.player.x));
    player_elt.style.top = CSS.px(grid_to_world(state.player.y));
    
    for (const entity of state.entities) {
        if (!entity.element) {
            let entity_img = document.createElement("img");
            entity_img.src = entity.sprite;
            entity.element = entity_img;
            entities_elt.append(entity_img);
        }
        entity.element.style.left = CSS.px(grid_to_world(entity.x));
        entity.element.style.top = CSS.px(grid_to_world(entity.y));
    }
}

window.addEventListener('keyup', function(e) {
    e.preventDefault();
    if (e.key == 'ArrowUp') {
        state.player.move_relative(0, -1)
    }
    else if (e.key == 'ArrowDown') {
        state.player.move_relative(0, +1)
    }
    else if (e.key == 'ArrowLeft') {
        state.player.move_relative(-1, 0)
    }
    else if (e.key == 'ArrowRight') {
        state.player.move_relative(+1, 0)
    }
});

let game_view = document.querySelector("#game-view");
let entities_elt = document.querySelector("#entities");

game_view.addEventListener('pointermove', function(e) {
    if (e.buttons == 1) {
        game_view.scrollLeft -= e.movementX
        game_view.scrollTop -= e.movementY
    }
});

let pointer_down = null;

function is_click(start, end) {
    const max_dist = 5;
    const x_delta = Math.abs(start.pageX - end.pageX);
    const y_delta = Math.abs(start.pageY - end.pageY);
    return x_delta < max_dist && y_delta < max_dist;
}

function click_handler(e) {
    state.player.move(
        world_to_grid(e.offsetX),
        world_to_grid(e.offsetY)
        );
}

game_view.addEventListener('pointerdown', function(e) {
    pointer_down = e;
})

game_view.addEventListener('pointerup', function(e) {
    if (is_click(pointer_down, e)) {
        click_handler(e)
    }
    pointer_down = null
})

let imgs = document.querySelectorAll("img");

imgs.forEach(function (img) {
    img.addEventListener('dragstart', function (e) {
        e.preventDefault();
    });
    img.addEventListener('click', function (e) {
        e.preventDefault();
    })
})

const bgm = new Audio();
bgm.src = audios.bgm.main;
bgm.preload = true;
bgm.loop = true;
bgm.volume = 0.05

const player_sfx = new Audio();
player_sfx.src = audios.sfx.booster;
player_sfx.preload = true;
player_sfx.load();
player_sfx.volume = 0.4;

const pickup_sfx = new Audio();
pickup_sfx.src = audios.sfx.pickup;
pickup_sfx.preload = true;
pickup_sfx.load();
pickup_sfx.volume = 0.4;

const boom_sfx = new Audio();
boom_sfx.src = audios.sfx.boom;
boom_sfx.preload = true;
boom_sfx.load();
boom_sfx.volume = 0.1;

window.addEventListener('click', function(e) {
    bgm.play()
});

window.addEventListener('DOMContentLoaded', render)

const music_control = document.getElementById("music")
music_control.addEventListener('change', function(e) {
    if (music_control.checked) {
        bgm.volume = 0.05;
    }
    else {
        bgm.volume = 0;
    }
})

const sound_control = document.getElementById("sound")
sound_control.addEventListener('change', function(e) {
    if (sound_control.checked) {
        player_sfx.volume = 0.4;
        pickup_sfx.volume = 0.4;
        boom_sfx.volume = 0.1;
    }
    else {
        player_sfx.volume = 0;
        pickup_sfx.volume = 0;
        boom_sfx.volume = 0;
    }
})

async function upload_score(scoredata) {
    const data_json = JSON.stringify(scoredata)

    const upload_result = await fetch(
        "/api/v1/score", 
        {
            method: "POST",
            body: data_json,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    if (!upload_result.ok) {
        console.log("Failed upload:", upload_result);
        return null;
    }

    const json = await upload_result.json();
    const result = json.result;

    // Return the newly generated id
    return result;
}