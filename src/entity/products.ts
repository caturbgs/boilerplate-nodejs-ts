import {Column, Entity, ManyToOne} from "typeorm";
import {Body, RequestBody} from "../interfaces/request";
import {pick} from "lodash";
import {Suppliers} from "./suppliers";
import {BaseEntity} from "./base_entity";

@Entity()
export class Products extends BaseEntity implements RequestBody {
    @Column()
    productName: string;

    @Column()
    lastName: string;

    @Column()
    city: string;

    @Column()
    country: string;

    @Column()
    phone: string;

    @ManyToOne(() => Suppliers, supplier => supplier.product)
    supplier: Suppliers[];

    fromJson(data: Body): void {
        Object
            .keys(pick(data, ["firstName", "lastName"]))
            .forEach((key) => {
                // eslint-disable-next-line security/detect-object-injection
                this[key] = data[key];
            });
    }
}
