import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColTable1776234081341 implements MigrationInterface {
    name = 'AddColTable1776234081341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "locations" ADD "locationType" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "locationType"`);
    }

}
