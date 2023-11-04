export class Stair {
    constructor(floor, direction) {
        this.floor = floor;
        this.direction = direction;
        this.target_floor = floor + direction;
    }
}