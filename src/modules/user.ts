import {module} from "../decorator/module";
import {del, get, post, put} from "../decorator/route";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../repository/user";
import {Users} from "../entity/users";
import {Context} from "koa";

@module("/users")
export default class UserModule {
    @get("/", [])
    public async get(ctx: Context): Promise<void> {
        const userRepository = getCustomRepository(UserRepository);

        const [rows, count] = await userRepository.findAndCount();

        ctx.body = {
            rows,
            count,
        };
    }

    @post("/", [], Users)
    public async post(ctx: Context, body: Users): Promise<void> {
        ctx.log.info("yo start");

        const userRepository = getCustomRepository(UserRepository);

        await userRepository.insert(body);

        ctx.log.info("new_user_created");
        // throw new Error("InvalidRequestyomaiersnteiqwfiopeqiowf");

        ctx.body = {
            message: "success",
        };
    }


    @put("/:id", [], Users)
    public async put(ctx: Context, body: Users): Promise<void> {
        const userRepository = getCustomRepository(UserRepository);

        const user = await userRepository.findOne(ctx.params.id);

        Object.assign(user, body);

        await userRepository.save(user);

        ctx.body = {
            message: "success",
        };
    }

    @del("/:id", [])
    public async del(ctx: Context): Promise<void> {
        const userRepository = getCustomRepository(UserRepository);

        const user = await userRepository.findOne(ctx.params.id);

        await userRepository.delete(user);

        ctx.body = {
            message: "success",
        };
    }
}
