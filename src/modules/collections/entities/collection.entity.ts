import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Asset } from '../../asset/entities/asset.entity';
import { Category } from './category.entity';

@Entity({ name: 'collections' })
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  banner_url: string;

  @ManyToOne(() => Category, (category) => category.id)
  category: Category;

  @OneToMany(() => Asset, (asset) => asset.collection)
  assets: Asset[];

  @CreateDateColumn()
  created_at: Date;
}
