import * as Sentry from "@sentry/node";
import {getAppConfig} from "../config/app";
import {extractTraceparentData, stripUrlQueryAndFragment} from "@sentry/tracing";
import {Context, Next} from "koa";

export function initSentry(): void {
    if (getAppConfig().enableSentry) {
        Sentry.init({
            dsn: getAppConfig().sentryUrl,
            tracesSampleRate: 1.0,
        });
    }
}

export function sentryLogger(err: Error, ctx: Context): void {
    if (getAppConfig().enableSentry) {
        Sentry.withScope((scope) => {
            if (ctx) {
                scope.addEventProcessor(event => Sentry.Handlers.parseRequest(event, ctx.request));
                scope.setTag("request_id", ctx.requestID);
            } else {
                scope.setTag("request_id", "unknown");
            }

            Sentry.captureException(err);
        });
    }
}

export async function sentryTracingMiddleware(ctx: Context, next: Next): Promise<void> {
    if (getAppConfig().enableSentry) {
        const reqMethod = (ctx.method || "").toUpperCase();
        const reqUrl = ctx.url && stripUrlQueryAndFragment(ctx.url);

        // connect to trace of upstream app
        let traceparentData;

        if (ctx.request.get("sentry-trace")) {
            traceparentData = extractTraceparentData(ctx.request.get("sentry-trace"));
        }

        const transaction = Sentry.startTransaction({
            name: `${reqMethod} ${reqUrl}`,
            op: "http.server",
            ...traceparentData,
        });

        ctx["__sentry_transaction"] = transaction;

        // We put the transaction on the scope so users can attach children to it
        Sentry.getCurrentHub().configureScope((scope) => {
            scope.setSpan(transaction);
        });

        ctx.res.on("finish", () => {
            // Push `transaction.finish` to the next event loop so open spans have a chance to finish before the transaction closes
            setImmediate(() => {
                // if using koa router, a nicer way to capture transaction using the matched route
                if (ctx._matchedRoute) {
                    const mountPath = ctx.mountPath || "";

                    transaction.setName(`${reqMethod} ${mountPath}${ctx._matchedRoute}`);
                }

                transaction.setHttpStatus(ctx.status);
                transaction.finish();
            });
        });

        await next();

        return;
    }

    await next();
}
