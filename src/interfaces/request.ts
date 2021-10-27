export interface Body {
    [key: string]: string | number | boolean | string[] | Body[] | Body;
}

export interface Response {
    status: number;
    message: string;
    result: Body;
}

export interface RequestBody {
    fromJson(data: Body): void;
}
