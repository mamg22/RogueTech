import Chance from 'chance';
import { astar, Graph } from '../static/astar';
import _hyperscript from "hyperscript.org";
import _template from 'hyperscript.org/src/template';

// Input listeners and handlers
import './input';
import { sprites, audios } from './resources';
import { delay, wait_for, format_ms, clamp,
         transpose_array, get_move_dir } from './utility';
import { generate_level } from './level';
import './game';

_hyperscript.browserInit();
globalThis._hyperscript = _hyperscript;
_hyperscript.use(_template);

const VERSION = 1

// Firefox-specific polyfill
if (!CSS.px) {
    CSS.px = function(i) {
        return `${i}px`;
    }
}

let state = {
    levels: [],
    level: null,
    player: null,
    scale: 1.0,

    seed: 1,
    start_time: new Date(),
    end_time: null,
    total_time: null,
    score: 0,
    success: false,
    kills: 0,

    get_entity(x, y) {
        // TODO: Generalizar a get_entities, devolviendo una lista de entidades.
        // Organizado por el peso
        // [ Solidos ] > [ No solidos ]
        // [ Jugador, Enemigo ] > [ Otros ]
        // Devolviendo siempre una lista
        for (const entity of this.level.entities) {
            if (entity.x == x && entity.y == y) {
                return entity;
            }
        }
        return null;
    }
}

function init_game() {
    let game = new Game();
    globalThis.game = game;
    game.load_settings();
    game.render_map();
    game.render();
    game.render_ui();
}

const server_info = JSON.parse(
    document.getElementById('server-info').text
);
globalThis.server_info = server_info

document.addEventListener('DOMContentLoaded', init_game);
window.dispatchEvent(new Event('gameload'))

