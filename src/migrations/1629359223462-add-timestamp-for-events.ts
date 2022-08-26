import {MigrationInterface, QueryRunner} from "typeorm";

export class addTimestampForEvents1629359223462 implements MigrationInterface {
    name = 'addTimestampForEvents1629359223462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."events" ADD "timestamp" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."events" DROP COLUMN "timestamp"`);
    }

}
