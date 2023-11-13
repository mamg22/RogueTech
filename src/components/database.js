import { typedLocalStorage } from '../utility';
import { database_items } from '../database-info';

export class Database {
    constructor() {
        this.items = typedLocalStorage.getItem('database-items');
        if (this.items == null) {
            typedLocalStorage.setItem('database-items', []);
            this.items = []
        };
        this.capacity = database_items.length;
    }

    add_item(item) {
        if (! this.items.includes(item)) {
            this.items.push(item);
            typedLocalStorage.setItem('database-items', this.items);
            return true;
        }
        return false;
    }
}