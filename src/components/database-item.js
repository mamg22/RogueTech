import { database_items } from '../database-info';

export class DatabaseItem {
    constructor(db_id) {
        const db_item = database_items.find(function(elem) {
            return elem.id === db_id;
        });
        this.id = db_item.id;
        this.name = db_item.name;
        this.image = db_item.image;
        this.description = db_item.description;
    }
}