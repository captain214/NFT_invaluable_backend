import { ConsoleLogger, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as ethUtil from 'ethereumjs-util';
import { v1 as uuid } from 'uuid';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new ConsoleLogger();
  constructor(
    public readonly jwtService: JwtService,
    public readonly configService: ApiConfigService,
    public readonly userService: UserService,
  ) {}

  async authUser(address: string): Promise<string> {
    const msg = uuid();
    await this.userService.saveNonce(address, msg);

    const msgHash = ethUtil.hashPersonalMessage(Buffer.from(msg, 'utf8'));
    const nonce = ethUtil.bufferToHex(msgHash);

    this.logger.log(nonce, `nonce for ${address}`);
    return nonce;
  }

  async checkUser(signature: string, address: string): Promise<boolean> {
    const msg = await this.userService.getNonce(address);
    try {
      const msgHash = ethUtil.hashPersonalMessage(Buffer.from(msg, 'utf8'));
      const signatureParams = ethUtil.fromRpcSig(signature);
      const publicKey = ethUtil.ecrecover(
        msgHash,
        signatureParams.v,
        signatureParams.r,
        signatureParams.s,
      );
      const addressBuffer = ethUtil.publicToAddress(publicKey);
      const recoverAddress = ethUtil.bufferToHex(addressBuffer);

      return address.toLowerCase() === recoverAddress.toLowerCase();
    } catch (error) {
      console.error(error.message);
    }
  }
}
