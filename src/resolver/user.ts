import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {Users} from "../entity/users";
import {UserRepository} from "../repository/user";
import {CreateUserInput, UpdateUserInput} from "../mapping/input/user";

@Resolver()
export default class UserResolver {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = getCustomRepository(UserRepository);
    }

    @Query(() => [Users])
    async users(): Promise<Users[]> {
        return this.userRepository.find({});
    }

    @Mutation(() => Users)
    async createUser(@Arg("data") data: CreateUserInput): Promise<Users> {
        const user = new Users();

        Object.assign(user, data);

        await this.userRepository.save(user);

        return user;
    }

    @Query(() => Users)
    userById(@Arg("id") id: string): Promise<Users> {
        return this.userRepository.findOne({where: {id}});
    }

    @Mutation(() => Users)
    async updateUser(@Arg("id") id: string, @Arg("data") data: UpdateUserInput): Promise<Users> {
        const user = await this.userRepository.findOne({where: {id}});

        if (!user) {
            throw new Error("Users not found!");
        }

        Object.assign(user, data);

        await this.userRepository.save(user);

        return user;
    }

    @Mutation(() => Boolean)
    async deleteUser(@Arg("id") id: string): Promise<boolean> {
        const user = await this.userRepository.findOne({where: {id}});

        if (!user) {
            throw new Error("Users not found!");
        }

        await this.userRepository.remove(user);

        return true;
    }
}
