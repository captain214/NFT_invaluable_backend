import {MigrationInterface, QueryRunner} from "typeorm";

export class alterBlockchains1628242202404 implements MigrationInterface {
    name = 'alterBlockchains1628242202404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."blockchains" ADD "address" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."blockchains" DROP COLUMN "address"`);
    }

}
