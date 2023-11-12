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

const server_info = JSON.parse(
    document.getElementById('server-info').text
);
globalThis.server_info = server_info

// Firefox-specific polyfill
if (!CSS.px) {
    CSS.px = function(i) {
        return `${i}px`;
    }
}

_hyperscript.browserInit();
globalThis._hyperscript = _hyperscript;
_hyperscript.use(_template);

function check_browser_version() {
    // Required versions due to structuredClone
    const MIN_CHROME_VERSION = 98;
    const MIN_FIREFOX_VERSION = 94;

    const chrome_ver = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    const firefox_ver = navigator.userAgent.match(/Firefox\/([0-9]+)\./);

    let ok_version = false;
    if (chrome_ver) {
        const version_number = +chrome_ver[2];
        ok_version = version_number >= MIN_CHROME_VERSION;
        console.log("Got chrome version: " + version_number)
    }
    else if (firefox_ver) {
        const version_number = +firefox_ver[1];
        ok_version = version_number >= MIN_CHROME_VERSION;
        console.log("Got firefox version: " + version_number)

    }
    else {
        console.warn("Unknown browser, cannot know version")
        ok_version = true;
    }

    if (!ok_version) {
        alert("La versión actual del navegador no es compatible con este juego, por lo que no funcionará correctamente. Por favor, intenta actualizar tu navegador e intentalo de nuevo.");
    }
}

function init_game(seed) {
    let game = new Game(seed);
    globalThis.game = game;
}
globalThis.init_game = init_game;


document.addEventListener('DOMContentLoaded', function(e) {
    check_browser_version();
    init_game();
});
window.dispatchEvent(new Event('gameload'))
