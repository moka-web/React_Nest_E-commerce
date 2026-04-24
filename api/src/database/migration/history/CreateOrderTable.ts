import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderTable1714000000001 implements MigrationInterface {
  name = 'CreateOrderTable1714000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "status" character varying(20) NOT NULL, "productVariationId" integer NOT NULL, "countryCode" character varying(7) NOT NULL, "quantity" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f24e5a9b1a9c2f5b2d6e7f8a9b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_order_userId" ON "order" ("userId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_order_userId"`);
    await queryRunner.query(`DROP TABLE "order"`);
  }
}