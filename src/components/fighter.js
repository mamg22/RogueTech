class Fighter {
    constructor(hp, power, defense) {
        this.max_hp = hp;
        this.hp = hp;
        this.power = power;
        this.defense = defense;
    }

    take_damage(amount) {
        self.hp -= amount;
    }

    def attack(target) {
        const damage = self.power - target.fighter.defense;

        if (damage > 0) {
            target.fighter.take_damage(damage);
        }
    }
}