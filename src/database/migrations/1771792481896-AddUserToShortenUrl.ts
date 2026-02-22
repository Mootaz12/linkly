import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserToShortenUrl1771792481896 implements MigrationInterface {
  name = 'AddUserToShortenUrl1771792481896';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shorten_url" ADD "user_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "shorten_url" ADD CONSTRAINT "FK_ce117fb35811edb2ccd033d1319" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shorten_url" DROP CONSTRAINT "FK_ce117fb35811edb2ccd033d1319"`,
    );
    await queryRunner.query(`ALTER TABLE "shorten_url" DROP COLUMN "user_id"`);
  }
}
