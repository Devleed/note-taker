import { transformer } from '$lib/transformers/dateAndBigInt.transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
