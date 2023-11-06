import { Message } from './common';

function heal({entity, amount}) {
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