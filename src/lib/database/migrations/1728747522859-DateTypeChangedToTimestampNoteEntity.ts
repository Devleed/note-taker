import { MigrationInterface, QueryRunner } from "typeorm";

export class DateTypeChangedToTimestampNoteEntity1728747522859 implements MigrationInterface {
    name = 'DateTypeChangedToTimestampNoteEntity1728747522859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ADD "oauth_token_secret" character varying`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "oauth_token" character varying`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "updatedAt" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "createdAt" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "oauth_token"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "oauth_token_secret"`);
    }

}
