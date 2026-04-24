import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotificationTable1714000000002 implements MigrationInterface {
  name = 'CreateNotificationTable1714000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "type" character varying(50) NOT NULL, "title" text NOT NULL, "message" text NOT NULL, "read" boolean NOT NULL DEFAULT false, "metadata" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f24e5a9b1a9c2f5b2d6e7f8a9c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_notification_userId" ON "notification" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_notification_read" ON "notification" ("read")`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_notification_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_notification_user"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_notification_read"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_notification_userId"`);
    await queryRunner.query(`DROP TABLE "notification"`);
  }
}