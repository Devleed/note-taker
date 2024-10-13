import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NoteUserEntity } from './noteUser.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'notes' })
export class NoteEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ type: 'text' })
	title!: string;

	@Column({ type: 'text' })
	content!: string;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Date column with default value
	createdAt!: Date;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Date column with default value
	updatedAt!: Date;

	@OneToMany(() => NoteUserEntity, (noteUser) => noteUser.note)
	noteUsers!: NoteUserEntity[];

	@ManyToOne(() => UserEntity, (user) => user.ownedNotes, { onDelete: 'SET NULL' })
	owner!: UserEntity;
}
