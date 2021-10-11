import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
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

    @Column()
    phoneNumber: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    fromJson(data: Body): void {
        Object
            .keys(pick(data, ["firstName", "lastName"]))
            .forEach((key) => {
                // eslint-disable-next-line security/detect-object-injection
                this[key] = data[key];
            });
    }
}
