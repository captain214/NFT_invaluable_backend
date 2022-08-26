import {MigrationInterface, QueryRunner} from "typeorm";

export class provideUserEntity1629732913541 implements MigrationInterface {
    name = 'provideUserEntity1629732913541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."balances" RENAME COLUMN "owner" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "public"."assets" RENAME COLUMN "creator" TO "creator_id"`);
        await queryRunner.query(`ALTER TABLE "public"."events" DROP COLUMN "from_account"`);
        await queryRunner.query(`ALTER TABLE "public"."events" DROP COLUMN "to_account"`);
        await queryRunner.query(`ALTER TABLE "public"."orders" DROP COLUMN "creator"`);
        await queryRunner.query(`ALTER TABLE "public"."orders" DROP COLUMN "taker"`);
        await queryRunner.query(`ALTER TABLE "public"."events" ADD "from_user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."events" ADD "to_user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ADD "creator_id" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ADD "taker_id" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "banner" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."balances" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "public"."balances" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."assets" DROP COLUMN "creator_id"`);
        await queryRunner.query(`ALTER TABLE "public"."assets" ADD "creator_id" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."events" ADD CONSTRAINT "FK_bce0f79c0f88742feb4b176547a" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."events" ADD CONSTRAINT "FK_5f203039203350a859c05a1d41f" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ADD CONSTRAINT "FK_7bbb60d1339c786f56b3cd6fd43" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ADD CONSTRAINT "FK_ceffa280b3a655c23e1e33c9dde" FOREIGN KEY ("taker_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."balances" ADD CONSTRAINT "FK_864b90e3b151018347577be4f97" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."assets" ADD CONSTRAINT "FK_3890b1907a16921b6841f2fa650" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."assets" DROP CONSTRAINT "FK_3890b1907a16921b6841f2fa650"`);
        await queryRunner.query(`ALTER TABLE "public"."balances" DROP CONSTRAINT "FK_864b90e3b151018347577be4f97"`);
        await queryRunner.query(`ALTER TABLE "public"."orders" DROP CONSTRAINT "FK_ceffa280b3a655c23e1e33c9dde"`);
        await queryRunner.query(`ALTER TABLE "public"."orders" DROP CONSTRAINT "FK_7bbb60d1339c786f56b3cd6fd43"`);
        await queryRunner.query(`ALTER TABLE "public"."events" DROP CONSTRAINT "FK_5f203039203350a859c05a1d41f"`);
        await queryRunner.query(`ALTER TABLE "public"."events" DROP CONSTRAINT "FK_bce0f79c0f88742feb4b176547a"`);
        await queryRunner.query(`ALTER TABLE "public"."assets" DROP COLUMN "creator_id"`);
        await queryRunner.query(`ALTER TABLE "public"."assets" ADD "creator_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."balances" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "public"."balances" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "banner"`);
        await queryRunner.query(`ALTER TABLE "public"."orders" DROP COLUMN "taker_id"`);
        await queryRunner.query(`ALTER TABLE "public"."orders" DROP COLUMN "creator_id"`);
        await queryRunner.query(`ALTER TABLE "public"."events" DROP COLUMN "to_user_id"`);
        await queryRunner.query(`ALTER TABLE "public"."events" DROP COLUMN "from_user_id"`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ADD "taker" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."orders" ADD "creator" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."events" ADD "to_account" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."events" ADD "from_account" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."assets" RENAME COLUMN "creator_id" TO "creator"`);
        await queryRunner.query(`ALTER TABLE "public"."balances" RENAME COLUMN "user_id" TO "owner"`);
    }

}
