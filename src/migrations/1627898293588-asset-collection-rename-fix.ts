import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AssetCollectionRenameFix1627898293588 implements MigrationInterface {
  name = 'assetCollectionRenameFix1627898293588';

      public async up(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.query('ALTER TABLE "assets" DROP CONSTRAINT "FK_bfdc3fe63eb7269f4a286252641"',);
          await queryRunner.query('ALTER TABLE "assets" RENAME COLUMN "category_id" TO "collection_id"',);
          await queryRunner.query('ALTER TABLE "assets" ADD CONSTRAINT "FK_aa7073c8851ebaeab4e2fb1f719" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',);
      }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE "assets" DROP CONSTRAINT "FK_aa7073c8851ebaeab4e2fb1f719"',);
      await queryRunner.query('ALTER TABLE "assets" RENAME COLUMN "collection_id" TO "category_id"',);
      await queryRunner.query('ALTER TABLE "assets" ADD CONSTRAINT "FK_bfdc3fe63eb7269f4a286252641" FOREIGN KEY ("category_id") REFERENCES "collections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',);
    }
}
