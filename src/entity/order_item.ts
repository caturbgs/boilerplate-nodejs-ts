import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Products} from "./products";
import {Orders} from "./orders";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column()
    public orderId!: string;

    @Column()
    public productId!: string;

    @Column()
    public unitPrice!: number;

    @Column()
    public quantity!: number;

    @ManyToOne(() => Products, product => product.product)
    public product!: Products;

    @ManyToOne(() => Orders, order => order.order)
    public order!: Orders;
}
