import BaseRoute from "./base.route";

export default class DashboardRoute extends BaseRoute {
    protected _route = {
        path: '/',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "Dashboard" */ '@/views/Dashboard.vue')
    }

    protected _menuItemName = 'Dashboard';

    protected _menuItemIcon = 'bi bi-speedometer2';
}