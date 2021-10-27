import {EntityRepository, Repository} from "typeorm";
import {Users} from "../entity/users";

@EntityRepository(Users)
export class UserRepository extends Repository<Users> {
    findByName(firstName: string, lastName: string): Promise<Users> {
        return this.findOne({
            firstName,
            lastName,
        });
    }
}
