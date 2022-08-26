import {MigrationInterface, QueryRunner} from "typeorm";

export class addFieldsToOrder1628053246188 implements MigrationInterface {
    name = 'addFieldsToOrder1628053246188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "orders_side_enum" AS ENUM('SELL', 'BUY')`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "side" "orders_side_enum" NOT NULL DEFAULT 'SELL'`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "price" character varying NOT NULL DEFAULT '0'`)
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "asset_id"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "asset_id" uuid`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_055606f75e7ed988a209b0cc22c" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "side"`);
        await queryRunner.query(`DROP TYPE "orders_side_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_055606f75e7ed988a209b0cc22c"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "asset_id"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "asset_id" character varying NOT NULL default ''`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "price" integer NOT NULL DEFAULT '0'`);
    }

}
