import {MigrationInterface, QueryRunner} from "typeorm";

export class initDB1627544598926 implements MigrationInterface {
    name = 'initDB1627544598926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "image_url" character varying NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "collections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text, "image_url" character varying, "banner_url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "category_id" uuid, CONSTRAINT "UQ_99d0d14f9f23b45d2c6648c4b57" UNIQUE ("slug"), CONSTRAINT "PK_21c00b1ebbd41ba1354242c5c4e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "assets_role_enum" AS ENUM('IMAGE', 'VIDEO', 'AUDIO')`);
        await queryRunner.query(`CREATE TABLE "assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token_id" integer NOT NULL, "address" character varying NOT NULL, "title" character varying NOT NULL, "description" text, "image_url" character varying, "creator" character varying NOT NULL, "owner" character varying NOT NULL, "chain_id" character varying NOT NULL, "favorites_count" integer NOT NULL, "role" "assets_role_enum" NOT NULL DEFAULT 'IMAGE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "properties" text, "category_id" uuid, CONSTRAINT "UQ_a73439e88ba3b6249371acd2c83" UNIQUE ("token_id"), CONSTRAINT "UQ_0f8764aeb8dd2d2a9a1374aa854" UNIQUE ("address"), CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_ffe6b2d60596409fb08fb13830d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "creator" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "type_id" uuid, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "orders_type_enum" AS ENUM('FIX_PRICE', 'AUCTION', 'BID')`);
        await queryRunner.query(`CREATE TYPE "orders_status_enum" AS ENUM('ACTIVE', 'CANCELLED', 'EXPIRED', 'ACCEPTED')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token_id" integer NOT NULL, "price" integer NOT NULL DEFAULT '0', "expiration_time" TIMESTAMP, "creator" character varying NOT NULL, "type" "orders_type_enum" NOT NULL DEFAULT 'FIX_PRICE', "status" "orders_status_enum" NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "users_role_enum" AS ENUM('USER', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying, "address" character varying NOT NULL, "role" "users_role_enum" NOT NULL DEFAULT 'USER', "avatar" character varying, "favorites" character varying array DEFAULT '{}', CONSTRAINT "UQ_b0ec0293d53a1385955f9834d5c" UNIQUE ("address"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "collections" ADD CONSTRAINT "FK_efffbe2e3504414fb841b1ec1eb" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assets" ADD CONSTRAINT "FK_bfdc3fe63eb7269f4a286252641" FOREIGN KEY ("category_id") REFERENCES "collections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_bcb2ce0072504d624725e3ef826" FOREIGN KEY ("type_id") REFERENCES "event_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_bcb2ce0072504d624725e3ef826"`);
        await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_bfdc3fe63eb7269f4a286252641"`);
        await queryRunner.query(`ALTER TABLE "collections" DROP CONSTRAINT "FK_efffbe2e3504414fb841b1ec1eb"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "users_role_enum"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "orders_status_enum"`);
        await queryRunner.query(`DROP TYPE "orders_type_enum"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "event_types"`);
        await queryRunner.query(`DROP TABLE "assets"`);
        await queryRunner.query(`DROP TYPE "assets_role_enum"`);
        await queryRunner.query(`DROP TABLE "collections"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
