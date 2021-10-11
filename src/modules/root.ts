import {module} from "../decorator/module";
import {get} from "../decorator/route";
import {createLogger} from "../helper/logger";
import {getAppConfig} from "../config/app";
import {Context} from "koa";

const log = createLogger("module", {
    module: "root",
});

@module("/")
export default class RootModule {
    @get("/", [])
    public async get(ctx: Context): Promise<void> {
        log.info("root api");
        ctx.body = {
            message: "API is running",
            version: getAppConfig().version,
            name: getAppConfig().name,
        };
    }
}
