import {MigrationInterface, QueryRunner} from "typeorm";

export class addTakerForOrders1629169757988 implements MigrationInterface {
    name = 'addTakerForOrders1629169757988'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."orders" ADD "taker" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."orders" DROP COLUMN "taker"`);
    }

}
