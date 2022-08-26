import {MigrationInterface, QueryRunner} from "typeorm";

export class addBlockchainsTable1628240583885 implements MigrationInterface {
    name = 'addBlockchainsTable1628240583885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blockchains" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "start_block" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_388138041975d49f3d0446cf634" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "blockchains"`);
    }

}
