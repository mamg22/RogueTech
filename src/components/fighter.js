import { Message } from '../common';

export class Fighter {
    constructor(hp, power, defense) {
        this.max_hp = hp;
        this.hp = hp;
        this.power = power;
        this.defense = defense;
    }

    take_damage(amount) {
        let results = [];
        this.hp -= amount;
        if (this.hp <= 0) {
            results.push({dead: this.owner})
        }
        return results
    }

    attack(target) {
        const damage = this.power - target.fighter.defense;

        let results = []

        if (damage > 0) {
            results.push({
                message: new Message(`${this.owner.name} ataca ${target.name} por ${damage} de daño`)
            });
            const damage_result = target.fighter.take_damage(damage);
            results.push(...damage_result);
        }
        else {
            results.push({
                message: new Message(`${this.owner.name} ataca ${target.name}, pero no causó daño`)
            });
        }
        return results;
    }

    heal(amount) {
        this.hp = Math.min(this.hp + amount, this.max_hp);
    }
}