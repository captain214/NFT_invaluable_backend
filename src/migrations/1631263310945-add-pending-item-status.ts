import {MigrationInterface, QueryRunner} from "typeorm";

export class addPendingItemStatus1631263310945 implements MigrationInterface {
    name = 'addPendingItemStatus1631263310945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."unique_set_status_enum" RENAME TO "unique_set_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."unique_set_status_enum" AS ENUM('FREE', 'USED', 'RESERVED', 'PENDING')`);
        await queryRunner.query(`ALTER TABLE "public"."unique_set" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."unique_set" ALTER COLUMN "status" TYPE "public"."unique_set_status_enum" USING "status"::"text"::"public"."unique_set_status_enum"`);
        await queryRunner.query(`ALTER TABLE "public"."unique_set" ALTER COLUMN "status" SET DEFAULT 'FREE'`);
        await queryRunner.query(`DROP TYPE "public"."unique_set_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."unique_set_status_enum_old" AS ENUM('FREE', 'USED', 'RESERVED')`);
        await queryRunner.query(`ALTER TABLE "public"."unique_set" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."unique_set" ALTER COLUMN "status" TYPE "public"."unique_set_status_enum_old" USING "status"::"text"::"public"."unique_set_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "public"."unique_set" ALTER COLUMN "status" SET DEFAULT 'FREE'`);
        await queryRunner.query(`DROP TYPE "public"."unique_set_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."unique_set_status_enum_old" RENAME TO "unique_set_status_enum"`);
    }

}
