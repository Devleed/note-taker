// src/lib/entities.ts
import { transformer } from '$lib/transformers/dateAndBigInt.transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { SessionEntity, AccountEntity } from '.';
import { NoteEntity } from './note.entity';

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

	@OneToMany(() => NoteEntity, (note) => note.user)
	notes!: NoteEntity[];
}

export { UserEntity };
