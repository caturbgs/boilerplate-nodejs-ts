import {Column, Entity, OneToMany} from "typeorm";
import {Body, RequestBody} from "../interfaces/request";
import {pick} from "lodash";
import {Orders} from "./orders";
import {BaseEntity} from "./base_entity";

@Entity()
export class Customers extends BaseEntity implements RequestBody {
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    city: string;

    @Column()
    country: string;

    @Column()
    phone: string;

    @OneToMany(() => Orders, order => order.customer)
    order: Orders;

    fromJson(data: Body): void {
        Object
            .keys(pick(data, ["firstName", "lastName"]))
            .forEach((key) => {
                // eslint-disable-next-line security/detect-object-injection
                this[key] = data[key];
            });
    }
}
