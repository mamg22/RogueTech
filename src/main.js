import Chance from 'chance';
import { astar, Graph } from '../static/astar';
import _hyperscript from "hyperscript.org";
import _template from 'hyperscript.org/src/template';

// Input listeners and handlers
import './input';
import { sprites, audios } from './resources';
import { delay, wait_for, format_ms, clamp,
         transpose_array, get_move_dir,
         world_to_grid, grid_to_world } from './utility';
import { generate_level } from './level';

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

function zoom(direction) {
    let base_delta = 0.05;
    if (state.scale < 0.50) {
        base_delta = 0.0125;
    }
    else if (state.scale < 0.75) {
        base_delta = 0.025;
    }
    const delta = base_delta * Math.sign(direction);
    set_zoom(state.scale + delta, true);
}

function set_zoom(zoom, do_render=false) {
    const game_view = document.querySelector("#game-view");
    zoom_delta = zoom - state.scale;
    state.scale = clamp(zoom, 0.2, 2);
    typedLocalStorage.setItem("game-scale", state.scale);
    game_view.scrollLeft *= 1 + zoom_delta;
    game_view.scrollTop *= 1 + zoom_delta;
    document.body.style.setProperty("--scale", state.scale, "important");
    if (do_render) {
        render();
    }
}

function push_msg(message, category='default') {
    const messages_elt = document.getElementById("messages");

    let message_elt = document.createElement("div");
    message_elt.innerText = message;
    message_elt.classList.add('message', category);
    messages_elt.append(message_elt);
    setTimeout(function(e) {
        let m_anim = message_elt.animate([
            { opacity: 1 },
            { opacity: 0 }
        ],
            { duration: 3000 }
        );
        m_anim.addEventListener('finish', function(e) {
            message_elt.remove()
        })
    }, 7000);
    
    while (messages_elt.children.length > 8) {
        messages_elt.children[0].remove()
    }
}



export class Entity {
    constructor(x, y, name, description, solid, sprite, facing=1, interact=null, components={}) {
        this.id = Entity.id_counter++;

        this.x = x;
        this.y = y;
        this.name = name;
        this.descritpion = description;
        this.solid = solid;
        this.sprite = sprite;
        this.facing = this.facing;
        this.interact = interact;

        for (const component in components) {
            this[component] = components[component];
        }
    }

    set_facing(dir) {
        this.facing = Math.sign(dir);
        if (this.facing == 0 ) {
            this.facing = 1;
        }
    }
    
    move(x, y) {
        this.set_facing(get_move_dir(this.x, x));

        // let graph = new Graph(transpose_array(state.level.get_collision_map()), {
        //     diagonal: true
        // });
        // let start = graph.grid[this.x][this.y];
        // let end = graph.grid[x][y];
        // let result = astar.search(graph, start, end, {
        //     heuristic: astar.heuristics.diagonal,
        // });
        
        // if (entity) {
        //     if (result.length == 0 || result.length == 1 && !entity.solid) {
        //         entity.interact()
        //         return;
        //     }
        // }
        if (this.x == x && this.y == y) {
            return false;
        }
        if (state.level.get_collision_at(x, y)) {
            return false;
        }

        this.set_facing(get_move_dir(this.x, x));
        this.x = x;
        this.y = y;
        render();

        return true;
    }
    move_relative(x_delta, y_delta) {
        this.move(this.x + x_delta, this.y + y_delta)
    }

    static id_counter = 0;
}


const State = Object.freeze({
    player_turn: 1,
    inspect: 2,
})

let state = {
    levels: [],
    level: null,
    player: null,
    scale: 1.0,
    state: State.player_turn,

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

function render() {
    const entities_elt = document.querySelector("#entities");
    const entity_elements = entities_elt.children;
    const entity_ids = state.level.entities.map(function(entity){
        return entity.id;
    });

    for (const entity_element of Array.from(entity_elements)) {
        const entity_id = +entity_element.getAttribute("entity-id")
        if (! entity_ids.includes(entity_id)) {
            entity_element.remove()
        }
    }

    if (state.level.entities.indexOf(state.player) == -1) {
        state.level.entities.push(state.player);
    }
    
    for (const entity of state.level.entities) {
        const elem_id = "entity-" + entity.id;
        let elem = document.getElementById(elem_id);
        if (!elem) {
            elem = document.createElement("div");
            elem.id = elem_id
            elem.setAttribute('entity-id', entity.id)
            elem_img = document.createElement("img");
            elem_img.src = entity.sprite;
            elem.append(elem_img);
            entities_elt.append(elem);
        }
        elem.style.left = CSS.px(grid_to_world(entity.x));
        elem.style.top = CSS.px(grid_to_world(entity.y));
        const facing = entity.facing;
        elem.style.setProperty('--flip', entity.facing)
    }
}

function set_audio(category, mute) {
    if (! (category in audios)) {
        throw Error("Invalid audio category")
    }

    typedLocalStorage.setItem(`mute-${category}`, mute)
    
    const category_audios = audios[category];
    for (const name in category_audios) {
        const target = category_audios[name];
        if (mute) {
            target.volume = 0;
            if (category == 'bgm') {
                target.pause();
            }
        }
        else {
            target.volume = target._volume
            if (category == 'bgm') {
                target.play();
            }
        }
    }
}

function load_settings() {
    for (const category in audios) {
        const stored_mute = typedLocalStorage.getItem(`mute-${category}`)
        set_audio(category, stored_mute || false)
    }
    set_zoom(typedLocalStorage.getItem('game-scale') || 1.0);
}

function build_scoredata() {
    let scoredata = {};

    scoredata.seed = state.seed;
    scoredata.version = VERSION;
    scoredata.time_ms = state.total_time;
    scoredata.score = state.score;
    scoredata.date = state.end_time.toISOString();
    scoredata.success = state.success;
    scoredata.details = {};

    scoredata.details.kills = state.kills;

    return scoredata;
}

async function upload_score() {
    const scoredata = build_scoredata()
    const data_json = JSON.stringify(scoredata)

    const upload_result = await fetch(
        "/api/v1/score", 
        {
            method: "POST",
            body: data_json,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    if (!upload_result.ok) {
        console.log("Failed upload:", upload_result);
        return null;
    }

    const json = await upload_result.json();
    const result = json.result;

    // Return the newly generated id
    return result;
}

function render_map() {
    const new_table = document.createElement("table");
    new_table.id = "map-table";

    for (let y = 0; y < state.level.map.grid.height; y++) {
        let current_row = document.createElement("tr");

        for (let x = 0; x < state.level.map.grid.width; x++) {
            let current_cell = document.createElement("td");
            let cell_contents = document.createElement("div");

            cell_contents.setAttribute("x", x);
            cell_contents.setAttribute("y", y);
            cell_contents.classList.add("map-cell");

            if (state.level.map.grid.get(x, y) == 0) {
                cell_contents.classList.add("solid");
            }

            current_cell.appendChild(cell_contents);
            current_row.appendChild(current_cell);
        }

        new_table.appendChild(current_row)
    }

    const map_table = document.querySelector("#map-table");
    map_table.replaceWith(new_table);
}



function switch_level(direction) {
    direction = Math.sign(direction);
    const current_level_number = state.level.number;

    const new_level = state.levels.find(function (item) {
        return item.number == current_level_number + direction;
    });

    let level_info = document.getElementsByClassName('floor-indicator-value');

    if (new_level) {
        state.level.set_last_pos(state.player.x, state.player.y);
        state.level = new_level;
        const new_pos = state.level.last_player_pos;
        if (new_pos) {
            state.player.x = new_pos.x;
            state.player.y = new_pos.y;
        }
        render_map();
        render();
        for (const indicator of level_info) {
            indicator.innerText = new_level.number; 
        }
        return true;
    }
    else {
        return false;
    }
}

function show_gameover() {
    const gameover_dialog = document.getElementById("gameover-dialog");
    const score_field = document.getElementById("gameover-score");
    const time_field = document.getElementById("gameover-time");

    score_field.innerText = state.score;
    time_field.innerText = format_ms(state.total_time);

    gameover_dialog.showModal();
}

function finish_run() {
    const end_time = new Date();
    const total_playtime = end_time - state.start_time;

    state.end_time = end_time;
    state.total_time = total_playtime;
}


function init_game() {
    const proc_gen = new Chance()

    state.player = new Entity(5, 3, "Jugador", "El jugador", true, sprites.player.standing, 1)
    load_settings();
    for (let i = 0; i < 5; i++) {
        const level = generate_level(proc_gen, i+1);
        state.levels.push(level)
    }
    state.level = state.levels[0];
    render_map();
    render();
}

async function inspect_entity(x, y) {
    const dialog = document.getElementById('entityinfo-dialog');

    for (const entity of state.level.get_entities(x, y)) {
        dialog.showModal();
        let wait_promise = new Promise(function (resolve, reject){
            dialog.addEventListener('close', function(){
                resolve();
            })
        });
        await wait_promise;
    }
    state.state = State.player_turn;
}
globalThis.inspect_entity = inspect_entity;


function handle_input(x, y) {
    switch (state.state) {
        case State.player_turn:
            console.log(state.player.move(x, y));
            // TODO: No usar A* para movimiento basico de r=1, solo para distancias x,y > 1 e IA
            // usar checkeo basico de colision al tocar
            break;
        case State.inspect:
            inspect_entity(x, y);
            break;
        default:
            break;
    }
}
globalThis.handle_input = handle_input;

const server_info = JSON.parse(
    document.getElementById('server-info').text
);
globalThis.server_info = server_info

document.addEventListener('DOMContentLoaded', init_game);
window.dispatchEvent(new Event('gameload'))

globalThis.state = state;
globalThis.zoom = zoom;