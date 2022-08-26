import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'blockchains' })
export class Blockchain {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ default: 0 })
  start_block: number;
}
