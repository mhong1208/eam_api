import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColUser1776175267494 implements MigrationInterface {
  name = 'AddColUser1776175267494';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "code" character varying`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_1f7a2b11e29b1422a2622beab36" UNIQUE ("code")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_1f7a2b11e29b1422a2622beab36"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "code"`);
  }
}
