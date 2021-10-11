import {module} from "../decorator/module";
import {get, post} from "../decorator/route";
import * as path from "path";
import * as fs from "fs";
import {ApplicationError} from "../helper/error_handler";
import * as uuid from "uuid";
import * as send from "koa-send";
import {getAppConfig} from "../config/app";
import {Context, Request} from "koa";
import {Files} from "formidable";

interface UploadFileRequest extends Request {
    files?: Files;
}

@module("/files")
export default class FileModule {
    @post("/", [])
    public async get(ctx: Context): Promise<void> {
        const request = <UploadFileRequest>ctx.request;

        if (!request.files || !request.files.file) {
            throw new ApplicationError({
                message: "No File Detected",
                type: "NoFileDetectedError",
                detail: {},
            });
        }

        const files = request.files.file;

        const extension = path.extname(files.name);

        const fileId = uuid.v4();
        const newFilename = fileId + extension;
        const newFilenamePath = path.join(getAppConfig().uploadDir, newFilename);

        const apiFilePath = `/files/${newFilename}`;

        // eslint-disable-next-line security/detect-non-literal-fs-filename
        await fs.promises.rename(files.path, newFilenamePath);

        ctx.status = 201;
        ctx.body = {
            message: "Success Upload",
            path: apiFilePath,
        };
    }

    @get("/:id", [])
    public async getFile(ctx: Context): Promise<void> {
        await send(ctx, ctx.params.id, {
            root: getAppConfig().uploadDir,
        });

        const a = [{a: 1}, {a: 2}, {a: 3}];

        if (a) {
            return;
        }

        return;
    }
}
