import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColTable1776228445215 implements MigrationInterface {
    name = 'AddColTable1776228445215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vendors" RENAME COLUMN "status" TO "isActive"`);
        await queryRunner.query(`ALTER TABLE "asset_categories" RENAME COLUMN "status" TO "isActive"`);
        await queryRunner.query(`ALTER TABLE "assets" RENAME COLUMN "status" TO "isActive"`);
        await queryRunner.query(`ALTER TABLE "departments" ADD "isActive" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "locations" ADD "isActive" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "vendors" ADD "isActive" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "asset_categories" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "asset_categories" ADD "isActive" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "assets" ADD "isActive" boolean DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "assets" ADD "isActive" character varying NOT NULL DEFAULT 'READY'`);
        await queryRunner.query(`ALTER TABLE "asset_categories" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "asset_categories" ADD "isActive" character varying NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "vendors" ADD "isActive" character varying NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "departments" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "assets" RENAME COLUMN "isActive" TO "status"`);
        await queryRunner.query(`ALTER TABLE "asset_categories" RENAME COLUMN "isActive" TO "status"`);
        await queryRunner.query(`ALTER TABLE "vendors" RENAME COLUMN "isActive" TO "status"`);
    }

}
