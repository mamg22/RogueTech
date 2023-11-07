import Chance from 'chance';

import { wait_for, delay, clamp, find_path, format_ms } from './utility';
import { Point, Message, MessageLog } from './common';
import { Entity } from './entity';
import { generate_level } from './level';
import { sprites, audios } from './resources';
import { astar, Graph } from './libs/astar';
import { PlayerHandler } from './components/handler';
import { Fighter } from './components/fighter';
import { Inventory } from './components/inventory';

export const GRID_SIZE = 64;

export class Game {
    static State = Object.freeze({
        cancel: -1,
        processing: 0,
        player_turn: 1,
        inspect: 2,
        player_dead: 3,
        targeting: 4,
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
                fighter: new Fighter(999, 4, 2),
                inventory: new Inventory(5),
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

        this.load_settings();
        this.render_map();
        this.render_ui();
        this.render();
        this.update_inventory();
    }

    world_to_grid(x, with_scale=true) {
        let value_scale = with_scale ? this.scale : 1;
        return Math.floor(x / (GRID_SIZE * value_scale));
    }
    
    grid_to_world(x, with_scale=true) {
        let value_scale = with_scale ? this.scale : 1;
        return Math.floor(x * (GRID_SIZE * value_scale));
    }    

    async render(do_animation=true) {
        const entities_elt = document.querySelector("#entities");
        const animation_speed = do_animation ? 200 : 0;
        
        let animations = [];
        for (const entity of this.level.entities.concat(this.render_metadata.dead)) {
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
                {left: CSS.px(this.grid_to_world(entity.x)),
                 top:  CSS.px(this.grid_to_world(entity.y))}
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

            elem.style.left = CSS.px(this.grid_to_world(entity.x));
            elem.style.top = CSS.px(this.grid_to_world(entity.y));
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
    

        let removal_animations = []
        for (const entity_element of Array.from(entity_elements)) {
            const entity_id = +entity_element.getAttribute("entity-id")
            if (! entity_ids.includes(entity_id)) {
                entity_element.removeAttribute('entity-id');
                const dead_entity = this.render_metadata.dead.find(function(elem) {
                    return elem.id == entity_id
                });                    
                if (dead_entity) {
                    const dead_img = entity_element.querySelector("img");
                    dead_img.src = sprites.etc.boom;
                    setTimeout(function() {
                        entity_element.remove()
                    }, 1400);
                }
                else {
                    entity_element.remove()
                }
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

        const cancel_button = document.getElementById('cancel-button');
        if (this.state == Game.State.targeting) {
            cancel_button.style.removeProperty("display")
        }
        else {
            cancel_button.style.setProperty("display", "none");
        }

        this.update_inventory();
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
            if ('inventory' in data) {
                this.show_inventory();
            }
            if ('inventory_item' in data) {
                this.show_entityinfo(data.inventory_item);
                return;
            }
            if ('use_item' in data) {
                const id = +data.use_item;
                const target_entity = this.player.inventory.get_item_by_id(id);
                this.player.handler.push_action({use_item: target_entity})
            }
            if ('drop_item' in data) {
                const id = +data.drop_item;
                const target_entity = this.player.inventory.get_item_by_id(id);
                this.player.handler.push_action({drop_item: target_entity})
            }
            break;
        case Game.State.targeting:
            this.set_state(Game.State.player_turn)
            this.push_msg("Cancelado")
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
                    this.player.handler.push_action({attack: target});
                }
                else if (target.type == Entity.Type.stair) {
                    this.player.handler.push_action({switch_level: target.stair.target_floor});
                }
                else if (target.type == Entity.Type.item) {
                    this.player.handler.push_action({pick_up: target});
                }
            }
            break;
        case Game.State.inspect:
            this.process_inspect(x, y);
            return;
        case Game.State.targeting:
            this.player.handler.push_action({use_target: new Point(x, y)});
            break
        default:
            break;
        }
        this.tick_turns();
    }

    async tick_turns(actions) {
        this.set_state(Game.State.processing);
        if (!this.player?.handler?.has_action()) {
            this.render_ui();
            this.render();
        }
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
                        if (target === this.player) {
                            results.push({player_attacked: true});
                        }
                    }
                    else if (action.pick_up) {
                        const target = action.pick_up;
                        let result = entity.inventory.add_item(target);
                        results.push(...result);
                    }
                    else if (action.use_item) {
                        const target = action.use_item;
                        let result = entity.inventory.use(target, {level: this.level, player: this.player});
                        results.push(...result);
                    }
                    else if (action.drop_item) {
                        const target = action.drop_item;
                        let result = entity.inventory.drop_item(target);
                        results.push(...result);
                    }
                    else if (action.use_target) {
                        const target = entity.inventory.targeting_item;
                        const target_pos = action.use_target;
                        let result = entity.inventory.use(target, {
                            level: this.level, player: this.player,
                            x: target_pos.x, y: target_pos.y
                        });
                        results.push(...result);
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
                            this.finish_run();
                            this.set_state(Game.State.player_dead);
                        }
                        this.render_metadata.dead.push(dead);
                        this.level.remove_entity_by_id(dead.id);
                        dead.handler = null;
                        this.push_msg(`${dead.name} ha sido derrotado`);
                        this.message_log.add_message(this.turn,
                            new Message(`${dead.name} ha sido derrotado`)
                        );
                    }
                    if ('render_map' in result && result.render_map) {
                        this.render_map();
                    }
                    if ('item_added' in result && result.item_added) {
                        this.level.remove_entity_by_id(result.item_added.id);
                        this.update_inventory();
                    }
                    if (result.targeting) {
                        this.set_state(Game.State.targeting);
                        const message = result.targeting.item.targeting_message;
                        this.push_msg(message || "Elige donde usar el objeto");
                        this.show_inventory(false);
                    }
                    if ('player_attacked' in result && result.player_attacked) {
                        this.set_state(Game.State.cancel);
                    }
                    if ('item_dropped' in result && result.item_dropped) {
                        this.level.add_entity(result.item_dropped);
                        this.show_inventory(false);
                    }
                    if ('item_consumed' in result) {
                        this.show_inventory(false);
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
            this.render_ui();
            await this.render();
            this.turn++;
            if (! ('handler' in this.player)) {
                this.show_gameover();
            }
        }
        if (this.state === Game.State.processing || this.state === Game.State.cancel) {
            this.set_state(Game.State.player_turn);
        }
    }

    async process_inspect(x, y) {
        const dialog = document.getElementById('entityinfo-dialog');
    
        const entities = this.level.get_entities_at(x, y);
        if (entities.length > 0) {
            for (const entity of entities) {
                this.show_entityinfo(entity);
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
        
        while (messages_elt.children.length > 5) {
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

    update_inventory() {
        const inventory_contents_elt = document.getElementById('inventory-contents');

        inventory_contents_elt.replaceChildren();
        if (this.player.inventory.items.length > 0) {
            for (const item of this.player.inventory.items) {
                const elem = document.createElement('div');
                elem.classList.add('inventory-card');
                elem.innerText = item.name;
                const this_game = this;
                elem.addEventListener('click', function(e) {
                    this_game.handle_ui_input({inventory_item: item});
                });
                inventory_contents_elt.append(elem);
            }
        }
        else {
            const elem = document.createElement('div');
            elem.classList.add('centered');
            elem.innerText = "Tu inventario está vacío";
            inventory_contents_elt.append(elem);
        }
    }

    show_inventory(show=true) {
        const inventory_dialog = document.getElementById('inventory-dialog');
        if (show) {
            inventory_dialog.showModal();
        }
        else {
            inventory_dialog.close();
        }
    }

    show_entityinfo(entity) {
        const entityinfo_dialog = document.getElementById('entityinfo-dialog');
        const entityinfo_image = document.getElementById('entityinfo-dialog-image');
        const entityinfo_name = document.getElementById('entityinfo-dialog-name');
        const entityinfo_description = document.getElementById('entityinfo-dialog-description');
        const entityinfo_hp_bar = document.getElementById('entityinfo-dialog-hp-bar');
        const entityinfo_buttons = document.getElementById('entityinfo-dialog-buttons');

        entityinfo_image.src = entity.sprite;
        entityinfo_name.innerText = entity.name;
        entityinfo_description.innerText = entity.description;

        if (entity.fighter) {
            const fig = entity.fighter
            const health_proportion = fig.hp / fig.max_hp;
            entityinfo_dialog.style.setProperty('--hp', health_proportion);
            entityinfo_hp_bar.style.setProperty('display', 'block');
        }
        else {
            entityinfo_dialog.style.removeProperty('--hp');
            entityinfo_hp_bar.style.setProperty('display', 'none');
        }

        if (this.player.inventory.get_item_by_id(entity.id)) {
            entityinfo_buttons.style.setProperty('display', 'block');
            for (const button of entityinfo_buttons.children) {
                button.setAttribute('target-entity', entity.id)
            }
        }
        else {
            entityinfo_buttons.style.setProperty('display', 'none')
        }

        entityinfo_dialog.showModal();
    }
}
globalThis.Game = Game;