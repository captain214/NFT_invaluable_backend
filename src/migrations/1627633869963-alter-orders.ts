import {MigrationInterface, QueryRunner} from "typeorm";

export class alterOrders1627633869963 implements MigrationInterface {
    name = 'alterOrders1627633869963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "token_id" TO "asset_id"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "asset_id"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "asset_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "asset_id"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "asset_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "asset_id" TO "token_id"`);
    }

}
