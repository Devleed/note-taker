import { Entity, PrimaryGeneratedColumn, Column, OneToMany, type ValueTransformer } from 'typeorm';

import { SessionEntity, AccountEntity } from '.';
import { NoteUserEntity } from './noteUser.entity';
import { NoteEntity } from './note.entity';

const transformer: Record<'date' | 'bigint', ValueTransformer> = {
	date: {
		from: (date: string | null) => date && new Date(parseInt(date, 10)),
		to: (date?: Date) => date?.valueOf().toString()
	},
	bigint: {
		from: (bigInt: string | null) => bigInt && parseInt(bigInt, 10),
		to: (bigInt?: number) => bigInt?.toString()
	}
};

@Entity({ name: 'users' })
class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar', nullable: true })
	name!: string | null;

	@Column({ type: 'varchar', nullable: true, unique: true })
	email!: string | null;

	@Column({ type: 'varchar', nullable: true, transformer: transformer.date })
	emailVerified!: string | null;

	@Column({ type: 'varchar', nullable: true })
	image!: string | null;

	@OneToMany(() => SessionEntity, (session) => session.userId)
	sessions!: SessionEntity[];

	@OneToMany(() => AccountEntity, (account) => account.userId)
	accounts!: AccountEntity[];

	@OneToMany(() => NoteUserEntity, (noteUser) => noteUser.user)
	noteUsers!: NoteUserEntity[];

	@OneToMany(() => NoteEntity, (note) => note.owner)
	ownedNotes!: NoteEntity[];
}

export { UserEntity };
