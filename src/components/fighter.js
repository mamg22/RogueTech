import { Message } from '../common';

export class Fighter {
    constructor(hp, power, defense) {
        this.max_hp = hp;
        this.hp = hp;
        this.power = power;
        this.defense = defense;
    }

    take_damage(amount) {
        this.hp -= amount;
    }

    attack(target) {
        const damage = this.power - target.fighter.defense;

        let results = []

        if (damage > 0) {
            results.push({
                message: new Message(`${this.owner.name} ataca ${target.name} por ${damage} de daño`)
            });
            target.fighter.take_damage(damage);
        }
        else {
            results.push({
                message: new Message(`${this.owner.name} ataca ${target.name}, pero no causó daño`)
            });
        }
        return results;
    }
}