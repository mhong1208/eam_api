import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColTable1776291989413 implements MigrationInterface {
    name = 'AddColTable1776291989413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."handovers_status_enum" AS ENUM('NEW', 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "handovers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "asset_id" uuid NOT NULL, "receiver_id" uuid NOT NULL, "sender_id" uuid, "location_id" uuid, "handover_date" TIMESTAMP, "return_date" TIMESTAMP, "status" "public"."handovers_status_enum" NOT NULL DEFAULT 'PENDING', "asset_condition" text, "handover_reason" text, "notes" text, CONSTRAINT "PK_88432ab36f1a01be3bb86a16c28" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "position" character varying DEFAULT 'STAFF'`);
        await queryRunner.query(`ALTER TABLE "handovers" ADD CONSTRAINT "FK_5b28c3682718bd642e73ff51b0a" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "handovers" ADD CONSTRAINT "FK_5e94e19d599e56204d70b7b60ab" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "handovers" ADD CONSTRAINT "FK_94dce2bec29b3d06940987763fe" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "handovers" ADD CONSTRAINT "FK_0a643f57765ace3bcc661aca4fa" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "handovers" DROP CONSTRAINT "FK_0a643f57765ace3bcc661aca4fa"`);
        await queryRunner.query(`ALTER TABLE "handovers" DROP CONSTRAINT "FK_94dce2bec29b3d06940987763fe"`);
        await queryRunner.query(`ALTER TABLE "handovers" DROP CONSTRAINT "FK_5e94e19d599e56204d70b7b60ab"`);
        await queryRunner.query(`ALTER TABLE "handovers" DROP CONSTRAINT "FK_5b28c3682718bd642e73ff51b0a"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "position"`);
        await queryRunner.query(`DROP TABLE "handovers"`);
        await queryRunner.query(`DROP TYPE "public"."handovers_status_enum"`);
    }

}
