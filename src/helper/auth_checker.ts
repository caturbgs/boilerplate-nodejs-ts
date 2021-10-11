import {AuthChecker} from "type-graphql";
import {Context} from "koa";

export const authChecker: AuthChecker<Context> = (context, roles) => {
    const user = context.context.user;

    if (roles.length === 0) {
        // if `@Authorized()`, check only is user exist
        return user !== undefined;
    }

    if (!user) {
        return false;
    }

    if (user.roles.some(role => roles.includes(role))) {
        // grant access if the roles overlap
        return true;
    }

    // no roles matched, restrict access
    return true;
};
