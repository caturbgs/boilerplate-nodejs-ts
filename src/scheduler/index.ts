import * as fs from "fs";

export async function initializeScheduler(): Promise<void> {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const modules = (await fs.promises.readdir((__dirname)))
        .filter(it => it.endsWith(".ts"))
        .filter(it => it !== "index.ts")
        .map(it => it.replace(".ts", ""));

    modules.map(async (module) => {
        const moduleController = await import(`${__dirname}/${module}`);

        new moduleController.default();
    });
}
