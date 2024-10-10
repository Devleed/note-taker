import { MigrationInterface, QueryRunner } from "typeorm";

export class UserNoteEntityAdded1728485791257 implements MigrationInterface {
    name = 'UserNoteEntityAdded1728485791257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_829532ff766505ad7c71592c6a5"`);
        await queryRunner.query(`CREATE TABLE "note_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "noteId" uuid NOT NULL, "isFavorite" boolean NOT NULL DEFAULT false, "isArchived" boolean NOT NULL DEFAULT false, "dateShared" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ca197c2be547a874498ac55d0bf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "authorId"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "ownerId" uuid`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "oauth_token_secret" character varying`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "oauth_token" character varying`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_8fcc29811c424b531ac9a341d29" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "note_users" ADD CONSTRAINT "FK_0de17349a2b18eb0b040becc712" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "note_users" ADD CONSTRAINT "FK_06fc6d9757561faa1ac7978390a" FOREIGN KEY ("noteId") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note_users" DROP CONSTRAINT "FK_06fc6d9757561faa1ac7978390a"`);
        await queryRunner.query(`ALTER TABLE "note_users" DROP CONSTRAINT "FK_0de17349a2b18eb0b040becc712"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_8fcc29811c424b531ac9a341d29"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "oauth_token"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "oauth_token_secret"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "authorId" uuid NOT NULL`);
        await queryRunner.query(`DROP TABLE "note_users"`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_829532ff766505ad7c71592c6a5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
