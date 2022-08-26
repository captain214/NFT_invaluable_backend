import {MigrationInterface, QueryRunner} from "typeorm";

export class addAuctionEventsTable1629268974699 implements MigrationInterface {
    name = 'addAuctionEventsTable1629268974699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "auction_events_type_enum" AS ENUM('AUCTION_CREATED', 'AUCTION_CANCELLED', 'BID_PLACED', 'FUNDS_CLAIMED', 'ITEM_CLAIMED')`);
        await queryRunner.query(`CREATE TABLE "auction_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "auction_events_type_enum" NOT NULL, "chain_id" character varying NOT NULL, "price" character varying, "from_account" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "auction_id" uuid, CONSTRAINT "PK_550171a39f9097852554f8eb51b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "auction_events" ADD CONSTRAINT "FK_bbc31729fdfb0ae963996a0e218" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auction_events" DROP CONSTRAINT "FK_bbc31729fdfb0ae963996a0e218"`);
        await queryRunner.query(`DROP TABLE "auction_events"`);
        await queryRunner.query(`DROP TYPE "auction_events_type_enum"`);
    }

}
