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

function world_to_grid(x, with_scale=true) {
    let value_scale = with_scale ? state.scale : 1;
    return Math.floor(x / (GRID_SIZE * value_scale));
}

function grid_to_world(x, with_scale=true) {
    let value_scale = with_scale ? state.scale : 1;
    return Math.floor(x * (GRID_SIZE * value_scale));
}

function zoom(delta) {
    state.scale += delta;
    document.body.style.setProperty("--scale", state.scale, "important");
    render();
}

function push_msg(message, category) {
    const messages_elt = document.getElementById("messages");

    let message_elt = document.createElement("div");
    message_elt.innerText = message;
    message_elt.classList.add(category || 'default');
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

    contains_point(x, y) {
        return x >= this.x && x < this.x + this.width &&
               y >= this.y && y < this.y + this.height;
    }

    toString() {
        return `Rectangle((${this.x}, ${this.y}), w: ${this.width}, h: ${this.height})`;
    }
}

class Grid {
    constructor(width, height, default_value=0) {
        this.content = [];
        for (let y = 0; y < height; y++) {
            this.content[y] = Array(width).fill(default_value);
        }
        this.width = width;
        this.height = height;
    }

    #check_bound(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw Error(`Out of bound access at (${x}, ${y})`)
        }
    }

    get(x, y) {
        this.#check_bound(x, y)
        return this.content[y][x];
    }

    set(x, y, value) {
        this.#check_bound(x, y)
        this.content[y][x] = value;
    }

    set_line(x0, y0, x1, y1, value) {
        const dx = x1 - x0;
        const dy = y1 - y0;
        const x_dir = Math.sign(dx);
        const y_dir = Math.sign(dy);

        if (dx != 0 && dy != 0) {
            throw Error("Only horizontal and vertical lines supported");
        }
        
        if (dx != 0) {
            for (let i = 0; i <= Math.abs(dx); i++) {
                this.set(x0 + (i * x_dir), y0, value);
            }
        }
        else {
            for (let i = 0; i <= Math.abs(dy); i++) {
                this.set(x0, y0 + (i * y_dir), value);
            }
        }
    }

    set_rect(x0, y0, x1, y1, value) {
        // Up side
        this.set_line(x0, y0, x1, y0, value);
        // Down side
        this.set_line(x0, y1, x1, y1, value);
        // Left side
        this.set_line(x0, y0, x0, y1, value);
        // Right side
        this.set_line(x1, y0, x1, y1, value);
    }

    set_from_rectangle(rectangle, value) {
        const rx = rectangle.x;
        const ry = rectangle.y; 
        this.set_rect(rx, ry, rx + rectangle.width - 1, ry + rectangle.height - 1, value)
    }

    set_filled_rect(x0, y0, x1, y1, value) {
        const dy = y1 - y0;
        const y_dir = Math.sign(dy);
        for (let i = 0; i <= Math.abs(dy); i++) {
            const target_y = y0 + (i * y_dir);
            this.set_line(x0, target_y, x1, target_y, value);
        }
    }

    set_filled_from_rectangle(rectangle, value) {
        const rx = rectangle.x;
        const ry = rectangle.y; 
        this.set_filled_rect(rx, ry, rx + rectangle.width - 1, ry + rectangle.height - 1, value)
    }

    toString() {
        const row_strings = Array.from(this.content, function(row) {
            return row.reduce(function (acc, val) {
                const symbol = val > 0 ? ' ' : '#'; 
                return acc + symbol;
            }, '');
        });
        return row_strings.join("\n")
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
        let playback_promise;
        try {
            if (this.moving) {
                return;
            }
            this.moving = true;
            state.player.set_facing(get_move_dir(this.x, x));
            let entity = state.get_entity(x, y);

            let graph = new Graph(transpose_array(state.get_collision_map()), {
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
            
            playback_promise = audios.sfx.booster.play()
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
        }
        finally {
            this.moving = false
            if (playback_promise) {
                audios.sfx.booster.pause()
            }
            audios.sfx.booster.currentTime = 0
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
    scale: 1.0,

    get_collision_map() {
        let map_data = structuredClone(this.map.grid.content);
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
    hole_offset;

    static Direction = {
        horizontal: 'H',
        vertical: 'V'
    }

    split(direction, offset) {
        this.split_direction = direction;
        this.split_offset = offset;
        if (direction == BSPNode.Direction.horizontal) {
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
        else if (direction == BSPNode.Direction.vertical) {
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

    get_branches() {
        if (this.left) {
            return [this].concat(this.left.get_branches()).concat(this.right.get_branches());
        }
        else {
            return []
        }
    }

    get_leaves() {
        if (! this.left) {
            return [this]
        }
        else {
            return this.left.get_leaves().concat(this.right.get_leaves());
        }
    }

    get_wall() {
        if (this.split_direction == BSPNode.Direction.horizontal) {
            return new Rectangle(
                this.rect.x,
                this.rect.y + this.split_offset,
                this.rect.width,
                1
            );
        }
        else if (this.split_direction == BSPNode.Direction.vertical) {
            return new Rectangle(
                this.rect.x + this.split_offset,
                this.rect.y,
                1,
                this.rect.height
            );
        }
        else {
            return null;
        }
    }

    get_walls() {
        if (! this.left) {
            return [];
        }

        const my_wall = this.get_wall();

        return [my_wall].concat(this.left.get_walls()).concat(this.right.get_walls())
    }

    toString() {
        let depth = this.id.length - 1;
        let indent = ' '.repeat(depth*4);
        let children;
        if (this.left) {
            children =
`{
${this.left.toString()}
${this.right.toString()}
${indent}}`
        }
        return `${indent}BSPNode(${this.id}: ${this.rect.toString()} ${children || "#"})`
    }
}

function generate_map(splits) {
    let grid = new Grid(48, 24);
    const root = new BSPNode("0", new Rectangle(1, 1, grid.width - 2, grid.height - 2));

    const MIN_SIZE = 5;
    const MAX_SIZE = 15;
    const do_splits = function(node, n) {
        if (n <= 0) {
            return;
        }
        if (node.rect.width <= MIN_SIZE && node.rect.height <= MIN_SIZE) {
            return;
        }
        if (node.rect.width <= MAX_SIZE &&
            node.rect.height <= MAX_SIZE &&
            chance.bool({likelihhod: 25})) {
            return
        }

        let split_dir;
        if (node.rect.width / node.rect.height > 1.25) {
            split_dir = BSPNode.Direction.vertical;
        }
        else if (node.rect.height / node.rect.width > 1.25) {
            split_dir = BSPNode.Direction.horizontal;
        }
        else {
            split_dir = chance.bool() ? BSPNode.Direction.horizontal : BSPNode.Direction.vertical;
        }

        let max;
        if (split_dir == BSPNode.Direction.horizontal) {
            max = node.rect.height - MIN_SIZE;
        }
        else {
            max = node.rect.width - MIN_SIZE;
        }

        if (max <= MIN_SIZE) {
            return;
        }

        node.split(split_dir, chance.integer({
            min: MIN_SIZE + 1,
            max: max}
        ));

        do_splits(node.left, n - 1);
        do_splits(node.right, n - 1);
    }

    do_splits(root, splits);

    for (const leaf of root.get_leaves()) {
        grid.set_filled_from_rectangle(leaf.rect, 1);
    }


    for (const branch of root.get_branches()) {
        let wall = branch.get_wall();


        let tried = [];
        while (true) {
            let hole_offset;
            let hole_pos = {x: null, y: null};
            let neighbor_deltas = [];

            if (branch.split_direction == BSPNode.Direction.horizontal) {
                hole_offset = chance.natural({min: 0, max: wall.width, exclude: tried});
                hole_pos.x = wall.x + hole_offset;
                hole_pos.y = wall.y;
                neighbor_deltas = [{x: 0, y: -1}, {x: 0, y: 1}];
            }
            else {
                hole_offset = chance.natural({min: 0, max: wall.height, exclude: tried});
                hole_pos.x = wall.x;
                hole_pos.y = wall.y  + hole_offset;
                neighbor_deltas = [{x: -1, y: 0}, {x: 1, y: 0}];
            }

            let ok_sides = 0;
            for (const leaf of branch.get_leaves()) {
                for (const delta of neighbor_deltas) {
                    if (leaf.rect.contains_point(
                        hole_pos.x + delta.x,
                        hole_pos.y + delta.y
                    )) {
                        ok_sides += 1;
                    }
                }
            }
            
            if (ok_sides == 2) {
                grid.set(hole_pos.x, hole_pos.y, 1);
                branch.hole_offset = hole_offset;
                break;
            }
            else {
                tried.push(hole_offset);
            }
        }
    }

    state.map.grid = grid;
    state.map.tree = root;

    return grid;
}

function render_map() {
    const new_table = document.createElement("table");
    new_table.id = "map-table";

    for (let y = 0; y < state.map.grid.height; y++) {
        let current_row = document.createElement("tr");

        for (let x = 0; x < state.map.grid.width; x++) {
            let current_cell = document.createElement("td");
            let cell_contents = document.createElement("div");

            cell_contents.setAttribute("x", x);
            cell_contents.setAttribute("y", y);
            cell_contents.classList.add("map-cell");

            if (state.map.grid.get(x, y) == 0) {
                cell_contents.classList.add("solid");
            }

            current_cell.appendChild(cell_contents);
            current_row.appendChild(current_cell);
        }

        new_table.appendChild(current_row)
    }

    const map_table = document.querySelector("#map-table");
    map_table.replaceWith(new_table);
}