import {MigrationInterface, QueryRunner} from "typeorm";

export class convertAuctionEventPriceType1630567144858 implements MigrationInterface {
    name = 'convertAuctionEventPriceType1630567144858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."auction_events" ALTER COLUMN "price" TYPE numeric USING ("price"::numeric)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."auction_events" ALTER COLUMN "price" TYPE varchar`);
    }

}
