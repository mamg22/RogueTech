import { get_move_dir } from './utility';

export class Entity {
    static Type = Object.freeze({
        player: 1,
        npc: 2,
        item: 3,
        stair: 4,
    })

    constructor(x, y, name, description, solid, sprite, facing=1, components={}) {
        this.id = Entity.id_counter++;

        this.x = x;
        this.y = y;
        this.name = name;
        this.descritpion = description;
        this.solid = solid;
        this.sprite = sprite;
        this.facing = this.facing;

        for (const component in components) {
            this[component] = components[component];
        }
    }

    set_facing(dir) {
        this.facing = Math.sign(dir);
        if (this.facing == 0 ) {
            this.facing = 1;
        }
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
