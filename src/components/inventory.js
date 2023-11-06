import { Message } from '../common';

export class Inventory {
    constructor(capacity) {
        this.capacity = capacity;
        this.items = [];
    }

    add_item(item) {
        let results = [];

        if (this.items.length >= this.capacity) {
            results.push({
                item_added: null,
                message: new Message("¡Tu inventario está lleno, no puedes llevar esto!", 'yellow'),
                consumed: 0,
            });
        }
        else {
            this.items.push(item);
            results.push({
                item_added: item,
                message: new Message(`Recoges: ${item.name}`, 'blue'),
                consumed: 1,
            });
        }

        return results;
    }
}