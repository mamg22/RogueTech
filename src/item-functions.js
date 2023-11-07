import { Message } from './common';
import { global_rng } from './utility';

export function heal(entity, {amount}) {
    let results = [];

    if (entity.fighter.hp === entity.fighter.max_hp) {
        results.push({
            item_consumed: false,
            message: new Message("Ya estás al máximo de salud", 'yellow'),
            consumed: 0,
        });
    }
    else {
        entity.fighter.heal(amount);
        results.push({
            item_consumed: true,
            message: new Message("Has reparado parte de tus daños", 'green'),
            consumed: 1,
        });
    }

    return results;
}

export function drive_effect(entity, {heal_amount, damage_amount}) {
    let results = [];

    const is_good = global_rng.bool();
    let amount;
    if (is_good) {
        amount = heal_amount;
        let heal_results = entity.fighter.heal(amount);
        results.push(...heal_results);
        results.push({
            item_consumed: true,
            message: new Message("¡El pendrive contenía software útil y has sido reparado!", 'green'),
            consumed: 1,
        });
    }
    else {
        amount = damage_amount;
        let damage_results = entity.fighter.take_damage(amount);
        results.push(...damage_results);
        results.push({
            item_consumed: true,
            message: new Message("¡El pendrive contenía software malicioso y te ha causado daño!", 'red'),
            consumed: 1,
        });
    }

    return results;
}