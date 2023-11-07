import { Point } from '../common';
import { find_path } from '../utility';

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

export class RandomWalkHandler {
    constructor() {
        this.last_known_pos = null;
        this.sight_count = 0;
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
        return action;
    }
    has_action() {
        return true;
    }
    clear_actions() {
        return undefined;
    }
}