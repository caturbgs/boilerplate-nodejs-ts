import * as cors from "@koa/cors";
import * as Koa from "koa";
import {Context} from "koa";
import * as Router from "@koa/router";
import {ApplicationError, errorHandler, isExpectedError} from "./helper/error_handler";
import {attachLogger} from "./helper/logger";
import {initializeModules} from "./modules";
import {sentryTracingMiddleware} from "./services/sentry";
import {getAppConfig} from "./config/app";
import {loggerMiddleware} from "./middleware/logger";

const initializeKoa = async (): Promise<Koa> => {
    const app: Koa = new Koa();
    const router: Router = new Router();

    app.use(sentryTracingMiddleware);
    app.use(loggerMiddleware());
    app.use(async (ctx, next) => {
        try {
            await next();

            if (ctx.status === 404) {
                ctx.status = 404;
                ctx.body = {
                    message: "route_not_found",
                    type: "NotFound",
                    detail: {},
                };
            }

            if (ctx.status === 405) {
                ctx.status = 405;
                ctx.body = {
                    message: "method_not_allowed",
                    type: "MethodNotAllowed",
                    detail: {},
                };
            }
        } catch (err) {
            let localError = err;

            if (localError.status === 401) {
                localError = new ApplicationError({
                    message: err.message,
                    type: "AuthenticationError",
                    detail: {},
                });
            }

            localError.requestID = ctx.requestID;

            ctx.app.emit("error", localError, ctx);

            if (isExpectedError(err)) {
                ctx.status = localError.httpCode;
                ctx.body = {
                    message: localError.message,
                    type: localError.name,
                    detail: localError.detail,
                    requestID: ctx.requestID,
                };

                return;
            }


            let message = "InternalServerError";

            if (getAppConfig().showErrorStack && localError.stack) {
                message = localError.stack.split("\n")[0];
            }

            ctx.status = 500;
            ctx.body = {
                message,
                status: false,
                requestID: ctx.requestID,
            };

            return;
        }
    });

    app.use(cors());
    await initializeModules(router);
    attachLogger(app);
    app.use(router.routes());
    app.use(router.allowedMethods());

    app.on("error", (err: Error, ctx: Context) => {
        errorHandler(err, ctx);
    });

    return app;
};

export {initializeKoa};
