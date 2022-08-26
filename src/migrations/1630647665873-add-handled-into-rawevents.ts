import {MigrationInterface, QueryRunner} from "typeorm";

export class addHandledIntoRawevents1630647665873 implements MigrationInterface {
    name = 'addHandledIntoRawevents1630647665873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."raw_events" ADD "handled" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."raw_events" DROP COLUMN "handled"`);
    }

}
