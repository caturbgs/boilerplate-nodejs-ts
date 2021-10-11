import * as onFinished from "on-finished";
import * as pino from "pino";
import {Bindings, Logger} from "pino";
import * as Koa from "koa";

export const log = pino();

export function createLogger(type: string, config?: Bindings): Logger {
    return log.child({
        type,
        ...config,
    });
}

const httpLog = createLogger("http");

export function attachLogger(app: Koa): void {
    app.use(async (ctx, next) => {
        const startTime = new Date().getTime();

        const onResponseFinished = () => {
            const duration = Date.now() - startTime;

            const message = `  --> ${ctx.request.method} ${ctx.request.originalUrl} ${ctx.status} ${duration}ms`;

            const logObject = {
                method: ctx.request.method,
                path: ctx.path,
                status: ctx.status,
                duration: duration,
            };


            if (ctx.status >= 500) {
                httpLog.error(logObject, message);
            } else if (ctx.status >= 400) {
                httpLog.warn(logObject, message);
            } else {
                httpLog.info(logObject, message);
            }
        };

        try {
            await next();
        } finally {
            onFinished(ctx.response.res, onResponseFinished.bind(ctx));
        }
    });
}
