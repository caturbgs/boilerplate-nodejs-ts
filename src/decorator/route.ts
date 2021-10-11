import * as Router from "@koa/router";
import {getAppConfig} from "../config/app";
import * as KoaBody from "koa-body";
import {ClassType} from "type-graphql";
import {validate} from "class-validator";
import {RequestBody} from "../interfaces/request";
import {ApplicationError} from "../helper/error_handler";

const koaBody = KoaBody({
    multipart: true,
    formidable: {
        uploadDir: getAppConfig().uploadDir,
        keepExtensions: true,
    },
});

interface RouteTarget {
    __router?: Router;
}

const bodyHandler = async (bodyClass, ctx, target, propertyKey) => {
    if (bodyClass) {
        const body = new bodyClass();

        body.fromJson(ctx.request.body);

        const validationErrors = await validate(body);

        if (validationErrors.length > 0) {
            const errorMessages = validationErrors.map(it => Object.values(it.constraints)).flat();

            throw new ApplicationError({
                message: "Validation Error",
                type: "BodyValidationError",
                httpCode: 400,
                detail: {
                    validation: errorMessages,
                },
            });
        }

        // eslint-disable-next-line security/detect-object-injection
        await target[propertyKey].call(target, ctx, body);

        return;
    }

    // eslint-disable-next-line security/detect-object-injection
    target[propertyKey].bind(target, ctx, ctx.request.body);
};

export function get<T>(route: string, middleware = []): (target: T, propertyKey: string) => void {
    return (target: T & RouteTarget, propertyKey: string) => {
        target.__router = target.__router || new Router();
        // eslint-disable-next-line security/detect-object-injection
        target.__router.get(route, ...middleware, target[propertyKey].bind(target));
    };
}

export function put<T>(route: string, middleware = [], bodyClass?: ClassType<RequestBody>): (target: T, propertyKey: string) => void {
    return (target: T & RouteTarget, propertyKey: string) => {
        target.__router = target.__router || new Router();
        target.__router.put(route, koaBody, ...middleware, async (ctx) => {
            await bodyHandler(bodyClass, ctx, target, propertyKey);
        });
    };
}

export function post<T>(route: string, middleware = [], bodyClass?: ClassType<RequestBody>): (target: T, propertyKey: string) => void {
    return (target: T & RouteTarget, propertyKey: string) => {
        target.__router = target.__router || new Router();
        target.__router.post(route, koaBody, ...middleware, async (ctx) => {
            await bodyHandler(bodyClass, ctx, target, propertyKey);
        });
    };
}

export function del<T>(route: string, middleware = [], bodyClass?: ClassType<RequestBody>): (target: T, propertyKey: string) => void {
    return (target: T & RouteTarget, propertyKey: string) => {
        target.__router = target.__router || new Router();
        target.__router.del(route, ...middleware, async (ctx) => {
            await bodyHandler(bodyClass, ctx, target, propertyKey);
        });
    };
}
