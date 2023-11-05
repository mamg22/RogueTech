export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    contains_point(x, y) {
        return x >= this.x && x < this.x + this.width &&
               y >= this.y && y < this.y + this.height;
    }

    get_random_point(rng) {
        const x = rng.natural({min: this.x, max: this.x + this.width - 1});
        const y = rng.natural({min: this.y, max: this.y + this.height - 1});
    
        return new Point(x, y);    
    }

    toString() {
        return `Rectangle((${this.x}, ${this.y}), w: ${this.width}, h: ${this.height})`;
    }
}

export class Message {
    constructor(text, category='default') {
        this.text = text;
        this.category = category;
    }
}

export class MessageLog {
    constructor() {
        this.messages = [];
    }
    add_message(turn, message) {
        this.messages[turn] ??= [];
        this.messages[turn].push(message);
    }
}