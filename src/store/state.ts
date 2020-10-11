import { UnitData } from '@/game/interfaces';
import Vue from 'vue';

interface PlantSimState {
    inventory: UnitData[];
    pid: number | null;
    bus: Vue;
}

function createState(): PlantSimState {
    return {
        inventory: [],
        pid: null,
        bus: new Vue(),
    }
}

export {
    PlantSimState,
    createState,
}