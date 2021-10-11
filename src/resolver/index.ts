import * as fs from "fs";
import {ClassType} from "type-graphql";

export async function initializeResolver(): Promise<ClassType[]> {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const modules = (await fs.promises.readdir((__dirname)))
        .filter(it => it.endsWith(".ts"))
        .filter(it => it !== "index.ts")
        .map(it => it.replace(".ts", ""));

    return Promise.all(modules.map(async (fileName) => {
        const module: ClassType = (await import(`${__dirname}/${fileName}`)).default;

        return module;
    }));
}
