import {getAppConfig} from "../config/app";

export const validateEnv = (): void => {
    if (!getAppConfig().port) {
        throw new Error("port must be provided");
    }

    if (!getAppConfig().secret) {
        throw new Error("secret must be provided");
    }

    if (getAppConfig().enableDB) {
        if (!process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USERNAME || !process.env.DB_CLIENT) {
            throw new Error("database config must be provided");
        }
    }

    if (getAppConfig().enableSentry) {
        if (!getAppConfig().sentryUrl) {
            throw new Error("sentry url must be provided if sentry enabled");
        }
    }
};
