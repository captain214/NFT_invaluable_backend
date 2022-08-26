import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface IContractAddresses {
  ERC721: string;
  ERC1155?: string;
  EXCHANGE?: string;
  AuctionFactory?: string;
  DropMinting?: string;
}

export interface IChainConfig {
  name: string;
  provider: string;
  startBlock?: number;
  contractAddresses: IContractAddresses;
}

@Injectable()
export class BlockchainConfigService {
  constructor(private configService: ConfigService) {}

  private getNumber(key: string, defaultValue?: number): number {
    const value = this.configService.get(key, defaultValue);
    if (value === undefined) {
      throw new Error(key + ' env var not set');
    }
    try {
      return Number(value);
    } catch {
      throw new Error(key + ' env var is not a number');
    }
  }

  private getString(key: string, defaultValue?: string): string {
    const value = this.configService.get(key, defaultValue);

    if (!value) {
      console.warn(`"${key}" environment variable is not set`);
      return;
    }
    return value.toString().replace(/\\n/g, '\n');
  }

  get ipfsConfig(): Record<string, string | number> {
    return {
      host: this.getString('IPFS_HOST'),
      port: this.getNumber('IPFS_PORT'),
    };
  }

  get ethereumBlockchainConfig(): IChainConfig {
    return {
      name: this.getString('ETHEREUM_CHAIN_NAME'),
      provider: this.getString('ETHEREUM_PROVIDER'),
      contractAddresses: {
        ERC721: this.getString('ETHEREUM_ERC721_CONTRACT_ADDRESS'),
        ERC1155: this.getString('ETHEREUM_ERC1155_CONTRACT_ADDRESS'),
        EXCHANGE: this.getString('ETHEREUM_EXCHANGE_CONTRACT_ADDRESS'),
        // DropMinting: this.getString('ETHEREUM_DROPMINTING_CONTRACT_ADDRESS'),
        AuctionFactory: this.getString('ETHEREUM_AUCTION_CONTRACT_ADDRESS'),
      },
      startBlock: this.getNumber('ETHEREUM_CHAIN_STARTBLOCK', 900_000),
    };
  }

  get maticBlockchainConfig(): IChainConfig {
    return {
      name: this.getString('MATIC_CHAIN_NAME'),
      provider: this.getString('MATIC_PROVIDER'),
      contractAddresses: {
        ERC721: this.getString('MATIC_ERC721_CONTRACT_ADDRESS'),
        ERC1155: this.getString('MATIC_ERC1155_CONTRACT_ADDRESS'),
        EXCHANGE: this.getString('MATIC_EXCHANGE_CONTRACT_ADDRESS'),
        DropMinting: this.getString('MATIC_DROPMINTING_CONTRACT_ADDRESS'),
        AuctionFactory: this.getString('MATIC_AUCTION_CONTRACT_ADDRESS'),
      },
      startBlock: this.getNumber('MATIC_CHAIN_STARTBLOCK', 18_700_000),
    };
  }

  get allBlockchainConfig(): Record<string, IChainConfig> {
    const isEthereumDisabled =
      this.getString('ETHEREUM_CHAIN_DISABLED') === 'true';
    const isMaticDisabled = this.getString('MATIC_CHAIN_DISABLED') === 'true';
    const ethereumConfig = this.ethereumBlockchainConfig;
    const maticConfig = this.maticBlockchainConfig;
    return {
      ...(!isEthereumDisabled ? { [ethereumConfig.name]: ethereumConfig } : {}),
      ...(!isMaticDisabled ? { [maticConfig.name]: maticConfig } : {}),
    };
  }

  getContractNameByAddress(chain: string, address: string): string {
    const contractAddresses = this.allBlockchainConfig[chain].contractAddresses;
    return Object.keys(contractAddresses).find(
      (key) =>
        contractAddresses[key].toLowerCase() === address.toLocaleLowerCase(),
    );
  }

  get dropShowTime(): string {
    return this.getString('DROP_MINTING_SHOW_TIME');
  }
}
