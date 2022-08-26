import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Asset } from '../../asset/entities/asset.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'balances' })
export class Balance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Asset, (asset) => asset.id)
  asset: Asset;

  @ManyToOne(() => User, (user) => user.balances)
  user: User;

  @Column({ default: 1 })
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
