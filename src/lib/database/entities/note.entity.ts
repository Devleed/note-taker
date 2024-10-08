import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'notes' })
export class NoteEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'uuid' })
	authorId!: string;

	@Column({ type: 'text' })
	title!: string;

	@Column({ type: 'text' })
	content!: string;

	@Column({ type: 'date', default: () => 'CURRENT_DATE' }) // Date column with default value
	createdAt!: Date;

	@Column({ type: 'date', default: () => 'CURRENT_DATE' }) // Date column with default value
	updatedAt!: Date;

	@Column({ type: 'boolean', default: false })
	isFavorite!: boolean;

	@Column({ type: 'boolean', default: false })
	isArchived!: boolean;

	@ManyToOne(() => UserEntity, (user) => user.notes)
	user!: UserEntity;
}
