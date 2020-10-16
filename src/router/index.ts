import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Shop from '../views/Shop.vue';
import Inventory from '../views/Inventory.vue';
import Deployer from '../views/Deployer.vue';
import ReactorMonitor from '../views/ReactorMonitor.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/shop',
    name: 'Shop',
    component: Shop,
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: Inventory,
  },
  {
    path: '/deployer',
    name: 'Deployer',
    component: Deployer,
  },
  {
    path: '/reactor-monitor',
    name: 'ReactorMonitor',
    component: ReactorMonitor,
  },
];

const router = new VueRouter({
  routes,
});

export default router;

export {
  routes
}
