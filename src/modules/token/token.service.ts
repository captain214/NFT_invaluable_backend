import { Injectable } from '@nestjs/common';
import ipfsClient from 'ipfs-http-client';
import { concat, toString } from 'uint8arrays';
import type { Contract } from 'web3-eth-contract';

import { BlockchainConfigService } from '../../shared/services/blockchain-config.service';
import type { CreateTokenMetadataReqDto } from './dto/create-token-metadata.req.dto';

interface IAddResult {
  path: string;
}

@Injectable()
export class TokenService {
  private ipfs;

  constructor(public readonly configService: BlockchainConfigService) {
    const ipfsConfig = this.configService.ipfsConfig;
    this.ipfs = ipfsClient.create({
      host: ipfsConfig.host as string,
      port: ipfsConfig.port as number,
      protocol: 'https',
    });
  }

  createTokenMetadata(
    createTokenMetadataReqDto: CreateTokenMetadataReqDto,
  ): Promise<IAddResult> {
    const content = JSON.stringify(createTokenMetadataReqDto);
    return this.ipfs.add(content);
  }

  async getTokenMetadata(path: string): Promise<string> {
    let data = new Uint8Array();
    for await (const chunk of this.ipfs.cat(path)) {
      data = concat([data, chunk]);
    }
    return toString(data);
  }

  getTokenURI(tokenId: number, contract: Contract): Promise<string> {
    return contract.methods.tokenURI(tokenId).call();
  }

  getERC1155TokenURI(tokenId: number, contract: Contract): Promise<string> {
    return contract.methods.uri(tokenId).call();
  }
}
