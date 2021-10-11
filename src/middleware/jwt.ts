import * as koaJwt from "koa-jwt";
import {getAppConfig} from "../config/app";

export const checkToken = koaJwt({secret: getAppConfig().secret});
export const optionalCheckToken = koaJwt({
    secret: getAppConfig().secret,
    passthrough: true,
});
