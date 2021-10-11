import * as Router from "@koa/router";

interface ModuleTarget {
    prototype: { __routeName: string, __router: Router }
}

export function module<T>(route: string): (constructor: T) => void {
    return (target: T & ModuleTarget) => {
        target.prototype.__routeName = route;
        target.prototype.__router = target.prototype.__router || new Router();
    };
}
