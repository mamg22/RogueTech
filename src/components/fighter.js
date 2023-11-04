export class Fighter {
    constructor(hp, power, defense) {
        this.max_hp = hp;
        this.hp = hp;
        this.power = power;
        this.defense = defense;
    }

    take_damage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            console.log(this, "Murio")
        }
    }

    attack(target) {
        const damage = this.power - target.fighter.defense;

        console.log(`${this.owner.name}${this.owner.id} attacks ${target.name}${target.id} for ${damage} damage`)
        if (damage > 0) {
            target.fighter.take_damage(damage);
        }
    }
}