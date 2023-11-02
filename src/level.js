import { Rectangle } from './common';
import { sprites } from './resources';
import { Entity } from './main';

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

function do_map_splits(rng, node, n, config) {
    if (n <= 0) {
        return;
    }
    if (node.rect.width <= config.MIN_SIZE && node.rect.height <= config.MIN_SIZE) {
        return;
    }
    if (node.rect.width <= config.MAX_SIZE &&
        node.rect.height <= config.MAX_SIZE &&
        rng.bool({likelihhod: config.SPLIT_END_CHANCE})) {
        return
    }

    let split_dir;
    if (node.rect.width / node.rect.height > config.WIDTH_THRESHOLD) {
        split_dir = BSPNode.Direction.vertical;
    }
    else if (node.rect.height / node.rect.width > config.HEIGHT_THRESHOLD) {
        split_dir = BSPNode.Direction.horizontal;
    }
    else {
        split_dir = rng.bool() >= config.RANDOM_SPLIT_THRESHOLD ? BSPNode.Direction.horizontal : BSPNode.Direction.vertical;
    }

    let max;
    if (split_dir == BSPNode.Direction.horizontal) {
        max = node.rect.height - config.MIN_SIZE;
    }
    else {
        max = node.rect.width - config.MIN_SIZE;
    }

    if (max <= config.MIN_SIZE) {
        return;
    }

    node.split(split_dir, rng.integer({
        min: config.MIN_SIZE,
        max: max}
    ));

    do_map_splits(rng, node.left, n - 1, config);
    do_map_splits(rng, node.right, n - 1, config);
}

function generate_map(rng) {
    let grid = new Grid(48, 24);
    const root = new BSPNode("0", new Rectangle(1, 1, grid.width - 2, grid.height - 2));

    const SPLITS = 5;
    const split_config = {
        MIN_SIZE: 5,
        MAX_SIZE: 12,
        SPLIT_END_CHANCE: 25,
        WIDTH_THRESHOLD: 1.25,
        HEIGHT_THRESHOLD: 1.25,
        RANDOM_SPLIT_THRESHOLD: 0.5,
    };

    do_map_splits(rng, root, SPLITS, split_config);

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
                hole_offset = rng.natural({min: 0, max: wall.width, exclude: tried});
                hole_pos.x = wall.x + hole_offset;
                hole_pos.y = wall.y;
                neighbor_deltas = [{x: 0, y: -1}, {x: 0, y: 1}];
            }
            else {
                hole_offset = rng.natural({min: 0, max: wall.height, exclude: tried});
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

    return {grid: grid, tree: root};
}

function place_entities(rng, map) {
    const N_ENTITIES = 10;

    const entity_templates = [
        [ 9, 3, "Robot", "X", true, sprites.enemy.standing, -1],
        [ 24, 13, "Botella de agua", "X", false, sprites.items.water_bottle, 1],
        [ 3, 12, "DVD", "X", false, sprites.items.dvd, 1],
        [ 29, 7, "Pendrive", "X", false, sprites.items.pendrive, 1],
        [ 20, 2, "Maquina", "X", true, sprites.decoration.vending_machine, 1],
    ];

    let entities = [];

    // Exclude the first room, which is all the way to the left in the tree
    // So first in the array
    const rooms = map.tree.get_leaves().slice(1);
    for (let i = 0; i < N_ENTITIES; i++) {
        const room_idx = rng.integer({ min: 0, max: rooms.length - 1 });
        const room = rooms[room_idx];

        const room_pos = room.rect.get_random_point(rng);
        const entity_idx = rng.integer({min: 0, max: entity_templates.length - 1});
        let template = entity_templates[entity_idx]
        let entity = new Entity(
            room_pos.x, room_pos.y,
            template[2], template[3], template[4], template[5]
        );

        entities.push(entity);
    }

    return entities;
}

export class Level {
    constructor(number, map, entities) {
        this.number = number;
        this.map = map;
        this.entities = entities;
        this.last_player_pos = null
    }

    set_last_pos(x, y) {
        this.last_player_pos = new Point(x, y)
    }
}

export function generate_level(rng, level) {
    const game_map = generate_map(rng);
    const entities = place_entities(rng, game_map)

    return new Level(level, game_map, entities);
}
