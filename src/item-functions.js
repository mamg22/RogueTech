import { Message, Point } from './common';
import { global_rng, distance_between } from './utility';

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
            message: new Message("¡El pendrive contenía virus y te ha causado daño!", 'red'),
            consumed: 1,
        });
    }

    return results;
}

export function cast_interference(entity, {damage, maximum_range, level}) {
    let results = [];

    let target = null
    let closest_distance = maximum_range + 1;

    for (const possible_target of level.get_entities()) {
        if ('fighter' in possible_target &&
            possible_target.id !== entity.id &&
            entity.can_see(possible_target, level, maximum_range)) {
            const distance = distance_between(
                entity.x, entity.y,
                possible_target.x, possible_target.y
            );
            
            if (distance < closest_distance) {
                target = possible_target;
                closest_distance = distance;
            }
        }
    }

    if (target) {
        results.push({
            item_consumed: true,
            target: target,
            message: new Message(`La interferencia afecta al ${target.name}, causando ${damage} de daños`, 'default'),
            consumed: 1,
        });
        let cast_results = target.fighter.take_damage(damage);
        results.push(...cast_results);
    }
    else {
        results.push({
            item_consumed: false,
            target: null,
            message: new Message(`No hay enemigos cercanos y visibles a los que atacar...`, 'yellow'),
            consumed: 0,
        });
    }

    return results;
}

export function throw_water_bottle(entity, {level, damage, radius, x, y}) {
    let results = [];

    if (!entity.can_see(new Point(x, y), level, 99)) {
        results.push({
            item_consumed: false,
            message: new Message("No puedes lanzarlo allí, ¡está bloqueado por una pared!", 'yellow'),
            consumed: 0,
        });
        return results;
    }

    results.push({
        item_consumed: true,
        message: new Message("La botella salpica agua, mojando todo su alrededor", 'orange'),
        consumed: 1,
    });

    for (const target of level.get_entities()) {
        const dx = Math.abs(target.x - x);
        const dy = Math.abs(target.y - y);

        if (dx <= 1 && dy <= 1 && target.fighter) {
            results.push({
                message: new Message(
                    `El agua causa cortocircuitos en el ${target.name} y causa ${damage} de daño`,
                    'orange'
                )
            });
            let damage_results = target.fighter.take_damage(damage);
            results.push(...damage_results);
        }
    }

    return results;
}