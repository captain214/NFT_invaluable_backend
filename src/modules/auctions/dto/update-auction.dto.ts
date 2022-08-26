import { PartialType } from '@nestjs/swagger';

import { CreateAuctionDto } from './create-auction.dto';

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {
  item_claimed: boolean;
  cancelled: boolean;
}
