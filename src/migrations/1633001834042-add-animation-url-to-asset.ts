import {MigrationInterface, QueryRunner} from "typeorm";

export class addAnimationUrlToAsset1633001834042 implements MigrationInterface {
    name = 'addAnimationUrlToAsset1633001834042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."assets" ADD "animation_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."assets" DROP COLUMN "animation_url"`);
    }

}
