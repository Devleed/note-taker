import { transformer } from '$lib/transformers/dateAndBigInt.transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '.';

@Entity({ name: 'sessions' })
class SessionEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar', unique: true })
	sessionToken!: string;

	@Column({ type: 'uuid' })
	userId!: string;

	@Column({ type: 'varchar', transformer: transformer.date })
	expires!: string;

	@ManyToOne(() => UserEntity, (user) => user.sessions)
	user!: UserEntity;
}

export { SessionEntity };
