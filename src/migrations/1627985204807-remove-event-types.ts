import {MigrationInterface, QueryRunner} from "typeorm";

export class removeEventTypes1627985204807 implements MigrationInterface {
    name = 'removeEventTypes1627985204807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_bcb2ce0072504d624725e3ef826"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "type_id"`);
        await queryRunner.query(`CREATE TYPE "events_type_enum" AS ENUM('CREATE', 'TRANSFER', 'OFFER', 'BID', 'SALE')`);
        await queryRunner.query(`ALTER TABLE "events" ADD "type" "events_type_enum" NOT NULL default 'CREATE'`);
        await queryRunner.query(`DROP TABLE "event_types"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_ffe6b2d60596409fb08fb13830d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "events_type_enum"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "type_id" uuid`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_bcb2ce0072504d624725e3ef826" FOREIGN KEY ("type_id") REFERENCES "event_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
