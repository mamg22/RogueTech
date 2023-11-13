import { typedLocalStorage } from '../utility';
import { database_items } from '../database-info';
import { Message } from '../common';

export class Database {
    constructor() {
        this.items = typedLocalStorage.getItem('database-items');
        if (this.items == null) {
            typedLocalStorage.setItem('database-items', []);
            this.items = []
        };

        this.capacity = database_items.length;

        this.read_items = typedLocalStorage.getItem('database-items');
        if (this.read_items == null) {
            typedLocalStorage.setItem('database-read-items', []);
            this.read_items = []
        };
    }

    add_item(item, read=false) {
        let results = [];
        const db_id = item.database_item.id;
        const db_name = item.database_item.name;

        if (! this.items.includes(db_id)) {
            this.items.push(db_id);
            typedLocalStorage.setItem('database-items', this.items);
            results.push({
                consumed: 1,
                db_item_added: item,
                message: new Message(`¡Has agregado ${db_name} a tu base de datos!`, 'magenta')
            });
        }
        else {
            results.push({
                consumed: 0,
                db_item_added: null,
                db_item_exists: item,
                // message: new Message(`${db_name} ya existe en tu base de datos`, 'magenta')
            });
        }

        if (read) {
            if (! this.read_items.includes(db_id)) {
                this.read_items.push(db_id);
                typedLocalStorage.setItem('database-read-items', this.read_items);
                results.push({
                    consumed: 0,
                    db_item_read: true,
                });
            }
        }
        return results;
    }

}