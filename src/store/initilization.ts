import Reactor from '@/game/Reactor';
import Unit from '@/game/Unit';
import { ActionContext } from 'vuex';
import { PlantSimState } from './state';
import initializeGameBuildin from '../game/buildin/index';

function initialize({ state, dispatch }: ActionContext<PlantSimState, PlantSimState>) {
    initializeGameBuildin();
    Object.assign(state, {
        shop: Unit.getAllPrototypes().map(p => p.id),
        warehouse: [],
        reactor: new Reactor(9, 7, 300),
        pid: null,
    });
    
    dispatch('startCycle');
}

export {
    initialize,
}