import {MigrationInterface, QueryRunner} from "typeorm";

export class renameColumnInUniqueset1631591015235 implements MigrationInterface {
    name = 'renameColumnInUniqueset1631591015235'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."unique_set" RENAME COLUMN "properties" TO "token_uri"`);
        await queryRunner.query(`ALTER TABLE "public"."assets" ALTER COLUMN "show_time" SET DEFAULT 'NOW()'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."assets" ALTER COLUMN "show_time" SET DEFAULT '2021-09-14 10:43:25.75722'`);
        await queryRunner.query(`ALTER TABLE "public"."unique_set" RENAME COLUMN "token_uri" TO "properties"`);
    }

}
