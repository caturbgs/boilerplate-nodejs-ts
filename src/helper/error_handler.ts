import {log} from "./logger";
import {sentryLogger} from "../services/sentry";
import {Context} from "koa";
import {Body} from "../interfaces/request";

const errorTypeHttpCode = {
    QueryValidationError: 400,
    ParamsValidationError: 400,
    BodyValidationError: 400,
    InvalidRequest: 400,
    InvalidVerificationCode: 400,
    AuthenticationError: 401,
};

export const ERROR_CODE = {
    QueryValidationError: "QueryValidationError",
    ParamsValidationError: "ParamsValidationError",
    BodyValidationError: "BodyValidationError",
    InvalidRequest: "InvalidRequest",
    InvalidVerificationCode: "InvalidVerificationCode",
    AuthenticationError: "AuthenticationError",
};

interface ApplicationErrorArgument {
    type?: string,
    message: string,
    httpCode?: number,
    detail?: Body,
    expected?: boolean,
    requestID?: string,
}

export class ApplicationError extends Error {
    public type: string;

    public httpCode: number;

    public detail: Body;

    public expected: boolean;

    public requestID: string;

    constructor(obj: ApplicationErrorArgument) {
        super(obj.message);
        this.name = obj.type ?? obj.message;
        this.httpCode = obj.httpCode || errorTypeHttpCode[obj.type] || 500;
        this.detail = obj.detail || {};
        this.expected = (typeof obj.expected === "undefined") ? true : !!obj.expected;
        this.requestID = obj.requestID ?? "";
    }
}

export function isExpectedError(err: Error): boolean {
    if (err instanceof ApplicationError) {
        return err.expected;
    }

    return false;
}

export function errorHandler(err: Error, ctx: Context = null): void {
    if (isExpectedError(err)) {
        log.warn(err);
    } else {
        sentryLogger(err, ctx);
        log.error(err);
    }
}
