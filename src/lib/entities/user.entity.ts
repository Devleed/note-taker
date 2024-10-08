// src/lib/entities.ts
import { transformer } from '$lib/transformers/dateAndBigInt.transformer';
import { Entity, PrimaryGeneratedColumn, Column, Unique, BaseEntity, OneToMany } from 'typeorm';

import { SessionEntity, AccountEntity } from '.';

@Entity({ name: 'users' })
@Unique(['email'])
class UserEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

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
}

export { UserEntity };
