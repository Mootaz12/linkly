import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1771176582287 implements MigrationInterface {
  name = 'InitialMigration1771176582287';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "shorten_url" ("created_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIME WITH TIME ZONE NOT NULL DEFAULT now(), "short_url" text NOT NULL, "long_url" text NOT NULL, "expiration_date" TIME WITH TIME ZONE, CONSTRAINT "PK_b1029aa061e04ee73cdf53e5360" PRIMARY KEY ("short_url"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "shorten_url"`);
  }
}
