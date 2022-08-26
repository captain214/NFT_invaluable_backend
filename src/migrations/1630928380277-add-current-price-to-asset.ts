import {MigrationInterface, QueryRunner} from "typeorm";

export class addCurrentPriceToAsset1630928380277 implements MigrationInterface {
    name = 'addCurrentPriceToAsset1630928380277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."assets" ADD "current_price" character varying NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."assets" DROP COLUMN "current_price"`);
    }

}
