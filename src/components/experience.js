export class Experience {
    constructor(current_level=1, current_xp=0, level_up_base=200, level_up_factor=150) {
        this.current_level = current_level;
        this.current_xp = current_xp;
        this.level_up_base = level_up_base;
        this.level_up_factor = level_up_factor;
    }

    get experience_to_next_level() {
        return this.level_up_base + this.current_level * this.level_up_factor;
    }

    add_xp(xp) {
        this.current_xp += xp;

        if (this.current_xp >= this.experience_to_next_level) {
            this.current_xp -= this.experience_to_next_level;
            this.current_level++;

            return true;
        }
        else {
            return false;
        }
    }
}