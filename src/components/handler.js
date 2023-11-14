import { Point } from '../common';
import { find_path, global_rng } from '../utility';

export class PlayerHandler {
    constructor() {
        this.action_queue = [];
        this.astar_mode = false;
    }
    next_action(player, level) {
        const action = this.action_queue[0];
        const owner = this.owner;        
        
        if (action) {
            if (action.move_astar) {
                const map = level.get_collision_map().content
                const route = find_path(map, owner.x, owner.y, action.move_astar.x, action.move_astar.y, false);
                if (route.length > 1) {
                    this.astar_mode = true;
                    this.action_queue.unshift(action);
                }
                else {
                    this.astar_mode = false
                }
            }
        }
        return this.action_queue.shift();
    }
    has_action() {
        return this.action_queue.length > 0 || this.astar_mode;
    }
    push_action(action) {
        return this.action_queue.push(action)
    }
    clear_actions() {
        this.action_queue = [];
        this.astar_mode = false;
    }
}

export class AIWallBump {
    constructor() {
        this.next_direction();
    }
    next_direction() {
        let direction_x = 0;
        let direction_y = 0;
        while (direction_x === 0 && direction_y === 0) {
            direction_x = global_rng.weighted([-1, 0, 1], [1, 3, 1]);
            direction_y = global_rng.weighted([-1, 0, 1], [1, 3, 1]);
        }
        this.direction_x = direction_x;
        this.direction_y = direction_y;

    }
    next_action(owner, player, level) {
        if (level.get_collision_at(owner.x + this.direction_x, owner.y + this.direction_y)) {
            this.next_direction();
            return {wait: true}
        }
        return {move_rel: new Point(this.direction_x, this.direction_y)}
    }
}

export class AIStatic {
    constructor(){
    }
    next_action(owner, player, level) {
        return {wait: true}
    }
}

export class AIGuarding {
    constructor() {
        this.target = null;
        this.retarget_cooldown = 8;
    }
    next_action(owner, player, level) {
        if (this.target) {
            if ( (owner.x === this.target.x && owner.x === this.target.y) ||
                level.get_collision_at(this.target.x, this.target.y)) {
                this.target = null;
                this.retarget_cooldown = 8;
            }
            return {move_astar: this.target};
        }
        else {
            if (this.retarget_cooldown <= 0) {
                const rooms = level.map.tree.get_leaves();
                const room_idx = global_rng.integer({min: 0, max: rooms.length - 1});
                const room = rooms[room_idx];
                const center_pos = room.rect.get_center();
                this.target = center_pos;
            }
            else {
                this.retarget_cooldown--;
            }
            return {wait: true};
        }
    }
}

export class AIRoomGuarding {
    constructor() {
        this.target = null;
        this.home_room = null;
        this.room_corners = null;
        this.retarget_cooldown = 3;
    }
    next_action(owner, player, level) {
        if (!this.home_room) {
            const rooms = level.map.tree.get_leaves();
            for (const room of rooms) {
                if (room.rect.contains_point(owner.x, owner.y)) {
                    this.home_room = room;
                    break;
                }
            }

            const rect = this.home_room.rect;

            this.room_corners = [
                new Point(rect.x + 1, rect.y + 1),
                new Point(rect.x + rect.width - 2, rect.y + 1),
                new Point(rect.x + 1, rect.y + rect.height - 2),
                new Point(rect.x + rect.width - 2, rect.y + rect.height - 2),
            ];
        }
        if (this.target) {
            if ( (owner.x === this.target.x && owner.x === this.target.y) ||
                level.get_collision_at(this.target.x, this.target.y)) {
                this.target = null;
                this.retarget_cooldown = 3;
            }
            return {move_astar: this.target};
        }
        else {
            if (this.retarget_cooldown <= 0) {
                this.target = global_rng.pickone(this.room_corners);
            }
            else {
                this.retarget_cooldown--;
            }
            return {wait: true};
        }
    }
}

export class EnemyAIHandler {
    constructor() {
        this.last_known_pos = null;
        this.sight_count = 0;
        const availableAI = [
            AIStatic,
            AIGuarding,
            AIRoomGuarding,
            AIWallBump,
        ];
        const selectedAI = global_rng.weighted(availableAI, [1, 2, 1, 2])
        this.default_ai = new selectedAI();
    }
    next_action(player, level) {
        const owner = this.owner
        const map = level.get_collision_map().content
        let action = {};
        if (this.owner.can_reach(player.x, player.y) && this.last_known_pos) {
            action = {attack: player};
        }
        else if (this.owner.can_see(player, level, 5) ||
            Math.abs(this.owner.x - this.last_known_pos?.x) <= 2 &&
            Math.abs(this.owner.y - this.last_known_pos?.y) <= 2) {
            if (this.last_known_pos) {
                const route = find_path(map, owner.x, owner.y, this.last_known_pos.x, this.last_known_pos.y, true);
                if (route.length > 0 && route.length < 6) {
                    action = {move_astar: new Point(this.last_known_pos.x, this.last_known_pos.y)};
                }    
            }
            this.last_known_pos = new Point(player.x, player.y);
        }
        else {
            action = this.default_ai.next_action(this.owner, player, level);
        }
        return action;
    }
    has_action() {
        return true;
    }
    clear_actions() {
        return undefined;
    }
}

export class ConfusedHandler {
    constructor(previous_ai, number_of_turns=10) {
        this.previous_ai = previous_ai;
        this.number_of_turns = number_of_turns;
    }

    next_action(player, level) {
        if (this.number_of_turns > 0) {
            const direction_x = global_rng.integer({min: -1, max: 1});
            const direction_y = global_rng.integer({min: -1, max: 1});

            this.number_of_turns--;
            if (this.owner.can_move_relative(direction_x, direction_y, level)) {
                return {move_rel: new Point(direction_x, direction_y)}
            }
            else {
                return {wait: true};
            }
        }
        else {
            this.owner.handler = this.previous_ai;
            return {wait: true};
        }
    }
}

export class BossHandler {
    constructor() {
        this.last_known_pos = null;
        this.sight_count = 0;
        this.turn_skip_counter = 0;
        this.target = null;
        this.retarget_cooldown = 1;
    }
    next_action(player, level) {
        this.turn_skip_counter++;

        const owner = this.owner
        const map = level.get_collision_map().content
        let action = {};
        if (this.owner.can_reach(player.x, player.y)) {
            action = {attack: player};
        }
        else if (this.turn_skip_counter == 4) {
            this.turn_skip_counter = 0;
            action = {wait: true}
        }
        else if (this.owner.can_see(player, level, 99)) {
            action = {move_astar: new Point(player.x, player.y)};
        }
        else {
            if (this.target) {
                if ( (owner.x === this.target.x && owner.x === this.target.y) ||
                    level.get_collision_at(this.target.x, this.target.y)) {
                    this.target = null;
                    this.retarget_cooldown = 1;
                }
                return {move_astar: this.target};
            }
            else {
                if (this.retarget_cooldown <= 0) {
                    this.target = global_rng.pickone([
                        new Point(2, 2),
                        new Point(2, 17),
                        new Point(17, 2),
                        new Point(17, 17),
                    ]);
                }
                else {
                    this.retarget_cooldown--;
                }
                return {wait: true};
            }
            }
        return action;
    }
    has_action() {
        return true;
    }
    clear_actions() {
        return undefined;
    }
}
