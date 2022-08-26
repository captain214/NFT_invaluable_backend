import {MigrationInterface, QueryRunner} from "typeorm";

export class addAboutForUsers1629969963629 implements MigrationInterface {
    name = 'addAboutForUsers1629969963629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "about" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "banner" character varying`);
    }

}
