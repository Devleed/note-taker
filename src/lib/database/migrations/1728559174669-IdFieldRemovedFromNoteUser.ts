import { MigrationInterface, QueryRunner } from "typeorm";

export class IdFieldRemovedFromNoteUser1728559174669 implements MigrationInterface {
    name = 'IdFieldRemovedFromNoteUser1728559174669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note_users" DROP CONSTRAINT "PK_ca197c2be547a874498ac55d0bf"`);
        await queryRunner.query(`ALTER TABLE "note_users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "oauth_token_secret" character varying`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "oauth_token" character varying`);
        await queryRunner.query(`ALTER TABLE "note_users" ADD CONSTRAINT "PK_2918fdd07a9541bfbf86a4131b1" PRIMARY KEY ("userId", "noteId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note_users" DROP CONSTRAINT "PK_2918fdd07a9541bfbf86a4131b1"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "oauth_token"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "oauth_token_secret"`);
        await queryRunner.query(`ALTER TABLE "note_users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "note_users" ADD CONSTRAINT "PK_ca197c2be547a874498ac55d0bf" PRIMARY KEY ("id")`);
    }

}
