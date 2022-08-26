import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AuctionEventType } from '../../../common/constants/auction-event-type.enum';
import { Auction } from './auction.entity';

@Entity({ name: 'auction_events' })
export class AuctionEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Auction, (auction) => auction.id, { nullable: true })
  auction: Auction;

  @Column({ type: 'enum', enum: AuctionEventType })
  type: AuctionEventType;

  @Column()
  chain_id: string;

  @Column({ type: 'numeric', nullable: true })
  price: number;

  @Column()
  from_account: string;

  @Column({ type: 'timestamptz' })
  created_at: Date;
}
