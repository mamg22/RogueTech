import Chance from 'chance';

import { wait_for, delay, clamp, world_to_grid, grid_to_world, find_path, format_ms } from './utility';
import { Point, Message, MessageLog } from './common';
import { Entity } from './entity';
import { generate_level } from './level';
import { sprites, audios } from './resources';
import { astar, Graph } from './libs/astar';
import { PlayerHandler } from './components/handler';
import { Fighter } from './components/fighter';

export class Game {
    static State = Object.freeze({
        cancel: -1,
        processing: 0,
        player_turn: 1,
        inspect: 2,
        player_dead: 3,
    });

    constructor(seed) {
        let tmp_chance = new Chance();
        this.seed = seed || tmp_chance.natural();
        this.procedural_rng = new Chance(this.seed);

        this.player = new Entity(
            3, 3,
            "Jugador", "El jugador",
            true, sprites.player.standing, Entity.Type.player, 1,
            {
                handler: new PlayerHandler(),
                fighter: new Fighter(999, 4, 2)
            });

        this.levels = [];
        for (let i = 0; i < 5; i++) {
            let level = generate_level(this.procedural_rng, i+1);
            this.levels.push(level);
            level.entities.push(this.player);
        }
        this.level = this.levels[0];

        this.state = Game.State.player_turn;
        this.scale = 1.0;
        this.start_time = null;
        this.turn = 1;
        this.message_log = new MessageLog();
        this.render_metadata = {
            attacking: [],
            dead: []
        };
    }

    async render(do_animation=true) {
        const entities_elt = document.querySelector("#entities");
        const animation_speed = do_animation ? 200 : 0;
        
        let animations = [];
        for (const entity of this.level.entities) {
            const elem_id = "entity-" + entity.id;
            let elem = document.getElementById(elem_id);

            // If not exists create it
            if (!elem) {
                elem = document.createElement("div");
                elem.id = elem_id
                elem.setAttribute('entity-id', entity.id)
                let elem_img = document.createElement("img");
                elem_img.src = entity.sprite;
                elem.append(elem_img);
                elem.style.zIndex = 50 - entity.type;
                entities_elt.append(elem);
            }
            const img = elem.querySelector('img');

            if (this.render_metadata.attacking.includes(entity)) {
                img.src = img.src.replace('standing', 'attack');
            }

            let anim = elem.animate([
                {left: elem.style.left,
                top:  elem.style.top},
                {left: CSS.px(grid_to_world(entity.x)),
                 top:  CSS.px(grid_to_world(entity.y))}
                ],
                {
                    duration: animation_speed
                }
            );

            animations.push(wait_for(anim, 'finish'));
            if (this.render_metadata.attacking.includes(entity)) {
                anim.addEventListener('finish', function(e){
                    img.src = img.src.replace('attack', 'standing');
                })
            }

            elem.style.left = CSS.px(grid_to_world(entity.x));
            elem.style.top = CSS.px(grid_to_world(entity.y));
            const facing = entity.facing;
            elem.style.setProperty('--flip', entity.facing)
        }
        await Promise.all(animations);
        const player_elem_id = "entity-" + this.player.id;
        const player_elem = document.getElementById(player_elem_id);
        player_elem?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
        });

        const entity_elements = entities_elt.children;
        const entity_ids = this.level.entities.map(function(entity){
            return entity.id;
        });
    

        for (const entity_element of Array.from(entity_elements)) {
            const entity_id = +entity_element.getAttribute("entity-id")
            if (! entity_ids.includes(entity_id)) {
                const dead_entity = this.render_metadata.dead.find(function(elem) {
                    return elem.id == entity_id
                });
                if (dead_entity) {
                    const dead_img = entity_element.querySelector("img");
                    dead_img.src = sprites.etc.boom;
                    await delay(1400);
                }
                entity_element.remove()
            }
        }

        this.render_metadata.attacking = [];
        this.render_metadata.dead = [];
    }
    

    render_map() {
        const new_table = document.createElement("table");
        new_table.id = "map-table";
    
        for (let y = 0; y < this.level.map.grid.height; y++) {
            let current_row = document.createElement("tr");
    
            for (let x = 0; x < this.level.map.grid.width; x++) {
                let current_cell = document.createElement("td");
                let cell_contents = document.createElement("div");
    
                cell_contents.setAttribute("x", x);
                cell_contents.setAttribute("y", y);
                cell_contents.classList.add("map-cell");
    
                if (this.level.map.grid.get(x, y) == 0) {
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

    render_ui() {
        const health_indicator = document.querySelector('.health-indicator');
        const health_indicator_value = document.getElementById('health-indicator-value');
        const player_fighter = this.player.fighter;
        const health_proportion = Math.max(player_fighter.hp / player_fighter.max_hp, 0);

        health_indicator_value.innerText = `${player_fighter.hp}/${player_fighter.max_hp}`
        health_indicator.style.setProperty('--hp', health_proportion);

        let level_info = document.getElementsByClassName('floor-indicator-value');
        for (const indicator of level_info) {
            indicator.innerText = this.level.number; 
        }
    }

    switch_level(target_level) {
        const current_level_number = this.level.number;
    
        const new_level = this.levels.find(function (item) {
            return item.number == target_level;
        });
    
        if (new_level) {
            const new_level_entities = new_level.get_entities();
            let target_pos = new Point(2, 2);
            for (const entity of new_level_entities) {
                if (entity.type == Entity.Type.stair && entity.stair.target_floor == this.level.number) {
                    target_pos = new Point(entity.x, entity.y);
                }
            }
            this.level = new_level;
            this.player.move(target_pos.x, target_pos.y);
            return [{render_map: true, consumed: 0,
                message: new Message(`Entras al piso ${this.level.number} del edificio`)}];
        }
        else {
            return [{render_map: false, consumed: 0}];
        }
    }

    set_state(state) {
        // player_dead is a terminal state, cannot be left
        if (this.state != Game.State.player_dead) {
            this.state = state;
        }
    }

    handle_ui_input(data) {
        switch (this.state) {
        case Game.State.player_dead:
            return;
        case Game.State.processing:
            this.set_state(Game.State.cancel);
            this.player.handler.clear_actions();
            return;
        case Game.State.player_turn:
            if ('wait' in data) {
                this.player.handler.push_action({wait: true});
            }
            if ('inspect' in data) {
                this.push_msg("Elige algo para inspeccionar");
                this.set_state(Game.State.inspect);
                return;
            }
            if ('log' in data) {
                this.show_log();
            }
            break;
        }
        this.tick_turns();
    }

    handle_input(x, y) {
        switch (this.state) {
        case Game.State.processing:
            this.set_state(Game.State.cancel);
            this.player.handler.clear_actions();
            // Cannot handle input while busy
            return;
        case Game.State.player_dead:
            this.show_gameover();
            // Player is dead, nothing to do
            return;
        case Game.State.player_turn:
            if (! (this.player.x == x && this.player.y == y)) {
                if (! this.player.can_reach(x, y)) {
                    // let result = find_path(this.level.get_collision_map().content,
                    //     this.player.x, this.player.y, x, y);
                    // for (let move of result) {
                    this.player.handler.push_action({move_astar: new Point(x, y)})
                    // }
                    break;
                }
                if (!this.level.get_collision_at(x, y)) {
                    this.player.handler.push_action({move: new Point(x, y)})
                    break;
                }
            }
            let entities = this.level.get_entities_at(x, y);
            const is_targeting_self = entities[0]?.type == Entity.Type.player;
            if (is_targeting_self) {
                entities.shift();
            }
            if (entities.length > 0) {
                const target = entities[0];
                if (target.type == Entity.Type.npc) {
                    this.player.handler.push_action({attack: target})
                }
                else if (target.type == Entity.Type.stair) {
                    this.player.handler.push_action({switch_level: target.stair.target_floor})
                }
                else {
                    this.push_msg("Recoges: " + entities[0].name)
                }
            }
            break;
        case Game.State.inspect:
            this.process_inspect(x, y);
            return;
        default:
            break;
        }
        this.tick_turns();
    }

    async tick_turns(actions) {
        this.set_state(Game.State.processing);
        outer: 
        while (this.player?.handler?.has_action()) {
            if (this.state === Game.State.cancel) {
                this.player.handler.clear_actions()
                break;
            }
            let no_turn = false;
            for (const entity of this.level.get_entities()) {
                let results = [];
                if (entity.handler) {
                    const action = entity.handler.next_action(this.player, this.level);
                    if (action.move) {
                        const point = action.move;
                        entity.move(point.x, point.y);
                    }
                    else if (action.move_rel) {
                        const point = action.move_rel;
                        entity.move_relative(point.x, point.y);
                    }
                    else if (action.move_astar) {
                        const target = action.move_astar;
                        let result = entity.move_astar(target.x, target.y, this.level, entity.type != Entity.Type.player)
                        results.push(...result);
                    }
                    else if (action.attack) {
                        const target = action.attack;
                        let result = entity.fighter.attack(target);
                        results.push(...result);
                        this.render_metadata.attacking.push(entity);
                    }
                    else if (action.switch_level) {
                        const target_floor = action.switch_level;
                        let result = this.switch_level(target_floor);
                        results.push(...result);
                        console.log(result);
                    }
                }
                else if (entity?.fighter?.hp <= 0) {
                }
                for (const result of results) {
                    if ('message' in result) {
                        const msg = result.message;
                        this.push_msg(msg.text, msg.category);
                        this.message_log.add_message(this.turn, msg);
                    }
                    if ('dead' in result) {
                        const dead = result.dead;
                        if (dead === this.player) {
                            this.set_state(Game.State.player_dead);
                        }
                        this.render_metadata.dead.push(dead);
                        this.level.remove_entity_by_id(dead.id);
                        dead.handler = null;
                        this.push_msg(`${dead.name} ha sido derrotado`);
                    }
                    if ('render_map' in result && result.render_map) {
                        this.render_map();
                    }
                    if (entity.type == Entity.Type.player && result?.consumed === 0) {
                        no_turn = true;
                    }
                    if (result?.astar_moved === false) {
                        entity.handler.clear_actions();
                    };
                }
                if (no_turn) {
                    break;
                }
            }
            await this.render();
            this.render_ui();
            this.turn++;
            if (! ('handler' in this.player)) {
                this.show_gameover();
            }
        }
        this.set_state(Game.State.player_turn);
    }

    async process_inspect(x, y) {
        const dialog = document.getElementById('entityinfo-dialog');
    
        const entities = this.level.get_entities_at(x, y);
        if (entities.length > 0) {
            for (const entity of entities) {
                dialog.showModal();
                await wait_for(dialog, 'close');
            }
        }
        else {
            this.push_msg("No hay nada para inspeccionar ahí")
        }
        this.set_state(Game.State.player_turn);
    }

    zoom(direction) {
        let base_delta = 0.05;
        if (this.scale < 0.50) {
            base_delta = 0.0125;
        }
        else if (this.scale < 0.75) {
            base_delta = 0.025;
        }
        const delta = base_delta * Math.sign(direction);
        this.set_zoom(this.scale + delta, true);
    }

    set_zoom(zoom, do_render=false) {
        const game_view = document.querySelector("#game-view");
        const zoom_delta = zoom - this.scale;
        this.scale = clamp(zoom, 0.2, 2);
        typedLocalStorage.setItem("game-scale", this.scale);
        game_view.scrollLeft *= 1 + zoom_delta;
        game_view.scrollTop *= 1 + zoom_delta;
        document.body.style.setProperty("--scale", this.scale, "important");
        if (do_render) {
            this.render(false);
        }
    }

    set_audio(category, mute) {
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

    push_msg(message, category='default') {
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

    load_settings() {
        for (const category in audios) {
            const stored_mute = typedLocalStorage.getItem(`mute-${category}`)
            this.set_audio(category, stored_mute || false)
        }
        this.set_zoom(typedLocalStorage.getItem('game-scale') || 1.0);
    }

    build_scoredata() {
        let scoredata = {};
    
        scoredata.seed = this.seed;
        scoredata.version = VERSION;
        scoredata.time_ms = this.total_time;
        scoredata.score = this.score;
        scoredata.date = this.end_time.toISOString();
        scoredata.success = this.success;
        scoredata.details = {};
    
        scoredata.details.kills = this.kills;
    
        return scoredata;
    }

    async upload_score() {
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

    show_gameover() {
        const gameover_dialog = document.getElementById("gameover-dialog");
        const score_field = document.getElementById("gameover-score");
        const time_field = document.getElementById("gameover-time");
    
        score_field.innerText = this.score;
        time_field.innerText = format_ms(this.total_time);
    
        gameover_dialog.showModal();
    }

    finish_run() {
        const end_time = new Date();
        const total_playtime = end_time - this.start_time;
    
        this.end_time = end_time;
        this.total_time = total_playtime;
    }

    show_log() {
        const elem = document.querySelector('#log-dialog');
        const elem_body = elem.querySelector('.dialog-body')
        elem_body.replaceChildren();
        for (const turn in this.message_log.messages) {
            const turn_data = this.message_log.messages[turn];
            const header = document.createElement("h4");
            header.classList.add('centered')
            header.innerText = `--- Turno ${turn} ---`;
            elem_body.append(header);
            for (const message of turn_data) {
                const message_line = document.createElement('div');
                message_line.classList.add('message', message.category);
                message_line.innerText = message.text;
                elem_body.append(message_line);
            }
        }
        const last = elem_body.children[elem_body.children.length - 1];
        elem.showModal();
        last?.scrollIntoView(true);
    }
}
globalThis.Game = Game;