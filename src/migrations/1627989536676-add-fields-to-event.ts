import {MigrationInterface, QueryRunner} from "typeorm";

export class addFieldsToEvent1627989536676 implements MigrationInterface {
    name = 'addFieldsToEvent1627989536676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "price" character varying`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "creator"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "from_account" character varying`);
        await queryRunner.query(`ALTER TABLE "events" ADD "to_account" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "type" SET DEFAULT 'create'`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "to_account"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "from_account"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "creator" character varying NOT NULL default 'default'`);
    }

}
