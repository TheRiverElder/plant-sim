import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Shop from '../views/Shop.vue';
import Inventory from '../views/Inventory.vue';
import Deployer from '../views/Deployer.vue';
import ReactorMonitor from '../views/ReactorMonitor.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig & { icon: string }> = [
  {
    path: '/shop',
    name: 'Shop',
    component: Shop,
    icon: 'mdi-store',
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: Inventory,
    icon: 'mdi-database',
  },
  {
    path: '/reactor-monitor',
    name: 'Monitor',
    component: ReactorMonitor,
    icon: 'mdi-monitor',
  },
  {
    path: '/deployer',
    name: 'Deployer',
    component: Deployer,
    icon: 'mdi-hand',
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    icon: 'mdi-home',
  },
];

const router = new VueRouter({
  routes,
});

export default router;

export {
  routes
}
