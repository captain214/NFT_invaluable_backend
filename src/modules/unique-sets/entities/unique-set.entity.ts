import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { SetItemStatus } from '../../../common/constants/set-item-status.enum';

@Entity({ name: 'unique_set' })
export class UniqueSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action_name: string;

  @Column({ type: 'enum', enum: SetItemStatus, default: SetItemStatus.FREE })
  status: SetItemStatus;

  @Column('text')
  token_uri: string;

  @Column({ nullable: true })
  creator: string;

  @Column({ nullable: true })
  assetId: string;

  @Column({ nullable: true })
  show_time: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
