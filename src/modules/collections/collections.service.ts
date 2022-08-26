import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { CreateCollectionReqDto } from './dto/create-collection.req.dto';
import { Category } from './entities/category.entity';
import { Collection } from './entities/collection.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createCollection(
    createCollectionReqDto: CreateCollectionReqDto,
  ): Promise<Collection> {
    const collection = new Collection();
    collection.name = createCollectionReqDto.name;
    collection.slug = createCollectionReqDto.slug;
    collection.description = createCollectionReqDto.description;
    collection.image_url = createCollectionReqDto.image_url;
    collection.banner_url = createCollectionReqDto.banner_url;
    collection.category = await this.categoryRepository.findOne({
      id: createCollectionReqDto.category_id,
    });

    return this.collectionRepository.save(collection);
  }

  getCollection(slug: string): Promise<Collection> {
    return this.collectionRepository.findOne({
      where: { slug },
      relations: ['category', 'assets'],
    });
  }

  getAllCollections(): Promise<[Collection[], number]> {
    return this.collectionRepository.findAndCount({
      relations: ['category'],
    });
  }
}
