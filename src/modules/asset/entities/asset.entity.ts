import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AssetType } from '../../../common/constants/asset-type.enum';
import { TokenType } from '../../../common/constants/token-type.enum';
import { Auction } from '../../../modules/auctions/entities/auction.entity';
import { Balance } from '../../../modules/balances/entities/balance.entity';
import { Order } from '../../../modules/orders/entities/order.entity';
import { Collection } from '../../collections/entities/collection.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'assets' })
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token_id: number;

  @Column()
  address: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  image_url: string;

  @Column({ nullable: true })
  animation_url: string;

  @ManyToOne(() => User, (user) => user.assets)
  creator: User;

  @Column({ type: 'enum', enum: TokenType })
  type: TokenType;

  @Column()
  chain_id: string;

  @Column({ default: 0 })
  favorites_count: number;

  @ManyToOne(() => Collection, (collection) => collection.id)
  collection: Collection;

  @Column({ type: 'enum', enum: AssetType, default: AssetType.IMAGE })
  role: AssetType;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'text', nullable: true })
  properties: string;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Balance, (balance) => balance.asset)
  balances: Balance[];

  @OneToMany(() => Order, (order) => order.asset)
  orders: Order[];

  @OneToMany(() => Auction, (auction) => auction.asset)
  auctions: Auction[];

  @Column({ type: 'numeric', default: 0 })
  current_price: number;

  @Column({ type: 'timestamp', default: 'NOW()' })
  show_time: Date;
}
