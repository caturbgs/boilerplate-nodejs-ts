import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {getCustomRepository} from "typeorm";
import {User} from "../entity/user";
import {UserRepository} from "../repository/user";
import {CreateUserInput, UpdateUserInput} from "../mapping/input/user";

@Resolver()
export default class UserResolver {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = getCustomRepository(UserRepository);
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        return this.userRepository.find({});
    }

    @Mutation(() => User)
    async createUser(@Arg("data") data: CreateUserInput): Promise<User> {
        const user = new User();

        Object.assign(user, data);

        await this.userRepository.save(user);

        return user;
    }

    @Query(() => User)
    userById(@Arg("id") id: string): Promise<User> {
        return this.userRepository.findOne({where: {id}});
    }

    @Mutation(() => User)
    async updateUser(@Arg("id") id: string, @Arg("data") data: UpdateUserInput): Promise<User> {
        const user = await this.userRepository.findOne({where: {id}});

        if (!user) {
            throw new Error("User not found!");
        }

        Object.assign(user, data);

        await this.userRepository.save(user);

        return user;
    }

    @Mutation(() => Boolean)
    async deleteUser(@Arg("id") id: string): Promise<boolean> {
        const user = await this.userRepository.findOne({where: {id}});

        if (!user) {
            throw new Error("User not found!");
        }

        await this.userRepository.remove(user);

        return true;
    }
}
