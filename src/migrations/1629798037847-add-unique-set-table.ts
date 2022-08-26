import {MigrationInterface, QueryRunner} from "typeorm";

export class addUniqueSetTable1629798037847 implements MigrationInterface {
    name = 'addUniqueSetTable1629798037847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "unique_set_status_enum" AS ENUM('FREE', 'USED', 'RESERVED')`);
        await queryRunner.query(`CREATE TABLE "unique_set" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action_name" character varying NOT NULL, "status" "unique_set_status_enum" NOT NULL DEFAULT 'FREE', "properties" text NOT NULL, "creator" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4dbc7d70e465be684a84cf726dd" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "unique_set"`);
        await queryRunner.query(`DROP TYPE "unique_set_status_enum"`);
    }

}
