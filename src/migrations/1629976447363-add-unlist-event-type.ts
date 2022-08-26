import {MigrationInterface, QueryRunner} from "typeorm";

export class addUnlistEventType1629976447363 implements MigrationInterface {
    name = 'addUnlistEventType1629976447363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."events_type_enum" RENAME TO "events_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."events_type_enum" AS ENUM('CREATE', 'TRANSFER', 'OFFER', 'BID', 'SALE', 'UNLIST')`);
        await queryRunner.query(`ALTER TABLE "public"."events" ALTER COLUMN "type" TYPE "public"."events_type_enum" USING "type"::"text"::"public"."events_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."events_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."events_type_enum_old" AS ENUM('CREATE', 'TRANSFER', 'OFFER', 'BID', 'SALE')`);
        await queryRunner.query(`ALTER TABLE "public"."events" ALTER COLUMN "type" TYPE "public"."events_type_enum_old" USING "type"::"text"::"public"."events_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."events_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."events_type_enum_old" RENAME TO "events_type_enum"`);
    }

}
