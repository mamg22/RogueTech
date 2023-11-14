export class SpriteSet {
    constructor(set) {
        for (const prop in set) {
            this[prop] = set[prop];
        }
    }
}