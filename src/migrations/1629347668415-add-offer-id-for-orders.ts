import {MigrationInterface, QueryRunner} from "typeorm";

export class addOfferIdForOrders1629347668415 implements MigrationInterface {
    name = 'addOfferIdForOrders1629347668415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."orders" ADD "offer_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."orders" DROP COLUMN "offer_id"`);
    }

}
