import { audios } from './resources';

const game_view = document.querySelector("#game-view");

game_view.addEventListener('pointermove', function(e) {
    if (e.buttons == 1) {
        game_view.scrollLeft -= e.movementX
        game_view.scrollTop -= e.movementY
    }
});

const map_elem = document.querySelector("#map");
let pointer_down = null;

map_elem.addEventListener('pointerdown', function(e) {
    pointer_down = e;
})

map_elem.addEventListener('pointerup', function(e) {
    if (is_click(pointer_down, e)) {
        globalThis.game.handle_input(
            globalThis.game.world_to_grid(e.offsetX, false),
            globalThis.game.world_to_grid(e.offsetY, false)
        );
    }
    pointer_down = null
})

window.addEventListener('click', function(e) {
    if (! typedLocalStorage.getItem('mute-bgm')) {
        audios.bgm.main.play()
    }
});

function is_click(start, end) {
    const max_dist = 5;
    const x_delta = Math.abs(start.pageX - end.pageX);
    const y_delta = Math.abs(start.pageY - end.pageY);
    const time_delta = end.timeStamp - start.timeStamp;
    const is_primary_button = start.buttons == 1;
    return x_delta < max_dist && y_delta < max_dist && time_delta < 2000 && is_primary_button;
}


const evCache = [];
let prevDiff = -1;


function init_pinch_handler() {
    const el = document.getElementById("game-view");
    el.addEventListener('pointerdown', pinch_pointerdown_handler);
    el.addEventListener('pointermove', pinch_pointermove_handler);
    el.addEventListener('pointerup', pinch_pointerup_handler);
    el.addEventListener('pointercancel', pinch_pointerup_handler);
    el.addEventListener('pointerout', pinch_pointerup_handler);
    el.addEventListener('pointerleave', pinch_pointerup_handler);
}

init_pinch_handler()

function pinch_pointerdown_handler(ev) {
    evCache.push(ev);
}
function pinch_pointermove_handler(ev) {
    const index = evCache.findIndex(
      (cachedEv) => cachedEv.pointerId === ev.pointerId,
    );
    evCache[index] = ev;
  
    if (evCache.length === 2) {
      const curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX)
                    + Math.abs(evCache[0].clientY - evCache[1].clientY);
  
      if (prevDiff > 0) {
        const delta = Math.abs(curDiff - prevDiff);
        const dir = Math.sign(curDiff - prevDiff)
        if (delta > 7) {
            game.zoom(delta * dir)
        }
      }
  
      prevDiff = curDiff;
    }
}

function pinch_pointerup_handler(ev) {
    pinch_remove_event(ev);
  
    if (evCache.length < 2) {
      prevDiff = -1;
    }
}
  
function pinch_remove_event(ev) {
    const index = evCache.findIndex(
      (cachedEv) => cachedEv.pointerId === ev.pointerId,
    );
    evCache.splice(index, 1);
}

game_view.addEventListener('wheel', function(e) {
    e.preventDefault()
    if (Math.abs(e.deltaY) > 3){
        game.zoom(Math.sign(-e.deltaY))
    }
})

window.addEventListener('contextmenu', function(e) {
    e.preventDefault();
})