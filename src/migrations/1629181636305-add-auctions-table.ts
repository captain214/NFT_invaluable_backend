import {MigrationInterface, QueryRunner} from "typeorm";

export class addAuctionsTable1629181636305 implements MigrationInterface {
    name = 'addAuctionsTable1629181636305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auctions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cancelled" boolean NOT NULL DEFAULT false, "item_claimed" boolean NOT NULL DEFAULT false, "chain_id" character varying NOT NULL, "beneficiary" character varying NOT NULL, "token_id" integer NOT NULL, "bid_step" character varying NOT NULL, "starting_bid" character varying NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "end_date" TIMESTAMP WITH TIME ZONE NOT NULL, "accept_erc20" boolean NOT NULL, "is_erc1155" boolean NOT NULL, "quantity" integer NOT NULL, "fee_rate" integer NOT NULL, "overtime_seconds" integer NOT NULL, "address" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "asset_id" uuid, CONSTRAINT "PK_87d2b34d4829f0519a5c5570368" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "auctions" ADD CONSTRAINT "FK_0154f7cbbaae8678ed9982315a8" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auctions" DROP CONSTRAINT "FK_0154f7cbbaae8678ed9982315a8"`);
        await queryRunner.query(`DROP TABLE "auctions"`);
    }

}
