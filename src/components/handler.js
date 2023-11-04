import { Point } from '../common';
import { find_path } from '../utility';

export class PlayerHandler {
    constructor() {
        this.action_queue = [];
    }
    next_action() {
        return this.action_queue.shift();
    }
    has_action() {
        return this.action_queue.length > 0;
    }
    push_action(action) {
        return this.action_queue.push(action)
    }
    clear_actions() {
        this.action_queue = [];
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
        if (this.owner.can_reach(player.x, player.y)) {
            this.owner.fighter.attack(player);
            return {attack: player};
        }
        if (this.owner.can_see(player, level, 5)) {
            this.sight_count = Math.min(this.sight_count + 1, 2);
            if (this.sight_count >= 2) {
                this.last_known_pos = new Point(player.x, player.y);
            }
        }
        else {
            this.sight_count = Math.max (this.sight_count - 1, 0);
        }
        if (! this.last_known_pos) {
            return {};
        }
        const route = find_path(map, owner.x, owner.y, this.last_known_pos.x, this.last_known_pos.y, true);
        if (route.length > 0 && route.length < 6) {
            const step = route[0];
            return {move: new Point(step.x, step.y)};
        }
        return {}
    }
    has_action() {
        return true;
    }
    clear_actions() {
        return undefined;
    }
}