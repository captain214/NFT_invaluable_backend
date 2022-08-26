import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'raw_events' })
export class RawEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  block: number;

  @Column()
  log_index: number;

  @Column({ nullable: true })
  transaction_hash: string;

  @Column()
  chain: string;

  @Column()
  data: string;

  @Column({ default: false })
  handled: boolean;

  @CreateDateColumn()
  created_at: Date;
}
