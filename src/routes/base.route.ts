import { RouteRecordRaw } from "vue-router";

export default abstract class BaseRoute {
    protected abstract _route: RouteRecordRaw;

    protected abstract _menuItemName: string;

    protected abstract _menuItemIcon: string;

    public get route() {
        return this._route;
    }

    public get menuItemName() {
        return this._menuItemName;
    }

    public get menuItemIcon() {
        return this._menuItemIcon;
    }
}