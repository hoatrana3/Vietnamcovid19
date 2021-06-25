import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/map'
    },
    {
        path: '/map',
        component: () => import(/* webpackChunkName: "map" */ '../views/map')
    },
    {
        path: '/dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard'),
        redirect: '/dashboard/vietnam',
        children: [
            {
                path: 'vietnam',
                name: 'VietnamDashboard',
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/vietnam/VietnamDashboard.vue')
            },
            {
                path: 'vietnam/news',
                name: 'VietnamNews',
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/vietnam/VietnamNews.vue')
            },
            {
                path: 'vietnam/timeline',
                name: 'VietnamTimeline',
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/vietnam/VietnamTimeline.vue')
            },
            {
                path: 'world',
                name: 'WorldDashboard',
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/world/WorldDashboard.vue')
            },
            {
                path: 'world/news',
                name: 'WorldNews',
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/world/WorldNews.vue')
            },
        ]
    },
    {
        path: '/dashboard/data-center',
        name: 'DataCenter',
        component: () => import(/* webpackChunkName: "data-center" */ '../views/data-center'),
        props: (route) => ({ initialCountryIso: route.query.iso })
    },

    {
        path: '*',
        redirect: '/',
    }
];

const router = new VueRouter({
    linkActiveClass: 'active',
    routes,
    mode: 'history'
});

router.beforeEach((to, from, next) => {
    store.dispatch('OPEN_LOADING');
    setTimeout(() => next(), from.path === '/' ? 0 : 100);
});

export default router
