import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EventType } from '../../../common/constants/event-type.enum';
import { Asset } from '../../asset/entities/asset.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'events' })
export class EventLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'enum', enum: EventType })
  type: EventType;

  @ManyToOne(() => Asset, (asset) => asset.id)
  asset: Asset;

  @ManyToOne(() => User, (user) => user.fromEvents, { nullable: true })
  from_user: User;

  @ManyToOne(() => User, (user) => user.toEvents, { nullable: true })
  to_user: User;

  @Column({ type: 'numeric', nullable: true })
  price: number;

  @Column({ default: 1 })
  quantity: number;

  @Column('int8')
  timestamp: number;
}
