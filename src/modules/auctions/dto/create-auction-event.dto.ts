import type { AuctionEventType } from '../../../common/constants/auction-event-type.enum';

export class CreateAuctionEventDto {
  type: AuctionEventType;
  chain_id: string;
  from_account: string;
  created_at: string | number;
  auction?: string;
  price?: number;
}
