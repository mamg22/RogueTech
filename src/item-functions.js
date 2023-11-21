import { Message, Point } from './common';
import { global_rng, distance_between } from './utility';
import { ConfusedHandler } from './components/handler';

export function heal(entity, {amount, amount_percent}) {
    let results = [];
    let heal_amount;

    if (amount_percent) {
        heal_amount = Math.ceil(entity.fighter.max_hp * amount_percent);
    }
    else {
        heal_amount = amount;
    }

    if (entity.fighter.hp === entity.fighter.max_hp) {
        results.push({
            item_consumed: false,
            message: new Message("¡No tienes daños que reparar!", 'yellow'),
            consumed: 0,
        });
    }
    else {
        entity.fighter.heal(heal_amount);
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

export function cast_confusion(entity, {player, level, x, y, duration}) {
    let results = [];

    if (!entity.can_see(new Point(x, y), level, 8)) {
        results.push({
            item_consumed: false,
            message: new Message("No puedes usarlo contra un enemigo si no es visible o está lejos", 'yellow'),
            consumed: 0,
        });
        return results;
    }

    const entities = level.get_entities();
    let found_target = false;

    for (const target of entities) {
        if (target.x == x && target.y == y && target.handler) {
            if (target === player) {
                results.push({
                    item_consumed: false,
                    message: new Message("¡No puedes usarlo en tí mismo!", 'yellow'),
                    consumed: 0,
                });
            }
            const confused_handler = new ConfusedHandler(target.handler, duration)
            confused_handler.owner = target;
            target.handler = confused_handler;

            results.push({
                item_consumed: true,
                message: new Message(`El ${target.name} es aturdido!`, 'green'),
                consumed: 1,
            });

            found_target = true;
            break;
        }
    }
    if (!found_target) {
        results.push({
            item_consumed: false,
            message: new Message("No hay un enemigo ahí", 'yellow'),
            consumed: 0,
        });
    }


    return results;
}

export function instant_levelup(entity) {
    let results = [];

    let current_xp = entity.experience.current_xp;
    let next_level_xp = entity.experience.experience_to_next_level;

    results.push({
        xp: next_level_xp - current_xp,
        item_consumed: true,
        consumed: 1,
    });

    return results
}

export function up_fighter_stat(entity, {max_hp, power, defense}) {
    let results = [];

    results.push({
        item_consumed: true,
        consumed: 1,
    });

    if (max_hp) {
        entity.fighter.max_hp += max_hp;
        entity.fighter.hp += hp;

        results.push({
            message: new Message("Tu tolerancia a los daños ha mejorado", 'green')
        })
    }
    if (power) {
        entity.fighter.power += power;
        results.push({
            message: new Message("Tu poder ofensivo ha mejorado", 'green')
        })

    }
    if (defense) {
        entity.fighter.defense += defense;
        results.push({
            message: new Message("Tu defensa ha mejorado", 'green')
        })
    }

    return results;
}

export function up_inventory_size(entity, {increment}) {
    let results = [];

    entity.inventory.capacity += increment;

    results.push({
        item_consumed: true,
        consumed: 1,
        message: new Message(`¡Ahora puedes guardar ${increment} items más!`, 'green')
    });

    return results;
}

export function set_spare_cpu(entity) {
    let results = [];

    if (entity.fighter.spare) {
        results.push({
            message: new Message("¡Ya tienes una CPU de repuesto preparada!", 'yellow'),
            item_consumed: false,
            consumed: 0,
        })
    }
    else {
        entity.fighter.spare = true;
        results.push({
            message: new Message("La CPU está preparada para emergencia", 'yellow'),
            item_consumed: true,
            consumed: 1,
        })
    }

    return results;
}