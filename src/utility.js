import { astar, Graph } from './libs/astar';
import { Chance } from 'chance';

export function delay(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms);
    })
}

export function wait_for(obj, event) {
    return new Promise(function (resolve, reject) {
        obj.addEventListener(event, resolve, {once: true});
    })
}

export function format_ms(total_millis) {
    const hours = Math.floor(total_millis / (1000 * 60 * 60));
    const minutes = Math.floor((total_millis / (1000 * 60)) % 60);
    const seconds = Math.floor((total_millis / 1000) % 60);
    const millis = Math.floor(total_millis % 1000);

    let out = "";
    if (hours > 0) {
        out += hours.toString() + ':';
    }

    out += minutes.toString().padStart(2, '0') + ":";
    out += seconds.toString().padStart(2, '0') + ".";
    out += millis.toString().padStart(3, '0');

    return out;
}

export function clamp(value, min, max) {
    if (min > max) {
        throw Error("min cannot be greater than max")
    }
    return Math.min(Math.max(value, min), max);
}

export function transpose_array(arr) {
    out = []
    for (let x = 0; x < arr[0].length; x++) {
        out[x] = []
        for (let y = 0; y < arr.length; y++) {
            out[x][y] = arr[y][x]
        }
    }
    return out
}

export function get_move_dir(old_x, new_x) {
    return Math.sign(new_x - old_x);
}

class TypedLocalStorage {
    setItem(keyName, keyValue) {
        return localStorage.setItem(keyName, JSON.stringify(keyValue));
    }

    getItem(keyName) {
        return JSON.parse(localStorage.getItem(keyName));
    }

    key(index) {
        return JSON.parse(localStorage.key(index));
    }

    removeItem(keyName) {
        return localStorage.removeItem(keyName);
    }

    clear() {
        return localStorage.clear();
    }

    get length() {
        return localStorage.length;
    }
}

export let typedLocalStorage = new TypedLocalStorage();
globalThis.typedLocalStorage = typedLocalStorage;

export function find_path(map, from_x, from_y, to_x, to_y, closest=false) {
    let graph = new Graph(transpose_array(map), {
        diagonal: true
    });
    let start = graph.grid[from_x][from_y];
    let end = graph.grid[to_x][to_y];
    let result = astar.search(graph, start, end, {
        heuristic: astar.heuristics.diagonal,
        closest: closest,
    });

    return result;
}

export function distance_between(x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    return Math.sqrt(dx ** 2 + dy ** 2);
}

export const global_rng = new Chance();