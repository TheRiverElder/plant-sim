import Vue from 'vue'
import Vuex from 'vuex'
import { createState, PlantSimState } from './state'
import { initialize } from './initilization'
import { update, startCycle, endCycle } from './life-cycle'

Vue.use(Vuex)

export default new Vuex.Store<PlantSimState>({
  state: createState(),
  mutations: {
  },
  actions: {
    initialize,
    update, 
    startCycle, 
    endCycle,
  },
  modules: {
  }
})
