import {MigrationInterface, QueryRunner} from "typeorm";

export class addShowtimeForAsset1631508377155 implements MigrationInterface {
    name = 'addShowtimeForAsset1631508377155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."assets" ADD "show_time" TIMESTAMP NOT NULL DEFAULT 'NOW()'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."assets" DROP COLUMN "show_time"`);
    }

}
