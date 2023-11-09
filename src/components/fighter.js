import { Message } from '../common';

export class Fighter {
    constructor(hp, power, defense, xp=0) {
        this.max_hp = hp;
        this.hp = hp;
        this.power = power;
        this.defense = defense;
        this.xp = xp;
    }

    take_damage(amount) {
        let results = [];
        this.hp = Math.max(this.hp - amount, 0);
        if (this.hp <= 0) {
            results.push({dead: this.owner, xp: this.xp})
        }
        return results;
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
        let results = [];
        this.hp = Math.min(this.hp + amount, this.max_hp);
        return results;
    }
}