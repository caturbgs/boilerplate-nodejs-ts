import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {Body, RequestBody} from "../interfaces/request";
import {pick} from "lodash";
import {Suppliers} from "./suppliers";
import {BaseEntity} from "./base_entity";
import {OrderItem} from "./order_item";

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

    @OneToMany(() => OrderItem, orderItem => orderItem.product)
    public product!: OrderItem[];

    fromJson(data: Body): void {
        Object
            .keys(pick(data, ["firstName", "lastName"]))
            .forEach((key) => {
                // eslint-disable-next-line security/detect-object-injection
                this[key] = data[key];
            });
    }
}
