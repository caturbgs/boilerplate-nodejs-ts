import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Body, RequestBody} from "../interfaces/request";
import {pick} from "lodash";

@Entity()
export class User implements RequestBody {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;


    fromJson(data: Body): void {
        Object
            .keys(pick(data, ["firstName", "lastName"]))
            .forEach((key) => {
                // eslint-disable-next-line security/detect-object-injection
                this[key] = data[key];
            });
    }
}
