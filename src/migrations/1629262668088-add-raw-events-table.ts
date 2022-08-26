import {MigrationInterface, QueryRunner} from "typeorm";

export class addRawEventsTable1629262668088 implements MigrationInterface {
    name = 'addRawEventsTable1629262668088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "raw_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "block" integer NOT NULL, "log_index" integer NOT NULL, "data" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5da37c4a4297afca88e18072385" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "raw_events"`);
    }

}
