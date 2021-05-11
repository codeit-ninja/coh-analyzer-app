import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Auth from '../views/Auth.vue';
import Home from '../views/Home.vue';
import CurrentMatch from '../views/CurrentMatch.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    // {
    //     path: '/oauth/code',
    //     name: 'OAuthCode',
    //     component: Auth
    // },
    // {
    //     path: '/match/current',
    //     name: 'CurrentMatch',
    //     component: CurrentMatch
    // }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
