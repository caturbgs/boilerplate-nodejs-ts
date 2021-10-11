import {createLogger} from "../helper/logger";
import * as uuid from "uuid";
import {Middleware} from "koa";

export function loggerMiddleware(): Middleware {
    return async (ctx, next) => {
        const requestID = ctx.headers["X-Request-ID"] ?? uuid.v4();
        const log = createLogger("request", {
            requestID: requestID,
        });

        ctx.requestID = requestID;
        ctx.set("X-Request-ID", ctx.requestID);
        ctx.log = log;
        await next();
    };
}
