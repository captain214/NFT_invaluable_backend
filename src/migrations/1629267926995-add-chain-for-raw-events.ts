import {MigrationInterface, QueryRunner} from "typeorm";

export class addChainForRawEvents1629267926995 implements MigrationInterface {
    name = 'addChainForRawEvents1629267926995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."raw_events" ADD "chain" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."raw_events" DROP COLUMN "chain"`);
    }

}
