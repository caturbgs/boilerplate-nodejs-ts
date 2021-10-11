import * as fs from "fs";
import {appConfig} from "../config/app";

export const getCurrentVersion = async (): Promise<string> => {
    if (appConfig.version) {
        return appConfig.version;
    }

    const rev = (await fs.promises.readFile(".git/HEAD")).toString().trim();

    if (rev.indexOf(":") === -1) {
        return rev;
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return (await fs.promises.readFile(`.git/${rev.substring(5)}`)).toString().trim();
};
