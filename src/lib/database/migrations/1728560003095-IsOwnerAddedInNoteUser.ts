import { MigrationInterface, QueryRunner } from "typeorm";

export class IsOwnerAddedInNoteUser1728560003095 implements MigrationInterface {
    name = 'IsOwnerAddedInNoteUser1728560003095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note_users" ADD "isOwner" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note_users" DROP COLUMN "isOwner"`);
    }

}
