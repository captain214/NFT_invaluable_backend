import {MigrationInterface, QueryRunner} from "typeorm";

export class addQuantityForEvents1629185291390 implements MigrationInterface {
    name = 'addQuantityForEvents1629185291390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."events" ADD "quantity" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."events" DROP COLUMN "quantity"`);
    }

}
