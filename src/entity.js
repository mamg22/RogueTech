import { get_move_dir } from './utility';

export class Entity {
    static Type = Object.freeze({
        player: 1,
        npc: 2,
        item: 3,
        stair: 4,
        decoration: 5,
    })

    constructor(x, y, name, description, solid, sprite, type, facing=1, components={}) {
        this.id = Entity.id_counter++;

        this.x = x;
        this.y = y;
        this.name = name;
        this.descritpion = description;
        this.solid = solid;
        this.sprite = sprite;
        this.type = type;
        this.facing = this.facing;

        for (const component_name in components) {
            const component = components[component_name];
            this[component_name] = component;
            component.owner = this;
        }
    }

    set_facing(dir) {
        this.facing = Math.sign(dir);
        if (this.facing == 0 ) {
            this.facing = 1;
        }
    }

    can_see(target, level, max_distance) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;

        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        const max_orth_dist = Math.max(Math.abs(dx), Math.abs(dy));

        if (distance > max_distance) {
            return false;
        }

        for (let i = 1; i <= max_orth_dist; i++) {
            const dist_frac = i / max_orth_dist;
            const x = this.x + Math.round(dx * dist_frac);
            const y = this.y + Math.round(dy * dist_frac);
            if (level.get_map_collision(x, y)) {
                return false;
            }
        }
        return true;
    }

    can_move(x, y) {
        
    }
    
    move(x, y) {
        this.set_facing(get_move_dir(this.x, x));
        this.x = x;
        this.y = y;

        return true;
    }
    move_relative(x_delta, y_delta) {
        this.move(this.x + x_delta, this.y + y_delta)
    }

    static id_counter = 0;
}
