import {MigrationInterface, QueryRunner} from "typeorm";

export class addAssetIdInUniqueSet1633519197540 implements MigrationInterface {
    name = 'addAssetIdInUniqueSet1633519197540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."unique_set" ADD "asset_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."unique_set" DROP COLUMN "asset_id"`);
    }

}
