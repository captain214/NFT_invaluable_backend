/* eslint-disable no-invalid-this */
import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import Web3 from 'web3';
import type { Contract, EventData } from 'web3-eth-contract';

import AuctionFactoryContract from '../../../contracts/AuctionFactoryStreak.json';
import DropMintingContract from '../../../contracts/DropMinting.json';
import ERC721Contract from '../../../contracts/ERC721Streak.json';
import ERC1155Contract from '../../../contracts/ERC1155Streak.json';
import ExchangeContract from '../../../contracts/ExchangeStreak.json';
import { AssetType } from '../../common/constants/asset-type.enum';
import { EventType } from '../../common/constants/event-type.enum';
import { OrderStatus } from '../../common/constants/order-status.enum';
import { OrderType } from '../../common/constants/order-type.enum';
import { SetItemStatus } from '../../common/constants/set-item-status.enum';
import { TokenType } from '../../common/constants/token-type.enum';
import type { IChainConfig } from '../../shared/services/blockchain-config.service';
import { BlockchainConfigService } from '../../shared/services/blockchain-config.service';
import { AssetService } from '../asset/asset.service';
import type { CreateAssetDto } from '../asset/dto/create-asset.dto';
import { AuctionsService } from '../auctions/auctions.service';
import { BalancesService } from '../balances/balances.service';
import type { CreateBalanceDto } from '../balances/dto/create-balance.dto';
import type { CreateEventReqDto } from '../events/dto/create-event.req.dto';
import { EventsService } from '../events/events.service';
import type { CreateOrderReqDto } from '../orders/dto/create-order.req.dto';
import { OrdersService } from '../orders/orders.service';
import type { CreateRawEventDto } from '../raw-events/dto/create-raw-event.dto';
import { RawEventsService } from '../raw-events/raw-events.service';
import { TokenService } from '../token/token.service';
import { UniqueSetsService } from '../unique-sets/unique-sets.service';
import type { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuctionEventsHandler } from './auction-events.handler';

const abis = {
  ERC721: ERC721Contract.abi,
  ERC1155: ERC1155Contract.abi,
  EXCHANGE: ExchangeContract.abi,
  AuctionFactory: AuctionFactoryContract.abi,
  DropMinting: DropMintingContract.abi,
};

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

const wait = (ms) => {
  const start = Date.now();
  let now = start;
  while (now - start < ms) {
    now = Date.now();
  }
};

@Injectable()
export class EventListenerService {
  private readonly logger = new ConsoleLogger();
  private blockchains: Record<string, IChainConfig>;
  private web3connections: Record<string, Web3> = {};
  private contracts: Record<string, Record<string, Contract>> = {};
  constructor(
    private readonly tokenService: TokenService,
    private readonly auctionEventsHandler: AuctionEventsHandler,
    public readonly configService: BlockchainConfigService,
    public readonly assetService: AssetService,
    public readonly eventsService: EventsService,
    public readonly balancesService: BalancesService,
    public readonly ordersService: OrdersService,
    public readonly rawEventsService: RawEventsService,
    public readonly userService: UserService,
    public readonly auctionsService: AuctionsService,
    public readonly uniqueSetsService: UniqueSetsService,
  ) {
    this.blockchains = this.configService.allBlockchainConfig;
    void this.init();
  }

  private loggedEventData = (data: EventData) => ({
    event: data.event,
    data: data.returnValues,
    block: data.blockNumber,
    address: data.address,
  });

  create721TokenEventHandler = async (
    data: EventData,
    chain: string,
  ): Promise<void> => {
    this.logger.log(this.loggedEventData(data), 'event');
    const tokenId = +data.returnValues.tokenId;
    const contractAddress = data.address;

    const contract = this.contracts[chain].ERC721;
    const tokenURI = await contract.methods.tokenURI(tokenId).call();
    let tokenMetadata = {
      title: 'no metadata',
      image_url:
        'https://images-eu.ssl-images-amazon.com/images/I/31HiMZqbGBL._UL1000_.jpg',
      animation_url: undefined,
      description: 'no metadata',
      collection_id: undefined,
      type: AssetType.IMAGE,
      attributes: [],
    };
    try {
      tokenMetadata = JSON.parse(
        await this.tokenService.getTokenMetadata(tokenURI),
      );
    } catch (error) {
      this.logger.warn(error.message, `ipfs error. tokenURI: ${tokenURI}`);
    }
    const creator = await this.userService.getUserByAddress(
      data.returnValues.to,
    );
    const newAsset: CreateAssetDto = {
      tokenId,
      address: contractAddress,
      title: tokenMetadata.title,
      image_url: tokenMetadata.image_url,
      animation_url: tokenMetadata.animation_url,
      description: tokenMetadata.description,
      collection_id: tokenMetadata.collection_id,
      creator,
      chain_id: chain,
      role:
        tokenMetadata.attributes
          .find((obj) => obj.trait_type === 'media_type')
          ?.value?.toUpperCase() || AssetType.IMAGE,
      type: TokenType.ERC721,
      properties: JSON.stringify(tokenMetadata.attributes),
    };

    const createdAsset = await this.assetService.createAsset(newAsset);

    const balance: CreateBalanceDto = {
      asset_id: createdAsset.id,
      user: creator,
      quantity: 1,
    };
    await this.balancesService.createBalance(balance);
    const timestamp = Number(
      (await this.web3connections[chain].eth.getBlock(data.blockNumber))
        .timestamp,
    );
    const from_user = await this.userService.getUserByAddress(NULL_ADDRESS);

    const newEvent: CreateEventReqDto = {
      from_user,
      to_user: creator,
      asset_id: createdAsset.id,
      type: EventType.CREATE,
      timestamp,
    };
    await this.eventsService.createEvent(newEvent);
  };

  create1155TokenEventHandler = async (
    data: EventData,
    chain: string,
  ): Promise<void> => {
    this.logger.log(this.loggedEventData(data), 'event');
    const tokenId = +data.returnValues.tokenId;
    const quantity = +data.returnValues.quantity;
    const contractAddress = data.address;

    const contract = this.contracts[chain].ERC1155;
    const tokenURI = await this.tokenService.getERC1155TokenURI(
      tokenId,
      contract,
    );
    let tokenMetadata = {
      title: 'no metadata',
      image_url:
        'https://images-eu.ssl-images-amazon.com/images/I/31HiMZqbGBL._UL1000_.jpg',
      animation_url: undefined,
      description: 'no metadata',
      collection_id: undefined,
      type: AssetType.IMAGE,
      attributes: [],
    };
    try {
      tokenMetadata = JSON.parse(
        await this.tokenService.getTokenMetadata(tokenURI),
      );
    } catch (error) {
      this.logger.warn(error.message, `ipfs error. tokenURI: ${tokenURI}`);
    }

    const creator = await this.userService.getUserByAddress(
      data.returnValues.to,
    );
    const newAsset: CreateAssetDto = {
      tokenId,
      address: contractAddress,
      title: tokenMetadata.title,
      image_url: tokenMetadata.image_url,
      animation_url: tokenMetadata.animation_url,
      description: tokenMetadata.description,
      collection_id: tokenMetadata.collection_id,
      creator,
      chain_id: chain,
      role: tokenMetadata.type,
      type: TokenType.ERC1155,
      properties: JSON.stringify(tokenMetadata.attributes),
    };

    const createdAsset = await this.assetService.createAsset(newAsset);

    const balance: CreateBalanceDto = {
      asset_id: createdAsset.id,
      user: creator,
      quantity,
    };
    await this.balancesService.createBalance(balance);
    const timestamp = Number(
      (await this.web3connections[chain].eth.getBlock(data.blockNumber))
        .timestamp,
    );
    const from_user = await this.userService.getUserByAddress(NULL_ADDRESS);

    const newEvent: CreateEventReqDto = {
      from_user,
      to_user: creator,
      asset_id: createdAsset.id,
      type: EventType.CREATE,
      quantity,
      timestamp,
    };
    await this.eventsService.createEvent(newEvent);
  };

  tokenPriceListedHandler = async (
    data: EventData,
    chain: string,
  ): Promise<void> => {
    this.logger.log(this.loggedEventData(data), 'event');
    const tokenId = +data.returnValues._tokenId;
    const price = data.returnValues._price;
    const contractAddress = this.blockchains[chain].contractAddresses.ERC721;

    try {
      const creator = await this.userService.getUserByAddress(
        data.returnValues._owner,
      );
      const newOrder: CreateOrderReqDto = {
        token_id: tokenId,
        address: contractAddress,
        price,
        creator,
        type: OrderType.FIX_PRICE,
      };
      const order = await this.ordersService.createOrder(newOrder);
      await this.assetService.setCurrentPrice({
        tokenId,
        address: contractAddress,
        price,
      });

      const timestamp = Number(
        (await this.web3connections[chain].eth.getBlock(data.blockNumber))
          .timestamp,
      );

      const to_user = await this.userService.getUserByAddress(NULL_ADDRESS);
      const newEvent: CreateEventReqDto = {
        from_user: creator,
        to_user,
        asset_id: order.asset.id,
        type: EventType.OFFER,
        price,
        timestamp,
      };
      await this.eventsService.createEvent(newEvent);
    } catch (error) {
      this.logger.warn(error.message, 'error');
    }
  };

  token1155OfferListedHandler = async (
    data: EventData,
    chain: string,
  ): Promise<void> => {
    this.logger.log(this.loggedEventData(data), 'event');
    const tokenId = +data.returnValues._tokenId;
    const quantity = +data.returnValues._quantity;
    const price = data.returnValues._price;
    const contractAddress = this.blockchains[chain].contractAddresses.ERC1155;
    const creator = await this.userService.getUserByAddress(
      data.returnValues._owner,
    );
    const newOrder: CreateOrderReqDto = {
      token_id: tokenId,
      address: contractAddress,
      price,
      creator,
      type: OrderType.FIX_PRICE,
      quantity,
      offer_id: data.returnValues._offerId,
    };

    const order = await this.ordersService.createOrder(newOrder);
    await this.assetService.setCurrentPriceFor1155({
      tokenId,
      address: contractAddress,
      price,
    });
    const timestamp = Number(
      (await this.web3connections[chain].eth.getBlock(data.blockNumber))
        .timestamp,
    );

    const to_user = await this.userService.getUserByAddress(NULL_ADDRESS);
    const newEvent: CreateEventReqDto = {
      from_user: creator,
      to_user,
      asset_id: order.asset.id,
      type: EventType.OFFER,
      price,
      quantity,
      timestamp,
    };
    await this.eventsService.createEvent(newEvent);
  };

  tokenBoughtEventHandler = async (
    data: EventData,
    chain: string,
  ): Promise<void> => {
    this.logger.log(this.loggedEventData(data), 'event');
    const tokenId = +data.returnValues._tokenId;
    const contractAddress = this.blockchains[chain].contractAddresses.ERC721;
    const newOwner: User = await this.userService.getUserByAddress(
      data.returnValues._newOwner,
    );

    const asset = await this.assetService.findOne(contractAddress, tokenId);
    if (!asset) {
      throw new NotFoundException('not found asset');
    }
    const updatedBalance = await this.balancesService.changeOwner({
      tokenId,
      address: contractAddress,
      user: newOwner,
    });
    const [order] = await this.ordersService.getOrdersForAsset({
      token_id: tokenId,
      address: contractAddress,
      status: OrderStatus.ACTIVE,
    });
    await this.ordersService.acceptOffer({
      id: order.id,
      taker: newOwner,
    });
    await this.assetService.setCurrentPrice({
      tokenId,
      address: contractAddress,
      price: 0,
    });

    const timestamp = Number(
      (await this.web3connections[chain].eth.getBlock(data.blockNumber))
        .timestamp,
    );
    const from_user = await this.userService.getUserByAddress(
      data.returnValues._previousOwner,
    );
    const newEvent: CreateEventReqDto = {
      from_user,
      to_user: newOwner,
      asset_id: updatedBalance.asset.id,
      type: EventType.TRANSFER,
      price: order.price,
      timestamp,
    };
    await this.eventsService.createEvent(newEvent);
  };

  token1155BoughtEventHandler = async (
    data: EventData,
    chain: string,
  ): Promise<void> => {
    this.logger.log(this.loggedEventData(data), 'event');
    const tokenId = +data.returnValues._tokenId;
    const quantity = +data.returnValues._quantity;
    const contractAddress = this.blockchains[chain].contractAddresses.ERC1155;
    const previousOwner = await this.userService.getUserByAddress(
      data.returnValues._previousOwner,
    );
    const newOwner = await this.userService.getUserByAddress(
      data.returnValues._newOwner,
    );

    const asset = await this.assetService.findOne(contractAddress, tokenId);
    if (!asset) {
      throw new NotFoundException('not found asset');
    }
    await this.balancesService.reduceBalance({
      tokenId,
      address: contractAddress,
      user: previousOwner,
      quantity,
    });
    const balance = await this.balancesService.increaseBalance({
      tokenId,
      address: contractAddress,
      user: newOwner,
      quantity,
    });

    const [order] = await this.ordersService.getOrdersForAsset({
      token_id: tokenId,
      address: contractAddress,
      status: OrderStatus.ACTIVE,
      offer_id: data.returnValues._offerId,
    });

    await this.ordersService.acceptOffer({
      id: order.id,
      taker: newOwner,
    });

    await this.assetService.setCurrentPriceFor1155({
      tokenId,
      address: contractAddress,
      price: 0,
    });

    const timestamp = Number(
      (await this.web3connections[chain].eth.getBlock(data.blockNumber))
        .timestamp,
    );
    const newEvent: CreateEventReqDto = {
      from_user: previousOwner,
      to_user: newOwner,
      asset_id: balance.asset.id,
      type: EventType.TRANSFER,
      quantity,
      price: order.price,
      timestamp,
    };
    await this.eventsService.createEvent(newEvent);
  };

  tokenPriceUnlistedEventHandler = async (
    data: EventData,
    chain: string,
  ): Promise<void> => {
    this.logger.log(this.loggedEventData(data), 'event');
    const tokenId = +data.returnValues._tokenId;
    const contractAddress = this.blockchains[chain].contractAddresses.ERC721;

    const [order] = await this.ordersService.getOrdersForAsset({
      token_id: tokenId,
      address: contractAddress,
      status: OrderStatus.ACTIVE,
    });
    if (!order) {
      this.logger.log('no active order', 'unhandled TokenPriceUnlisted event');
      return;
    }
    await this.ordersService.cancelOffer(order.id);
    await this.assetService.setCurrentPrice({
      tokenId,
      address: contractAddress,
      price: 0,
    });
    const timestamp = Number(
      (await this.web3connections[chain].eth.getBlock(data.blockNumber))
        .timestamp,
    );
    const to_user = await this.userService.getUserByAddress(NULL_ADDRESS);
    const newEvent: CreateEventReqDto = {
      from_user: order.creator,
      to_user,
      asset_id: order.asset.id,
      type: EventType.UNLIST,
      price: order.price,
      timestamp,
    };
    await this.eventsService.createEvent(newEvent);
  };

  token1155PriceUnlistedEventHandler = async (
    data: EventData,
    chain: string,
  ): Promise<void> => {
    this.logger.log(this.loggedEventData(data), 'event');
    const tokenId = +data.returnValues._tokenId;
    const offerId = data.returnValues._offerId;
    const contractAddress = this.blockchains[chain].contractAddresses.ERC1155;

    const [order] = await this.ordersService.getOrdersForAsset({
      token_id: tokenId,
      address: contractAddress,
      status: OrderStatus.ACTIVE,
      offer_id: offerId,
    });
    if (!order) {
      this.logger.log(
        'no active order',
        'unhandled Token1155PriceUnlisted event',
      );
      return;
    }
    await this.ordersService.cancelOffer(order.id);
    await this.assetService.setCurrentPriceFor1155({
      tokenId,
      address: contractAddress,
      price: 0,
    });
    const timestamp = Number(
      (await this.web3connections[chain].eth.getBlock(data.blockNumber))
        .timestamp,
    );
    const to_user = await this.userService.getUserByAddress(NULL_ADDRESS);
    const newEvent: CreateEventReqDto = {
      from_user: order.creator,
      to_user,
      asset_id: order.asset.id,
      type: EventType.UNLIST,
      price: order.price,
      timestamp,
    };
    await this.eventsService.createEvent(newEvent);
  };

  dropMintingFinishedEventHandler = async (
    data: EventData,
    chain: string,
  ): Promise<void> => {
    this.logger.log(this.loggedEventData(data), 'event');
    const tokenId = +data.returnValues._tokenId;
    const contract = this.contracts[chain].ERC721;
    const contractAddress = contract.options.address;
    const dropContract = this.contracts[chain].DropMinting;
    const showTime = await dropContract.methods.dropEnd().call();

    let asset = await this.assetService.findOne(contractAddress, tokenId);

    while (!asset) {
      wait(1000);
      asset = await this.assetService.findOne(contractAddress, tokenId);
    }

    await this.assetService.setShowTime(contractAddress, tokenId, showTime);
    await this.uniqueSetsService.markItemUsed(
      data.returnValues._itemId,
      asset.id,
    );
    const isEndOfMinting = await this.uniqueSetsService.checkIsEndOfMinting();
    if (isEndOfMinting) {
      await this.assetService.revealAll();
    }
  };

  private eventHandlers = {
    Create721Token: this.create721TokenEventHandler.bind(this),
    Create1155Token: this.create1155TokenEventHandler.bind(this),
    TokenPriceListed: this.tokenPriceListedHandler.bind(this),
    Token1155OfferListed: this.token1155OfferListedHandler.bind(this),
    TokenBought: this.tokenBoughtEventHandler.bind(this),
    Token1155Bought: this.token1155BoughtEventHandler.bind(this),
    AuctionCreated: this.auctionEventsHandler.auctionCreatedEventHandler,
    AuctionCancelled: this.auctionEventsHandler.auctionCancelledEventHandler,
    BidPlaced: this.auctionEventsHandler.bidPlacedEventHandler,
    FundsClaimed: this.auctionEventsHandler.fundsClaimedEventHandler,
    ItemClaimed: this.auctionEventsHandler.itemClaimedEventHandler,
    TokenPriceUnlisted: this.tokenPriceUnlistedEventHandler.bind(this),
    Token1155PriceUnlisted: this.token1155PriceUnlistedEventHandler.bind(this),
    DropMintingFinished: this.dropMintingFinishedEventHandler.bind(this),
  };

  rawEventHandler = async (
    id: string,
    chain: string,
    web3: Web3,
    contract: Contract,
  ): Promise<void> => {
    const event = await this.rawEventsService.getRawEvent(id);
    const data = JSON.parse(event.data);
    if (data.event in this.eventHandlers) {
      await this.eventHandlers[data.event](data, chain, web3, contract);
    } else {
      this.logger.log(
        `unhandled event ${data.event}`,
        `contract ${data.address}`,
      );
    }
    this.rawEventsService.checkRawEvent(event);
  };

  dataHandler = async (
    data: EventData,
    chain: string,
    web3: Web3,
    contract: Contract,
  ): Promise<void> => {
    const rawEvent: CreateRawEventDto = {
      block: +data.blockNumber,
      log_index: +data.logIndex,
      transaction_hash: data.transactionHash,
      data: JSON.stringify(data),
      chain,
    };
    const newRawEvent = await this.rawEventsService.createRawEvent(rawEvent);
    await this.rawEventHandler(newRawEvent.id, chain, web3, contract);
  };

  initContracts = (): void => {
    for (const chain of Object.values(this.blockchains)) {
      const web3 = new Web3(
        new Web3.providers.WebsocketProvider(chain.provider, {
          clientConfig: {
            keepalive: true,
            keepaliveInterval: 60_000,
          },
          reconnect: {
            auto: true,
            delay: 5000,
            maxAttempts: 5,
            onTimeout: false,
          },
        }),
      );
      this.web3connections[chain.name] = web3;

      const chainContracts = chain.contractAddresses;

      this.contracts[chain.name] = {};
      for (const contractName of Object.keys(chainContracts)) {
        this.contracts[chain.name][contractName] = new web3.eth.Contract(
          abis[contractName],
          chainContracts[contractName],
        );
      }
    }
  };

  private async init(): Promise<void> {
    this.initContracts();

    for (const chain of Object.values(this.blockchains)) {
      await this.initDB(chain);

      const chainContracts = this.contracts[chain.name];
      const startBlock = await this.rawEventsService.getStartBlock(chain.name);
      this.logger.log(startBlock, `startBlock ${chain.name}`);

      for (const [contractName, contract] of Object.entries(chainContracts)) {
        contract.events
          .allEvents(
            {
              fromBlock: startBlock,
            },
            (error) => {
              if (error) {
                this.logger.log(error, chain.name);
              }
            },
          )
          .on('connected', (subscriptionId) => {
            this.logger.log(
              `connected: ${contractName} ${subscriptionId}`,
              chain.name,
            );
          })
          .on('data', async (data: EventData) => {
            if (data.blockNumber < startBlock) {
              return;
            }
            const isEventExist = await this.rawEventsService.checkIfEventExist(
              chain.name,
              +data.blockNumber,
              +data.logIndex,
              data.transactionHash,
            );
            if (!isEventExist) {
              await this.dataHandler(
                data,
                chain.name,
                this.web3connections[chain.name],
                contract,
              );
            }
          });
      }
    }
  }

  createPastEvents = async (
    chain: string,
    contract: Contract,
    startBlock: number,
  ): Promise<number> => {
    const RANGE = 2000;
    const currentBlock = await this.web3connections[chain].eth.getBlockNumber();
    const { address } = contract.options;

    const contractName = this.configService.getContractNameByAddress(
      chain,
      address,
    );

    for (let block = startBlock; block <= currentBlock; block += RANGE) {
      const endBlock = block + RANGE;
      const events = await contract.getPastEvents('allEvents', {
        fromBlock: block,
        toBlock: endBlock > currentBlock ? currentBlock : endBlock,
      });
      this.logger.log(
        events.length,
        `${chain} ${contractName} events from block ${block}`,
      );
      for (const event of events) {
        const rawEvent: CreateRawEventDto = {
          block: +event.blockNumber,
          log_index: +event.logIndex,
          transaction_hash: event.transactionHash,
          data: JSON.stringify(event),
          chain,
        };
        const isEventExist = await this.rawEventsService.checkIfEventExist(
          chain,
          +event.blockNumber,
          +event.logIndex,
          event.transactionHash,
        );
        if (!isEventExist) {
          await this.rawEventsService.createRawEvent(rawEvent);
        }
      }
    }
    return currentBlock;
  };

  private async initDB(chain: IChainConfig): Promise<void> {
    const chainContracts = this.contracts[chain.name];
    this.logger.log(
      Object.keys(chainContracts),
      `chainContracts ${chain.name}`,
    );

    const startBlock = await this.rawEventsService.getStartBlock(chain.name);
    this.logger.log(startBlock, `startBlock ${chain.name}`);

    let lastBlock = startBlock;
    for (const contract of Object.values(chainContracts)) {
      lastBlock = await this.createPastEvents(chain.name, contract, startBlock);
    }
    const rawEvent: CreateRawEventDto = {
      block: lastBlock,
      log_index: 9999,
      transaction_hash: undefined,
      data: JSON.stringify({ event: 'lastHandledBlock' }),
      chain: chain.name,
      handled: true,
    };
    await this.rawEventsService.createRawEvent(rawEvent);

    const rawEvents = await this.rawEventsService.getRawEvents(chain.name);
    this.logger.log(rawEvents.length, `${chain.name} events`);
    for (const event of rawEvents) {
      const { address } = JSON.parse(event.data);

      if (address) {
        const contractName = this.configService.getContractNameByAddress(
          chain.name,
          address,
        );

        await this.rawEventHandler(
          event.id,
          chain.name,
          this.web3connections[chain.name],
          this.contracts[chain.name][contractName],
        );
      }
    }
  }
}
