/* eslint-disable no-invalid-this */

import { ConsoleLogger, Injectable } from '@nestjs/common';
import type Web3 from 'web3';
import type { Contract, EventData } from 'web3-eth-contract';
import type { AbiItem } from 'web3-utils';

import AuctionContract from '../../../contracts/AuctionStreak.json';
import { AuctionEventType } from '../../common/constants/auction-event-type.enum';
import { OrderStatus } from '../../common/constants/order-status.enum';
import { OrderType } from '../../common/constants/order-type.enum';
import type { CreateOrderReqDto } from '../../modules/orders/dto/create-order.req.dto';
import { OrdersService } from '../../modules/orders/orders.service';
import { UserService } from '../../modules/user/user.service';
import type { IChainConfig } from '../../shared/services/blockchain-config.service';
import { BlockchainConfigService } from '../../shared/services/blockchain-config.service';
import { AssetService } from '../asset/asset.service';
import { AuctionsService } from '../auctions/auctions.service';
import { EventsService } from '../events/events.service';

const AUCTION_ABI = AuctionContract.abi as AbiItem[];

@Injectable()
export class AuctionEventsHandler {
  private readonly logger = new ConsoleLogger('AuctionEventsHandler');
  private blockchains: Record<string, IChainConfig>;
  constructor(
    public readonly configService: BlockchainConfigService,
    public readonly assetService: AssetService,
    public readonly eventsService: EventsService,
    public readonly auctionsService: AuctionsService,
    public readonly ordersService: OrdersService,
    public readonly userService: UserService,
  ) {
    this.blockchains = this.configService.allBlockchainConfig;
  }

  auctionCreatedEventHandler = async (
    data: EventData,
    chain: string,
    web3: Web3,
    contract: Contract,
  ): Promise<void> => {
    this.logger.log(data, 'event');
    const { auctionContract, beneficiary, tokenId } = data.returnValues;
    const {
      startingBid,
      bidStep,
      startTimestamp,
      endTimestamp,
      overtimeSeconds,
      feeRate,
    } = await contract.methods.auctionParameters(auctionContract).call();
    const auction = new web3.eth.Contract(AUCTION_ABI, auctionContract);
    const eventBlock = data.blockNumber;
    const eventTimestamp = (await web3.eth.getBlock(eventBlock)).timestamp;

    const isErc1155 = await auction.methods.isErc1155().call();
    const chainContracts = this.blockchains[chain];
    const assetAddress = isErc1155
      ? chainContracts.contractAddresses.ERC1155
      : chainContracts.contractAddresses.ERC721;

    const asset = await this.assetService.findOne(assetAddress, tokenId);
    if (!asset) {
      this.logger.error(
        `Couldn't find asset for auction '${auctionContract}'!`,
      );
    }
    const createdAuction = await this.auctionsService.createAuction({
      beneficiary,
      token_id: +tokenId,
      starting_bid: startingBid,
      bid_step: bidStep,
      start_date: new Date(Number(startTimestamp) * 1000),
      end_date: new Date(Number(endTimestamp) * 1000),
      overtime_seconds: +overtimeSeconds,
      fee_rate: +feeRate,
      accept_erc20: await auction.methods.acceptERC20().call(),
      is_erc1155: await auction.methods.isErc1155().call(),
      quantity: +(await auction.methods.quantity().call()),
      address: auctionContract,
      asset: asset && asset.id,
      chain_id: chain,
    });
    await this.auctionsService.createAuctionEvent({
      type: AuctionEventType.AUCTION_CREATED,
      chain_id: chain,
      from_account: data.address,
      created_at: Number(eventTimestamp) * 1000,
      auction: createdAuction.id,
    });
    const creator = await this.userService.getUserByAddress(beneficiary);
    const newOrder: CreateOrderReqDto = {
      token_id: +tokenId,
      address: assetAddress,
      price: startingBid,
      creator,
      type: OrderType.AUCTION,
    };
    await this.ordersService.createOrder(newOrder);
    if (!isErc1155) {
      await this.assetService.setCurrentPrice({
        tokenId,
        address: assetAddress,
        price: startingBid,
      });
    }
  };

  bidPlacedEventHandler = async (
    data: EventData,
    chain: string,
    web3: Web3,
  ): Promise<void> => {
    const eventBlock = await web3.eth.getBlock(data.blockNumber);
    const { auctionContract, bidder, bid } = data.returnValues;
    const auction = await this.auctionsService.findOneByAddress(
      auctionContract,
    );
    if (!auction) {
      this.logger.warn(
        `Couldn't find auction in db for contract '${auctionContract}'!`,
      );
    }
    await this.auctionsService.createAuctionEvent({
      type: AuctionEventType.BID_PLACED,
      chain_id: chain,
      from_account: bidder,
      price: bid,
      created_at: Number(eventBlock.timestamp) * 1000,
      auction: auction && auction.id,
    });
  };

  fundsClaimedEventHandler = async (
    data: EventData,
    chain: string,
    web3: Web3,
  ): Promise<void> => {
    const eventBlock = await web3.eth.getBlock(data.blockNumber);
    const { auctionContract, claimer, withdrawalAmount } = data.returnValues;
    const auction = await this.auctionsService.findOneByAddress(
      auctionContract,
    );
    if (!auction) {
      this.logger.warn(
        `Couldn't find auction in db for contract '${auctionContract}'!`,
      );
    }
    await this.auctionsService.createAuctionEvent({
      type: AuctionEventType.FUNDS_CLAIMED,
      chain_id: chain,
      from_account: claimer,
      price: withdrawalAmount,
      created_at: Number(eventBlock.timestamp) * 1000,
      auction: auction && auction.id,
    });
  };

  itemClaimedEventHandler = async (
    data: EventData,
    chain: string,
    web3: Web3,
  ): Promise<void> => {
    const eventBlock = await web3.eth.getBlock(data.blockNumber);
    const { auctionContract, claimer } = data.returnValues;
    const auction = await this.auctionsService.findOneByAddress(
      auctionContract,
    );
    if (auction) {
      await this.auctionsService.updateByAddress(auctionContract, {
        item_claimed: true,
      });
    } else {
      this.logger.warn(
        `Couldn't find auction in db for contract '${auctionContract}'!`,
      );
    }
    await this.auctionsService.createAuctionEvent({
      type: AuctionEventType.ITEM_CLAIMED,
      chain_id: chain,
      from_account: claimer,
      created_at: Number(eventBlock.timestamp) * 1000,
      auction: auction && auction.id,
    });
  };

  auctionCancelledEventHandler = async (
    data: EventData,
    chain: string,
    web3: Web3,
  ): Promise<void> => {
    const eventBlock = await web3.eth.getBlock(data.blockNumber);
    const { auctionContract } = data.returnValues;
    const auction = await this.auctionsService.findOneByAddress(
      auctionContract,
    );
    if (auction) {
      await this.auctionsService.updateByAddress(auctionContract, {
        cancelled: true,
      });
    } else {
      this.logger.warn(
        `Couldn't find auction in db for contract '${auctionContract}'!`,
      );
    }
    await this.auctionsService.createAuctionEvent({
      type: AuctionEventType.AUCTION_CANCELLED,
      chain_id: chain,
      from_account: data.address,
      created_at: Number(eventBlock.timestamp) * 1000,
      auction: auction && auction.id,
    });
    const [order] = await this.ordersService.getOrdersForAsset({
      asset_id: auction.asset?.id,
      status: OrderStatus.ACTIVE,
    });
    if (!order) {
      this.logger.log(
        'Could not find active order',
        'auctionCancelledEventHandler',
      );
      return;
    }
    await this.ordersService.cancelOffer(order.id);
    // if (!auction.is_erc1155) {
    //   await this.assetService.setCurrentPrice({
    //     tokenId,
    //     address: assetAddress,
    //     price: startingBid,
    //   });
    // }
  };
}
