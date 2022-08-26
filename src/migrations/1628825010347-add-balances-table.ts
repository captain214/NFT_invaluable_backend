import {MigrationInterface, QueryRunner} from "typeorm";

export class addBalancesTable1628825010347 implements MigrationInterface {
    name = 'addBalancesTable1628825010347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."assets" RENAME COLUMN "owner" TO "type"`);
        await queryRunner.query(`CREATE TABLE "balances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "owner" character varying NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "asset_id" uuid, CONSTRAINT "PK_74904758e813e401abc3d4261c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."assets" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."assets_type_enum" AS ENUM('ERC721', 'ERC1155', 'ERC20')`);
        await queryRunner.query(`ALTER TABLE "public"."assets" ADD "type" "public"."assets_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "balances" ADD CONSTRAINT "FK_47cb693c2e361bf91c2ce9ae6e1" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balances" DROP CONSTRAINT "FK_47cb693c2e361bf91c2ce9ae6e1"`);
        await queryRunner.query(`ALTER TABLE "public"."assets" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."assets_type_enum"`);
        await queryRunner.query(`ALTER TABLE "public"."assets" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "balances"`);
        await queryRunner.query(`ALTER TABLE "public"."assets" RENAME COLUMN "type" TO "owner"`);
    }

}
