import {MigrationInterface, QueryRunner} from "typeorm";

export class addUpdatedAtIntoOrders1627625606628 implements MigrationInterface {
    name = 'addUpdatedAtIntoOrders1627625606628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "updated_at"`);
    }

}
