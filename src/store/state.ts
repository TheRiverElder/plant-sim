import Vue from 'vue';

interface PlantSimState {
    pid: number | null;
    bus: Vue;
}

function createState(): PlantSimState {
    return {
        pid: null,
        bus: new Vue(),
    }
}

export {
    PlantSimState,
    createState,
}