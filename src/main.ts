import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import { toEconomic } from './utils/number'
import router from './router'

Vue.config.productionTip = false

Vue.filter('toEco', toEconomic);

new Vue({
  store,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
