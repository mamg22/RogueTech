const VERSION = 1


const sprites = {
    player: {
        standing: "/static/res/player/standing.png",
        moving: "/static/res/player/moving.png",
        attack: "/static/res/player/attack.png",
    },
    enemy: {
        standing: "/static/res/npc/bot-1/standing.png",
        attack: "/static/res/npc/bot-1/attack.png",
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

const audios = {
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

scale = 1.0

function world_to_grid(x, with_scale=true) {
    let value_scale = with_scale ? scale : 1;
    return Math.floor(x / (GRID_SIZE * value_scale));
}

function grid_to_world(x, with_scale=true) {
    let value_scale = with_scale ? scale : 1;
    return Math.floor(x * (GRID_SIZE * value_scale));
}

function zoom(delta) {
    scale += delta;
    document.body.style.setProperty("--scale", scale, "important");
    render();
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
        this.element.style.setProperty('--flip', this.facing)
    },
    async move(x, y) {
        try {
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
            
            if (entity) {
                if (result.length == 0 || result.length == 1 && !entity.solid) {
                    entity.interact()
                    this.moving = false
                    return;
                }
            }
            
            audios.sfx.booster.currentTime = 0
            audios.sfx.booster.play()
            for (const step of result) {
                state.player.set_facing(get_move_dir(this.x, step.x));
                this.element.src = sprites.player.moving;
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
            this.element.src = sprites.player.standing;
            audios.sfx.booster.pause()
        }
        finally {
            this.moving = false
            audios.sfx.booster.pause()
        }
    },
    move_relative(x_delta, y_delta) {
        this.move(this.x + x_delta, this.y + y_delta)
    }
}

async function enemy_interact() {
    this.health -= 1;
    state.player.element.src = sprites.player.attack;
    setTimeout(function() {
        state.player.element.src = sprites.player.standing;
    }, 200)
    if (this.health > 0) {
        push_msg(`Atacas al robot! Todavia puede aguantar ${this.health} ataques`)
    }
    else if (this.health == 0) {
        push_msg(`El robot ha sido derrotado!`)
        this.element.src = sprites.enemy.dying;
        await delay(1500);
        audios.sfx.boom.play()
        state.remove_entity(this);
        this.element.src = sprites.decoration.boom;
        await delay(1500);
        this.element.remove()
    }
}

function item_interact() {
    push_msg(`Has recogido ${this.description}`)
    audios.sfx.pickup.play()
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
            sprite: sprites.enemy.standing
        },
        {
            x: 11, y: 9,
            health: 3,
            solid: true,
            interact: enemy_interact,
            sprite: sprites.enemy.standing
        },
        {
            x: 12, y: 9,
            health: 3,
            solid: true,
            interact: enemy_interact,
            sprite: sprites.enemy.standing
        },
        {
            x: 31, y: 8,
            health: 15,
            solid: true,
            interact: enemy_interact,
            sprite: sprites.enemy.standing
        },
        {
            x: 25, y: 4,
            health: 1,
            solid: true,
            interact: enemy_interact,
            sprite: sprites.enemy.standing
        },
        {
            x: 26, y: 4,
            health: 1,
            solid: true,
            interact: enemy_interact,
            sprite: sprites.enemy.standing
        },
        {
            x: 25, y: 5,
            health: 1,
            solid: true,
            interact: enemy_interact,
            sprite: sprites.enemy.standing
        },
        {
            x: 26, y: 5,
            health: 1,
            solid: true,
            interact: enemy_interact,
            sprite: sprites.enemy.standing
        },
        {
            x: 18, y: 13,
            health: 5,
            solid: true,
            interact: enemy_interact,
            sprite: sprites.enemy.standing
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
        let idx = this.entities.indexOf(entity)
        // TODO? Remove element asociated with entity, maybe conditionally based on a NO_REMOVE or SELF_REMOVING flag
        this.entities.splice(idx, 1)
    }
}

function render() {
    if (! state.player.element) {
        let entity_img = document.createElement("img");
        entity_img.src = sprites.player.standing;
        state.player.element = entity_img;
        entities_elt.append(entity_img);
    }
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
        world_to_grid(e.offsetX, false),
        world_to_grid(e.offsetY, false)
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

window.addEventListener('click', function(e) {
    audios.bgm.main.play()
});

window.addEventListener('DOMContentLoaded', render)

function set_audio(category, mute) {
    if (! (category in audios)) {
        throw Error("Invalid audio category")
    }
    
    const category_audios = audios[category];
    for (const name in category_audios) {
        const target = category_audios[name];
        if (mute) {
            target.volume = 0;
        }
        else {
            target.volume = target._volume
        }
    }
}

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


class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
    x;
    y;
    width;
    height;

    tostring() {
        return `Rect((${this.x}, ${this.y}), w: ${this.width}, h: ${this.height})`;
    }
}


class BSPNode {
    constructor(id, rect) {
        this.id = id;
        this.rect = rect;
    }
    id;
    rect;

    split_offset;
    split_direction;

    left;
    right;

    split(direction, offset) {
        this.split_direction = direction;
        this.split_offset = offset;
        if (direction == "H" || direction == "h") {
            this.left = new BSPNode(this.id + "0", new Rectangle(
                this.rect.x,
                this.rect.y,
                this.rect.width,
                offset
            ));
            this.right = new BSPNode(this.id + "1", new Rectangle(
                this.rect.x,
                this.rect.y + offset + 1,
                this.rect.width,
                this.rect.height - offset - 1
            ));
        }
        else if (direction == "V" || direction == "v") {
            this.left = new BSPNode(this.id + "0", new Rectangle(
                this.rect.x,
                this.rect.y,
                offset,
                this.rect.height
            ));
            this.right = new BSPNode(this.id + "1", new Rectangle(
                this.rect.x + offset + 1,
                this.rect.y,
                this.rect.width - offset - 1,
                this.rect.height
            ));
        }
    }

    tostring() {
        let depth = this.id.length - 1;
        let indent = ' '.repeat(depth*4);
        let children;
        if (this.left) {
            children =
`{
${this.left.tostring()}
${this.right.tostring()}
${indent}}`
        }
        return `${indent}BSPNode(${this.id}: ${this.rect.tostring()} ${children || "#"})`
    }
}

function generate_map() {
    const root = new BSPNode("0", new Rectangle(0, 0, 20, 20));

    root.split("V", 8);
    root.left.split("H", 4);
    root.right.split("V", 7);
    root.right.left.split("H", 6);
    root.right.left.right.split("V", 3);
    root.right.right.split("H", 6);

    return root;
}