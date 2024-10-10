import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, type ValueTransformer } from 'typeorm';
import { UserEntity } from '.';

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
