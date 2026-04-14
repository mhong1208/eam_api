import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1776150790290 implements MigrationInterface {
    name = 'InitTables1776150790290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vendors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "name" character varying NOT NULL, "phone" character varying, "email" character varying, "address" character varying, "status" character varying NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "UQ_1127015587ca66797a569381717" UNIQUE ("code"), CONSTRAINT "PK_9c956c9797edfae5c6ddacc4e6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "name" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'ACTIVE', "description" character varying, "parentId" integer, CONSTRAINT "UQ_1c65ef243169e51b514c814eeae" UNIQUE ("code"), CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "asset_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "name" character varying NOT NULL, "depreciationMonth" integer, "description" character varying, "status" character varying NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "UQ_2787593ee8afad9f185bdf3f472" UNIQUE ("code"), CONSTRAINT "PK_d21442187e7b0237566389805a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "name" character varying NOT NULL, "qrCode" character varying, "serialNumber" character varying, "category_id" uuid NOT NULL, "location_id" uuid, "vendor_id" uuid, "purchase_price" numeric(15,2), "purchase_date" date, "status" character varying NOT NULL DEFAULT 'READY', CONSTRAINT "UQ_bff60c1b89bff7edff592d85ea4" UNIQUE ("code"), CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "assets" ADD CONSTRAINT "FK_bfdc3fe63eb7269f4a286252641" FOREIGN KEY ("category_id") REFERENCES "asset_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assets" ADD CONSTRAINT "FK_916f79b60e63293b23def86da6d" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assets" ADD CONSTRAINT "FK_a4d58da8b1bdb73a0946964e6cc" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_a4d58da8b1bdb73a0946964e6cc"`);
        await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_916f79b60e63293b23def86da6d"`);
        await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_bfdc3fe63eb7269f4a286252641"`);
        await queryRunner.query(`DROP TABLE "assets"`);
        await queryRunner.query(`DROP TABLE "asset_categories"`);
        await queryRunner.query(`DROP TABLE "locations"`);
        await queryRunner.query(`DROP TABLE "vendors"`);
    }

}
