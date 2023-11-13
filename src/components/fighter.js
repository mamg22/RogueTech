import { Message } from '../common';
import { global_rng } from '../utility';

export class Fighter {
    constructor(hp, power, defense, xp=0, score=0) {
        this.max_hp = hp;
        this.hp = hp;
        this.power = power;
        this.defense = defense;
        this.xp = xp;
        this.score = score;
    }

    take_damage(amount) {
        let results = [];
        this.hp = Math.max(this.hp - amount, 0);
        if (this.hp <= 0) {
            results.push({dead: this.owner, xp: this.xp, score: this.score})
        }
        return results;
    }

    attack(target) {
        let results = []

        const fail_attack = global_rng.bool({likelihood: 10});

        const damage = this.power - target.fighter.defense;

        if (fail_attack) {
            results.push({
                message: new Message(`${this.owner.name} ataca ${target.name}, pero falla`)
            })
        }
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