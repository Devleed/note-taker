import { transformer } from '$lib/transformers/dateAndBigInt.transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '.';

@Entity({ name: 'accounts' })
class AccountEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'uuid' })
	userId!: string;

	@Column({ type: 'varchar' })
	type!: string;

	@Column({ type: 'varchar' })
	provider!: string;

	@Column({ type: 'varchar' })
	providerAccountId!: string;

	@Column({ type: 'varchar', nullable: true })
	refresh_token!: string | null;

	@Column({ type: 'varchar', nullable: true })
	access_token!: string | null;

	@Column({
		nullable: true,
		type: 'bigint',
		transformer: transformer.bigint
	})
	expires_at!: number | null;

	@Column({ type: 'varchar', nullable: true })
	token_type!: string | null;

	@Column({ type: 'varchar', nullable: true })
	scope!: string | null;

	@Column({ type: 'varchar', nullable: true })
	id_token!: string | null;

	@Column({ type: 'varchar', nullable: true })
	session_state!: string | null;

	@Column({ type: 'varchar', nullable: true })
	oauth_token_secret!: string | null;

	@Column({ type: 'varchar', nullable: true })
	oauth_token!: string | null;

	@ManyToOne(() => UserEntity, (user) => user.accounts, {
		createForeignKeyConstraints: true
	})
	user!: UserEntity;
}

export { AccountEntity };
