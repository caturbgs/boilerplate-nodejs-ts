import {Column, Entity, ManyToOne} from "typeorm";
import {Customers} from "./customers";
import {BaseEntity} from "./base_entity";

@Entity()
export class Orders extends BaseEntity {
    @Column()
    orderDate: string;

    @ManyToOne(() => Customers, customer => customer.id)
    customer: Customers[];

    @Column()
    totalAmount: number;

}
