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
    next_action(player, level) {
        const owner = this.owner
        const map = level.get_collision_map().content
        const route = find_path(map, owner.x, owner.y, player.x, player.y, true);
        if (route.length > 0 && route.length < 5) {
            const step = route[0];
            if (! level.get_collision_at(step.x, step.y));
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