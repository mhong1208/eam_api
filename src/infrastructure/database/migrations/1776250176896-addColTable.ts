import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColTable1776250176896 implements MigrationInterface {
    name = 'AddColTable1776250176896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" ADD "warranty_end_date" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "warranty_end_date"`);
    }

}
