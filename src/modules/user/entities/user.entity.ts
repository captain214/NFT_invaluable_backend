import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RoleType } from '../../../common/constants/role-type';
import { Asset } from '../../asset/entities/asset.entity';
import { Balance } from '../../balances/entities/balance.entity';
import { EventLog } from '../../events/entities/event.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ unique: true })
  address: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  banner: string;

  @Column({ nullable: true })
  about: string;

  @Column({ nullable: true })
  nonce: string;

  @Column('varchar', { array: true, nullable: true, default: {} })
  favorites: string[];

  @OneToMany(() => Balance, (balance) => balance.user)
  balances: Balance[];

  @OneToMany(() => Asset, (asset) => asset.creator)
  assets: Asset[];

  @OneToMany(() => EventLog, (event) => event.from_user)
  fromEvents: EventLog[];

  @OneToMany(() => EventLog, (event) => event.to_user)
  toEvents: EventLog[];

  @OneToMany(() => Order, (order) => order.creator)
  creatorOrders: Order[];

  @OneToMany(() => Order, (order) => order.taker)
  takerOrders: Order[];
}
