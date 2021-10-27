import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {Customers} from "./customers";
import {BaseEntity} from "./base_entity";
import {OrderItem} from "./order_item";

@Entity()
export class Orders extends BaseEntity {
    @Column()
    orderDate: string;

    @ManyToOne(() => Customers, customer => customer.id)
    customer: Customers[];

    @Column()
    totalAmount: number;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    public order!: OrderItem[];
}
