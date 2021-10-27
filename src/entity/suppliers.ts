import {Column, Entity, OneToMany} from "typeorm";
import {Body, RequestBody} from "../interfaces/request";
import {pick} from "lodash";
import {Products} from "./products";
import {BaseEntity} from "./base_entity";

@Entity()
export class Suppliers extends BaseEntity implements RequestBody {
    @Column()
    companyName: string;

    @Column()
    unitPrice: number;

    @Column()
    package: string;

    @Column()
    isDiscontinued: boolean;

    @OneToMany(() => Products, product => product.id)
    product: Products;

    fromJson(data: Body): void {
        Object
            .keys(pick(data, ["firstName", "lastName"]))
            .forEach((key) => {
                // eslint-disable-next-line security/detect-object-injection
                this[key] = data[key];
            });
    }
}
