import {MigrationInterface, QueryRunner} from "typeorm";

export class addNonceForUser1629874278699 implements MigrationInterface {
    name = 'addNonceForUser1629874278699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "nonce" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "nonce"`);
    }

}
