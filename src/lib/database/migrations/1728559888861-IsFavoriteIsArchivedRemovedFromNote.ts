import { MigrationInterface, QueryRunner } from "typeorm";

export class IsFavoriteIsArchivedRemovedFromNote1728559888861 implements MigrationInterface {
    name = 'IsFavoriteIsArchivedRemovedFromNote1728559888861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "isFavorite"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "isArchived"`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "oauth_token_secret" character varying`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "oauth_token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "oauth_token"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "oauth_token_secret"`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "isArchived" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "isFavorite" boolean NOT NULL DEFAULT false`);
    }

}
