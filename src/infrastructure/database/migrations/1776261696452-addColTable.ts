import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColTable1776261696452 implements MigrationInterface {
    name = 'AddColTable1776261696452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" RENAME COLUMN "isActive" TO "status"`);
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "assets" ADD "status" character varying DEFAULT 'READY'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "assets" ADD "status" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "assets" RENAME COLUMN "status" TO "isActive"`);
    }

}
