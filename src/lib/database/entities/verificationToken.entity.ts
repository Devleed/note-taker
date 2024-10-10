import { Column, Entity, PrimaryGeneratedColumn, type ValueTransformer } from 'typeorm';

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

@Entity({ name: 'verification_tokens' })
class VerificationTokenEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'varchar' })
	token!: string;

	@Column({ type: 'varchar' })
	identifier!: string;

	@Column({ type: 'varchar', transformer: transformer.date })
	expires!: string;
}

export { VerificationTokenEntity };
