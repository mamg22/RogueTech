export class Item {
    constructor(use_function=null, targeting=false, targeting_message=null, function_args={}) {
        this.use_function = use_function;
        this.targeting = targeting;
        this.targeting_message = targeting_message;
        this.function_args = function_args;
    }
}