import {MigrationInterface, QueryRunner} from "typeorm";

export class changePriceTypeToNumeric1631002948813 implements MigrationInterface {
    name = 'changePriceTypeToNumeric1631002948813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."auctions" ALTER COLUMN "bid_step" TYPE numeric USING ("bid_step"::numeric)`);
        await queryRunner.query(`ALTER TABLE "public"."auctions" ALTER COLUMN "starting_bid" TYPE numeric USING ("starting_bid"::numeric)`);
        await queryRunner.query(`ALTER TABLE "public"."events" ALTER COLUMN "price" TYPE numeric USING ("price"::numeric)`);
        await queryRunner.query(`ALTER TABLE "public"."orders" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ADD "price" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "public"."assets" DROP COLUMN "current_price"`);
        await queryRunner.query(`ALTER TABLE "public"."assets" ADD "current_price" numeric NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."auctions" ALTER COLUMN "bid_step" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "public"."auctions" ALTER COLUMN "starting_bid" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "public"."events" ALTER COLUMN "price" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ALTER COLUMN "price" TYPE varchar`);
        await queryRunner.query(`ALTER TABLE "public"."assets" ALTER COLUMN "current_price" TYPE varchar`);
    }
}
