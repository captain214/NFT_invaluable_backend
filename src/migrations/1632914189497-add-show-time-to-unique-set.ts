import {MigrationInterface, QueryRunner} from "typeorm";

export class addShowTimeToUniqueSet1632914189497 implements MigrationInterface {
    name = 'addShowTimeToUniqueSet1632914189497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."unique_set" ADD "show_time" TIMESTAMP `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."unique_set" DROP COLUMN "show_time"`);
    }

}
