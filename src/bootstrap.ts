import {appConfig, getAppConfig} from "./config/app";
import {initializeKoa} from "./app";
import {createLogger} from "./helper/logger";
import {errorHandler, isExpectedError} from "./helper/error_handler";
import {createConnection} from "typeorm";
import {initializeScheduler} from "./scheduler";
import {ApolloServer} from "apollo-server-koa";
import {ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core";
import {buildTypeDefsAndResolvers, ClassType} from "type-graphql";
import {initializeResolver} from "./resolver";
import {authChecker} from "./helper/auth_checker";
import {initSentry, sentryLogger} from "./services/sentry";
import {validateEnv} from "./helper/env_validator";
import {NonEmptyArray} from "type-graphql/dist/interfaces/NonEmptyArray";
import * as Koa from "koa";
import {Server} from "http";
import {getCurrentVersion} from "./helper/version";

const log = createLogger("bootstrap");

process.on("uncaughtException", async (error) => {
    await errorHandler(error);

    if (!isExpectedError(error)) {
        process.exit(1);
    }
});

process.on("unhandledRejection", (reason) => {
    throw reason;
});

export const initDatabase = async (): Promise<void> => {
    if (!getAppConfig().enableDB) {
        return;
    }

    await createConnection();
    log.info("Database synchronized");
};

export const createServer = async (koaApp: Koa): Promise<Server> => koaApp.listen({port: getAppConfig().port}, () => {
    log.info(`🚀 Server ready at http://localhost:${getAppConfig().port}`);
});

export const initScheduler = (): Promise<void> => {
    if (!getAppConfig().enableScheduler) {
        return;
    }

    return initializeScheduler();
};

export const initGraphQL = async (koaApp: Koa): Promise<void> => {
    if (!getAppConfig().enableGraphql) {
        return;
    }

    const resolver: ClassType[] = await initializeResolver();

    if (!resolver.length) {
        throw new Error("no resolver found");
    }

    const {typeDefs, resolvers} = await buildTypeDefsAndResolvers({
        resolvers: resolver as unknown as NonEmptyArray<string>,
        authChecker,
    });

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(),
        ],
        context: context => ({
            ctx: context.ctx,
            user: context.ctx.state.user,
        }),
    });

    await server.start();

    server.applyMiddleware({app: koaApp});

    log.info(`🚀 GraphQL ready at http://localhost:${getAppConfig().port}${server.graphqlPath}`);
};

export const bootstrap = async (): Promise<void> => {
    try {
        await initSentry();
        validateEnv();

        getCurrentVersion().then((version) => {
            appConfig.version = version;
        }).catch((err) => {
            sentryLogger(err, null);
        });

        await initDatabase();

        await initScheduler();

        const koaApp: Koa = await initializeKoa();

        await initGraphQL(koaApp);

        await createServer(koaApp);
    } catch (err) {
        sentryLogger(err, null);
        throw err;
    }
};
