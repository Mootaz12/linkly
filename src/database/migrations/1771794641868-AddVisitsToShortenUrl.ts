import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVisitsToShortenUrl1771794641868 implements MigrationInterface {
  name = 'AddVisitsToShortenUrl1771794641868';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shorten_url" ADD "visits" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "shorten_url" DROP COLUMN "visits"`);
  }
}
