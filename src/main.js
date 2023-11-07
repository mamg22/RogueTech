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

function init_game(seed) {
    let game = new Game(seed);
    globalThis.game = game;
}
globalThis.init_game = init_game;

const server_info = JSON.parse(
    document.getElementById('server-info').text
);
globalThis.server_info = server_info

document.addEventListener('DOMContentLoaded', init_game);
window.dispatchEvent(new Event('gameload'))
