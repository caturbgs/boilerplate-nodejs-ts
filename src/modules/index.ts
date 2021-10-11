import * as fs from "fs";
import * as Router from "@koa/router";

export async function initializeModules(router: Router): Promise<void> {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const modules = (await fs.promises.readdir((__dirname)))
        .filter(it => it.endsWith(".ts"))
        .filter(it => it !== "index.ts")
        .map(it => it.replace(".ts", ""));

    modules.map(async (module) => {
        const moduleController = await import(`${__dirname}/${module}`);
        const controller = new moduleController.default();

        router.use(controller.__routeName || "", controller.__router.routes(), controller.__router.allowedMethods());
    });
}
