import { ActionContext } from 'vuex';
import { PlantSimState } from './state';
import initializeGameBuildin from '../game/buildin/index';
import game from '@/game/game';

function initialize({ state, dispatch }: ActionContext<PlantSimState, PlantSimState>) {
    initializeGameBuildin();
    Object.assign(state, {
        pid: null,
    });

    game.online();
    
    dispatch('startCycle');
}

export {
    initialize,
}