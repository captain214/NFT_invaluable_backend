import {MigrationInterface, QueryRunner} from "typeorm";

export class changeAssetTable1628584544018 implements MigrationInterface {
    name = 'changeAssetTable1628584544018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."assets" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."assets" DROP CONSTRAINT "UQ_a73439e88ba3b6249371acd2c83"`);
        await queryRunner.query(`ALTER TABLE "public"."assets" DROP CONSTRAINT "UQ_0f8764aeb8dd2d2a9a1374aa854"`);
        await queryRunner.query(`ALTER TABLE "public"."assets" ALTER COLUMN "image_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."assets" ALTER COLUMN "favorites_count" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."assets" ALTER COLUMN "favorites_count" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."assets" ALTER COLUMN "image_url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."assets" ADD CONSTRAINT "UQ_0f8764aeb8dd2d2a9a1374aa854" UNIQUE ("address")`);
        await queryRunner.query(`ALTER TABLE "public"."assets" ADD CONSTRAINT "UQ_a73439e88ba3b6249371acd2c83" UNIQUE ("token_id")`);
        await queryRunner.query(`ALTER TABLE "public"."assets" DROP COLUMN "updated_at"`);
    }

}
