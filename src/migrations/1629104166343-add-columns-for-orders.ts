import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnsForOrders1629104166343 implements MigrationInterface {
    name = 'addColumnsForOrders1629104166343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."orders" ADD "quantity" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."orders" DROP COLUMN "quantity"`);
    }

}
