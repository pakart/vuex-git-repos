// прикрутил роутинг, чтобы через него реализовывать просмотр полной инфы о репозитории

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Repos list',
    component: () => import('@/views/List'),
  },
  {
    path: '/repo/:name',
    name: 'repo',
    component: () => import('@/views/InfoRepo'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
