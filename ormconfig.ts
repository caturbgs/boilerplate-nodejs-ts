import {SnakeNamingStrategy} from "typeorm-naming-strategies";

export = {
    type: process.env.DB_CLIENT,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        "src/entity/*.ts",
    ],
    migrations: [
        "src/migration/*.ts",
    ],
    subscribers: [
        "src/subscriber/*.ts",
    ],
    "cli": {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber",
    },
    synchronize: true,
    logging: true,
    namingStrategy: new SnakeNamingStrategy(),
}
