export class CreateAuctionDto {
  beneficiary: string;
  token_id: number;
  starting_bid: number;
  bid_step: number;
  start_date: Date;
  end_date: Date;
  overtime_seconds: number;
  fee_rate: number;
  accept_erc20: boolean;
  is_erc1155: boolean;
  quantity: number;
  address: string;
  asset: string;
  chain_id: string;
}
