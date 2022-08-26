import {MigrationInterface, QueryRunner} from "typeorm";

export class changeTimestampType1630664661240 implements MigrationInterface {
    name = 'changeTimestampType1630664661240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."events" ALTER COLUMN "timestamp" TYPE bigint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."events" ALTER COLUMN "timestamp" TYPE integer`);
    }

}
