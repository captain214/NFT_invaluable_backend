import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAssetToEventLog1627900742895 implements MigrationInterface {
    name = 'addAssetToEventLog1627900742895';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "events" ADD "asset_id" uuid');
        await queryRunner.query('ALTER TABLE "events" ADD CONSTRAINT "FK_58a4a0b2f68ae8703a898b95292" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "events" DROP CONSTRAINT "FK_58a4a0b2f68ae8703a898b95292"',);
        await queryRunner.query('ALTER TABLE "events" DROP COLUMN "asset_id"');
    }
}
