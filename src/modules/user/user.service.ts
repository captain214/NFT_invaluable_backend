import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ipfsClient from 'ipfs-http-client';
import type { FindConditions } from 'typeorm';
import { Repository } from 'typeorm';

import { FileNotImageException } from '../../exceptions/file-not-image.exception';
import type { IFile } from '../../interfaces';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { BlockchainConfigService } from '../../shared/services/blockchain-config.service';
import { GeneratorService } from '../../shared/services/generator.service';
import { ValidatorService } from '../../shared/services/validator.service';
import type { UserRegisterDto } from '../auth/dto/UserRegisterDto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private ipfs;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    public readonly validatorService: ValidatorService,
    public readonly awsS3Service: AwsS3Service,
    public readonly configService: BlockchainConfigService,
    public generatorService: GeneratorService,
  ) {
    const ipfsConfig = this.configService.ipfsConfig;

    this.ipfs = ipfsClient.create({
      host: ipfsConfig.host as string,
      port: ipfsConfig.port as number,
      protocol: 'https',
    });
  }

  /**
   * Find single user
   */
  findOne(findData: FindConditions<User>): Promise<User> {
    return this.userRepository.findOne(findData, {
      relations: ['balances', 'balances.asset'],
    });
  }
  async findByUsernameOrEmail(
    options: Partial<{ username: string; email: string }>,
  ): Promise<User | undefined> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (options.email) {
      queryBuilder.orWhere('user.email = :email', {
        email: options.email,
      });
    }
    if (options.username) {
      queryBuilder.orWhere('user.username = :username', {
        username: options.username,
      });
    }

    return queryBuilder.getOne();
  }

  async createUser(
    userRegisterDto: UserRegisterDto,
    file?: IFile,
  ): Promise<User> {
    const user = this.userRepository.create(userRegisterDto);

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      user.avatar = await this.awsS3Service.uploadImage(file);
    }

    return this.userRepository.save(user);
  }

  async getUser(userId: string): Promise<User> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.balances', 'balances')
      .innerJoinAndSelect('balances.asset', 'asset');
    queryBuilder.where('user.id = :userId', { userId });

    return queryBuilder.getOne();
  }

  async getUserByAddress(address: string): Promise<User> {
    const user = await this.findOne({ address });
    return user ? user : this.createUser({ address });
  }

  async saveNonce(address: string, nonce: string): Promise<User> {
    const user = await this.getUserByAddress(address);
    user.nonce = nonce;
    return this.userRepository.save(user);
  }

  async getNonce(address: string): Promise<string> {
    const user = await this.userRepository.findOne({ address });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user.nonce;
  }

  async setBanner(address: string, file: IFile): Promise<User> {
    const user = await this.getUserByAddress(address);

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      const { path } = await this.ipfs.add(file.buffer);
      user.banner = `https://ipfs.io/ipfs/${path}`;
    }

    return this.userRepository.save(user);
  }

  async setAvatar(address: string, file: IFile): Promise<User> {
    const user = await this.getUserByAddress(address);

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      const { path } = await this.ipfs.add(file.buffer);
      user.avatar = `https://ipfs.io/ipfs/${path}`;
    }

    return this.userRepository.save(user);
  }

  async setName(address: string, name: string): Promise<User> {
    const user = await this.getUserByAddress(address);
    user.name = name;
    return this.userRepository.save(user);
  }

  async setFavorites(address: string, favorites: string[]): Promise<User> {
    const user = await this.getUserByAddress(address);
    user.favorites = [...favorites];
    return this.userRepository.save(user);
  }
}
