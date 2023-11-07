export class Item {
    constructor(use_function=null, targeting=false, function_args={}) {
        this.use_function = use_function;
        this.targeting = targeting;
        this.function_args = function_args;
    }
}