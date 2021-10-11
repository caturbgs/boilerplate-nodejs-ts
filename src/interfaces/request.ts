export interface Body {
    [key: string]: string | number | boolean | string[] | Body[] | Body;
}

export interface RequestBody {
    fromJson(data: Body): void;
}
