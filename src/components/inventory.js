import { Message } from '../common';

export class Inventory {
    constructor(capacity) {
        this.capacity = capacity;
        this.items = [];
        this.targeting_item = null;
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

    get_item_by_id(id) {
        return this.items.find(function(elem) {
            return elem.id === id;
        });
    }

    use(item_entity, args={}) {
        let results = [];

        const item_component = item_entity.item;

        if (item_component.targeting && !('x' in args || 'y' in args)) {
            results.push({
                targeting: item_entity,
                consumed: 0,
            });
            this.targeting_item = item_entity;
        }
        else {
            if (item_component.use_function) {
                let full_args = {...item_component.function_args, ...args};
                const item_use_results = item_component.use_function(this.owner, full_args);
    
                for (const use_result of item_use_results) {
                    if (use_result.item_consumed) {
                        this.remove_item(item_entity);
                    }
                }
                results.push(...item_use_results)
            }
            else {
                results.push({
                    message: new Message(`El ${item_entity.name} no puede usarse`, 'yellow'),
                    consumed: 0,
                })
            }
        }

        return results;
    }

    remove_item(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
          this.items.splice(index, 1);
        }
    }

    remove_item_by_id(id) {
        return this.items.find(function(elem) {
            return elem.id === id;
        });
    }

    drop_item(item) {
        let results = [];

        item.x = this.owner.x;
        item.y = this.owner.y;

        this.remove_item(item);
        results.push({
            item_dropped: item,
            message: new Message(`Has tirado: ${item.name}`, 'yellow'),
            consumed: 1,
        });

        return results;
    }
}