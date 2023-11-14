import { Point, Rectangle } from './common';
import { sprites } from './resources';
import { Entity } from './entity';
import { EnemyAIHandler } from './components/handler';
import { Fighter } from './components/fighter';
import { Stair } from './components/stair';
import { Item } from './components/item';
import { heal, drive_effect, cast_interference, cast_confusion, throw_water_bottle,
         instant_levelup } from './item-functions';
import { DatabaseItem } from './components/database-item';
import { SpriteSet } from './components/sprite-set';

class Grid {
    constructor(width, height, default_value=0) {
        this.content = [];
        for (let y = 0; y < height; y++) {
            this.content[y] = Array(width).fill(default_value);
        }
        this.width = width;
        this.height = height;
    }

    clone() {
        let clone = new Grid(this.width, this.height);
        clone.content = structuredClone(this.content);
        return clone;
    }

    check_bound(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw Error(`Out of bound access at (${x}, ${y})`)
        }
    }

    get(x, y) {
        this.check_bound(x, y)
        return this.content[y][x];
    }

    set(x, y, value) {
        this.check_bound(x, y)
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
        rng.bool({likelihood: config.SPLIT_END_CHANCE})) {
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

function generate_map(rng, level) {
    let grid = new Grid(27, 27);
    const root = new BSPNode("0", new Rectangle(1, 1, grid.width - 2, grid.height - 2));

    const SPLITS = 6;
    const split_config = {
        MIN_SIZE: 4,
        MAX_SIZE: 8,
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
        const wall_dimension = Math.max(wall.width, wall.height);
        
        // Generate with contents [0 .. wall_dim)
        let offsets = Array.from(Array(wall_dimension).keys());
        while (offsets.length > 0) {
            let hole_offset;
            let hole_pos = {x: null, y: null};
            let neighbor_deltas = [];

            hole_offset = rng.pickone(offsets);

            if (branch.split_direction == BSPNode.Direction.horizontal) {
                hole_pos.x = wall.x + hole_offset;
                hole_pos.y = wall.y;
                neighbor_deltas = [{x: 0, y: -1}, {x: 0, y: 1}];
            }
            else {
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

            offsets.splice(offsets.indexOf(hole_offset), 1);
            
            if (ok_sides == 2) {
                grid.set(hole_pos.x, hole_pos.y, 1);
                branch.hole_offset = hole_offset;
                // 25% chance to make another hole
                if (rng.bool({likelihood: 75})) {
                    break;
                }
            }
        }
    }

    return {grid: grid, tree: root};
}

function place_entities(rng, map, level) {
    const N_ENTITIES = 10;
    const N_ENEMIES = 10;
    const N_ITEMS = 10;

    const rooms = map.tree.get_leaves();

    let entities = [];
    let down_room = null;
    let up_room = null;

    // Required entities
    if (level === 1) {
        const room = rooms[0];
        down_room = 0;
        entities.push(new Entity(1, 1,
            "Salida", "Salida del edificio",
            false, sprites.decoration.door, Entity.Type.exit, 1, {}))
    }
    if (level < 5) {
        const room_idx = rng.integer({ min: rooms.length - 4, max: rooms.length - 1 });
        up_room = room_idx;
        const room = rooms[room_idx];
        const center_pos = room.rect.get_center();
        entities.push(new Entity(center_pos.x, center_pos.y,
            "Escalera", "Escalera hacia arriba",
            false, sprites.decoration.stair_up, Entity.Type.stair,
            1, {
                stair: new Stair(level, 1)
            }))
    }
    if (level > 1) {
        const room_idx = rng.integer({min: 0, max: 4});
        const room = rooms[room_idx];
        down_room = room_idx;
        const center_pos = room.rect.get_center();
        entities.push(new Entity(center_pos.x, center_pos.y,
            "Escalera", "Escalera hacia abajo",
            false, sprites.decoration.stair_down, Entity.Type.stair,
            1, {
                stair: new Stair(level, -1)
            }))
    }

    for (let i = 0; i < N_ENEMIES; i++) {
        const enemy_templates = [
            ["Robot básico", "Un robot enemigo. Es el modelo más básico, uno de los prototipos iniciales, no son muy resistentes",
                true, sprites.bot1.standing, Entity.Type.npc, -1, {
                handler: new EnemyAIHandler(),
                fighter: new Fighter(8, 5, 2, 60, 100),
                sprite_set: new SpriteSet(sprites.bot1),
            }],
            ["Robot acorazado", "Un robot enemigo. Este modelo fue construido con materiales resistentes como fibra de carbono y acero. Puede resistir bien los daños, pero es lento al moverse, reduciendo su capacidad de ataque", true, sprites.bot2.standing, Entity.Type.npc, -1, {
                handler: new EnemyAIHandler(),
                fighter: new Fighter(60, 8, 12, 120, 500),
                sprite_set: new SpriteSet(sprites.bot2),
            }],
            ["Robot ligero", "Un robot enemigo. Posee un diseño ligero, que le permite moverse con agilidad. Esta velocidad adicional le permite asestar golpes más potentes, pero es altamente vulnerable a los golpes.", true, sprites.bot3.standing, Entity.Type.npc, -1, {
                handler: new EnemyAIHandler(),
                fighter: new Fighter(20, 10, 1, 100, 350),
                sprite_set: new SpriteSet(sprites.bot3),
            }],
            ["Robot láser", "Un robot enemigo. Diseñado para asistir en la manufactura de piezas metálicas, este robot ha sido modificado maliciosamente para usar su láser contra sus oponentes",
                true, sprites.bot4.standing, Entity.Type.npc, -1, {
                handler: new EnemyAIHandler(),
                fighter: new Fighter(30, 16, 3, 120, 500),
                sprite_set: new SpriteSet(sprites.bot4),
            }],
            ["Robot flotante", "Un robot enemigo. Flota mediante un conjunto de materiales superconductores y magnéticos que, bajo las condiciones de temperatura correctas, le permitirán levitar.",
                true, sprites.bot5.standing, Entity.Type.npc, -1, {
                handler: new EnemyAIHandler(),
                fighter: new Fighter(16, 8, 5, 90, 300),
                sprite_set: new SpriteSet(sprites.bot5),
            }],
            ["Robot robusto", "Un robot enemigo. Creado cuidadosamente con plásticos impresos en 3D; las complejas estructuras descubiertas por diversos investigadores pueden resistir mejor el peso y los impactos, a la vez que hace uso más eficiente de los recursos.",
            true, sprites.bot6.standing, Entity.Type.npc, -1, {
                handler: new EnemyAIHandler(),
                fighter: new Fighter(12, 4, 4, 80, 150),
                sprite_set: new SpriteSet(sprites.bot6),
            }],
        ];

        const floor_weights = [
            [90, 0, 0, 0, 0, 10],
            [50, 0, 0, 0, 20, 30],
            [0, 15, 15, 0, 50, 20],
            [0, 40, 40, 0, 20, 0],
            [0, 33, 33, 33, 1, 0],
        ]

        while (true) {
            const room_idx = rng.integer({ min: 0, max: rooms.length - 1 });
            if (room_idx == up_room || room_idx == down_room) {
                continue;
            }
            const room = rooms[room_idx];
    
            const room_pos = room.rect.get_random_point(rng);
            if (entities.some(function(elem) {
                return elem.x == room_pos.x && elem.y == room_pos.y
            })) {
                continue;
            }
            const entity_idx = rng.integer({min: 0, max: enemy_templates.length - 1});
            let template = rng.weighted(enemy_templates, floor_weights[level - 1]);
            // let template = enemy_templates[entity_idx]
            let entity = new Entity(
                room_pos.x, room_pos.y,
                ...template
            );
    
            entities.push(entity);
            break;
        }
    }

    for (let i = 0; i < N_ITEMS; i++) {
        const item_templates = [
            ["Botella de agua",
                "Una botella con 1L de agua. No es muy util para tí, pero podrías probar lanzandola. Al lanzarla esparcirá agua, causando cortocircuitos y daños en los electronicos que se encuentren cerca.",
                false, sprites.items.water_bottle, Entity.Type.item, 1, {
                item: new Item(throw_water_bottle, true, "Elige donde lanzar la botella...", {damage: 4 + 4*level, radius: 1}),
            }],
            ["CD: DDOS.exe",
                "Al frente dice que contiene un programa para causar un ataque DDOS, enviando inmensas cantidades de información a un lugar específico. Causará que el enemigo más cercano a tí sufra daños",
                false, sprites.items.cd, Entity.Type.item, 1, {
                item: new Item(cast_interference, false, null, {damage: 5 + 5 * level, maximum_range: 8}),
                database_item: new DatabaseItem('cd'),
            }],
            ["CD: aturdidor.exe",
                "Al frente dice que contiene un programa para aturdir un enemigo. Causará que el enemigo que elijas sea aturdido por 10 turnos, haciendolo incapaz de seguirte o siquiera moverse correctamente",
                false, sprites.items.cd, Entity.Type.item, 1, {
                item: new Item(cast_confusion, true, "Elige un enemigo para aturdir", {duration: 10 + 3 * level}),
                database_item: new DatabaseItem('cd'),
            }],
            ["Pendrive",
                "Un pendrive desconocido. Quizá puedas ver lo que tiene dentro, aunque no se si sea muy seguro.",
                false, sprites.items.pendrive, Entity.Type.item, 1, {
                item: new Item(drive_effect, false, null, {heal_amount: 10 + 5 * level, damage_amount: 10 + 5 * level}),
                database_item: new DatabaseItem("pendrive")
            }],
            ["Kit de herramientas",
                "Un pequeño conjunto de herramientas útil para reparaciones sencillas de electrónicos. Destornilladores de multiples tamaños, pinzas y un pincel para sacar el polvo. Usarlo reparará el 25% de tus daños.",
                false, sprites.items.toolkit, Entity.Type.item, 1, {
                    item: new Item(heal, false, null, {amount_percent: 0.25})
                }
            ],
            ["Caja de herramientas",
                "Un conjunto de herramientas bastante completo para reparaciones de electrónicos, además de docenas de destornilladores y herramientas, tiene estaño y un soldador, un multímetro para medir la corriente eléctrica, ¡e incluso una guía para solventar problemas comunes!. Usarlo reparará el 50% de tus daños.",
                false, sprites.items.toolbox, Entity.Type.item, 1, {
                    item: new Item(heal, false, null, {amount_percent: 0.50})
                }
            ],
            ["Mejora de CPU",
                "Cambiará tu CPU actual por uno más nuevo. Subirás inmediatamente al siguiente nivel",
                false, sprites.items.level_up_chip, Entity.Type.item, 1, {
                    item: new Item(instant_levelup, false, null, {})
                }
            ],
            ["Disquete",
                "Un medio de almacenamiento común en los años 80 y 90.",
                false, sprites.items.floppy, Entity.Type.item, 1, {
                    database_item: new DatabaseItem('floppy')
                }
            ],
            ["Disquete etiquetado",
                "Un medio de almacenamiento común en los años 80 y 90. Tiene algo escrito en la etiqueta que tiene al frente, quizá pueda contener información sobre que sucedió.",
                false, sprites.items.floppy, Entity.Type.item, 1, {
                    database_item: new DatabaseItem('story' + rng.integer({min: 1, max: 9})),
                }
            ]
        ];
        item_weights = [100, 50, 50, 100, 100, 10, 5, 10, 10]
    
        while (true) {
            const room_idx = rng.integer({ min: 0, max: rooms.length - 1 });
            const room = rooms[room_idx];
    
            const room_pos = room.rect.get_random_point(rng);
            if (entities.some(function(elem) {
                return elem.x == room_pos.x && elem.y == room_pos.y
            })) {
                continue;
            }

            let template = rng.weighted(item_templates, item_weights);
            let entity = new Entity(
                room_pos.x, room_pos.y,
                ...template
            );
    
            entities.push(entity);
            break;
        }
    }



    return entities;
}

export class Level {
    constructor(number, map, entities=[]) {
        this.number = number;
        this.map = map;
        this.entities = entities;

        const map_collisions = new Grid(map.grid.width, map.grid.height);
        for (let y = 0; y < map_collisions.height; y++) {
            for (let x = 0; x < map_collisions.width; x++) {
                const tile = map.grid.get(x, y);
                if (tile == 0) {
                    map_collisions.set(x, y, 0);
                }
                else {
                    map_collisions.set(x, y, 1)
                }
            }
        }
        this.map_collisions = map_collisions;
    }

    get_map_collision(x, y) {
        return this.map_collisions.get(x, y) == 0;
    }
    get_entity_collision(x, y) {
        for (let entity of this.entities) {
            if (entity.x == x && entity.y == y && entity.solid) {
                return true;
            }
        }
        return false;
    }
    get_collision_at(x, y) {
        const map_collide = this.map_collisions.get(x, y) == 0;
        const entity_collide = this.get_entity_collision(x, y);

        return map_collide || entity_collide;
    }
    get_collision_map() {
        let map_data = this.map_collisions.clone();
        for (let entity of this.entities) {
            if (entity.solid) {
                map_data.set(entity.x, entity.y, 0);
            }
        }
        return map_data;
    }
    get_entities() {
        // Sort by type, ascending
        return Array.from(this.entities).sort(function (a, b) {
            return a.type - b.type;
        });
    }
    get_entities_at(x, y) {
        let found = [];
        for (const entity of this.entities) {
            if (entity.x == x && entity.y == y) {
                found.push(entity);
            }
        }
        // Sort by priotity
        found.sort(function (a, b) {
            return a.type - b.type;
        })
        return found;
    }
    get_entity_by_id(id) {
        return this.entities.find(function(elem) {
            return elem.id === id;
        });
    }
    remove_entity(entity) {
        let idx = this.entities.indexOf(entity);
        if (idx !== -1) {
            this.entities.splice(idx, 1)
        }
    }
    remove_entity_by_id(id) {
        let idx = this.entities.findIndex(function(elem) {
            return elem.id === id;
        });
        if (idx !== -1) {
            this.entities.splice(idx, 1)
        }
    }
    add_entity(entity) {
        this.entities.push(entity);
    }
}

export function generate_level(rng, level) {
    const game_map = generate_map(rng, level);
    const entities = place_entities(rng, game_map, level)

    return new Level(level, game_map, entities);
}
