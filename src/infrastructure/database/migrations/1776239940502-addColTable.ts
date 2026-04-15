import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColTable1776239940502 implements MigrationInterface {
    name = 'AddColTable1776239940502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "parentId"`);
        await queryRunner.query(`ALTER TABLE "locations" ADD "parentId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "parentId"`);
        await queryRunner.query(`ALTER TABLE "locations" ADD "parentId" integer`);
    }

}
