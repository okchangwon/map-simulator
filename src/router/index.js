import Vue from 'vue';
import Router from 'vue-router';
import MapSimulator from '@/components/MapSimulator';
import NotFoundComponent from '@/components/NotFoundComponent';

Vue.use(Router);


export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/map-simulator',
    },
    {
      path: '/map-simulator',
      name: 'map-simulator',
      component: MapSimulator,
    },
  ]
});
