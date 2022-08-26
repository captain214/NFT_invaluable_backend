import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuctionStatus } from '../../../common/constants/auction-status.enum';
import { Asset } from '../../asset/entities/asset.entity';
import { AuctionEvent } from './auction-event.entity';

@Entity({ name: 'auctions' })
export class Auction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Asset, (asset) => asset.id)
  asset: Asset;

  @Column({ default: false, nullable: false })
  cancelled: boolean;

  @Column({ default: false, nullable: false })
  item_claimed: boolean;

  @Column()
  chain_id: string;

  @Column()
  beneficiary: string;

  @Column()
  token_id: number;

  @Column('numeric')
  bid_step: number;

  @Column('numeric')
  starting_bid: number;

  @Column({ type: 'timestamptz' })
  start_date: Date;

  @Column({ type: 'timestamptz' })
  end_date: Date;

  @Column()
  accept_erc20: boolean;

  @Column()
  is_erc1155: boolean;

  @Column()
  quantity: number;

  @Column()
  fee_rate: number;

  @Column()
  overtime_seconds: number;

  @Column()
  address: string;

  @CreateDateColumn()
  created_at: Date;

  status: AuctionStatus;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  computeStatus(): void {
    const now = Date.now();
    if (this.cancelled) {
      this.status = AuctionStatus.CANCELLED;
    } else if (now < this.start_date.getTime()) {
      this.status = AuctionStatus.PENDING;
    } else if (now > this.end_date.getTime()) {
      this.status = AuctionStatus.ENDED;
    } else {
      this.status = AuctionStatus.IN_PROGRESS;
    }
  }

  @OneToMany(() => AuctionEvent, (event) => event.auction)
  events: AuctionEvent[];
}
