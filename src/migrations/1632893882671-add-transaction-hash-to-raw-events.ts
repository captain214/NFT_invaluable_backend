import {MigrationInterface, QueryRunner} from "typeorm";

export class addTransactionHashToRawEvents1632893882671 implements MigrationInterface {
    name = 'addTransactionHashToRawEvents1632893882671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."raw_events" ADD "transaction_hash" VARCHAR`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."raw_events" DROP COLUMN "transaction_hash"`);
    }

}
