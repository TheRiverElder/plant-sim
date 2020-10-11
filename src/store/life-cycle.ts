// import Reactor from '@/game/Reactor';
// import Unit from '@/game/Unit';
import { ActionContext } from 'vuex';
import { PlantSimState } from './state';

function update({ state }: ActionContext<PlantSimState, PlantSimState>) {
    // state.reactor?.tick();
    // state.bus.$emit('tick', state.reactor);
}

function startCycle({ state, dispatch }: ActionContext<PlantSimState, PlantSimState>) {
    if (state.pid === null) {
        state.pid = setInterval(dispatch.bind(null), 1000, 'update');
    }
}

function endCycle({ state }: ActionContext<PlantSimState, PlantSimState>) {
    if (state.pid !== null) {
        clearInterval(state.pid);
        state.pid = null;
    }
}

export {
    update,
    startCycle,
    endCycle,
}