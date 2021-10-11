import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

interface IAppConfig {
    name: string,
    port: string | number,
    version: string,
    secret: string,
    uploadDir: string,
    enableDB: boolean,
    enableGraphql: boolean,
    enableScheduler: boolean,
    enableSentry: boolean,
    sentryUrl: string,
    showErrorStack: boolean,
    validationMessage?: {
        [name: string]: string
    },
}

export const appConfig: IAppConfig = {
    name: "backend-boilerplate",
    version: process.env.VERSION ?? "",
    port: process.env.PORT,
    secret: process.env.SECRET,
    enableDB: (process.env.ENABLE_DB ?? "yes") === "yes",
    enableGraphql: (process.env.ENABLE_GRAPHQL ?? "yes") === "yes",
    enableScheduler: (process.env.ENABLE_SCHEDULER ?? "yes") === "yes",
    enableSentry: (process.env.ENABLE_SENTRY ?? "no") === "yes",
    showErrorStack: (process.env.SHOW_ERROR_STACK ?? "yes") === "yes",
    sentryUrl: process.env.SENTRY_URL ?? "",
    uploadDir: process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads"),
};

export const getAppConfig = (): IAppConfig => appConfig;
