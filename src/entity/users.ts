import {Column, Entity} from "typeorm";
import {Body, RequestBody} from "../interfaces/request";
import {pick} from "lodash";
import {BaseEntity} from "./base_entity";

@Entity()
export class Users extends BaseEntity implements RequestBody {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    phoneNumber: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    fromJson(data: Body): void {
        Object
            .keys(pick(data, ["firstName", "lastName"]))
            .forEach((key) => {
                // eslint-disable-next-line security/detect-object-injection
                this[key] = data[key];
            });
    }
}
