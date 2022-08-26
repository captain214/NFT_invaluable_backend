import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { OrderSide } from '../../../common/constants/order-side.enum';
import { OrderStatus } from '../../../common/constants/order-status.enum';
import { OrderType } from '../../../common/constants/order-type.enum';
import { Asset } from '../../asset/entities/asset.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Asset, (asset) => asset.id)
  asset: Asset;

  @Column({ type: 'numeric', default: 0 })
  price: number;

  @Column({ nullable: true })
  expiration_time: Date;

  @ManyToOne(() => User, (user) => user.creatorOrders, { nullable: true })
  creator: User;

  @ManyToOne(() => User, (user) => user.takerOrders, { nullable: true })
  taker: User;

  @Column({ type: 'enum', enum: OrderType, default: OrderType.FIX_PRICE })
  type: OrderType;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.ACTIVE })
  status: OrderStatus;

  @Column({ type: 'enum', enum: OrderSide, default: OrderSide.SELL })
  side: OrderSide;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  offer_id: string;

  @Column({ default: 1 })
  quantity: number;
}
