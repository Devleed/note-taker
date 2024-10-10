// src/lib/entities/NoteUserEntity.ts
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { NoteEntity } from './note.entity';

@Entity({ name: 'note_users' })
export class NoteUserEntity {
	@PrimaryColumn({ type: 'uuid' })
	userId!: string;

	@PrimaryColumn({ type: 'uuid' })
	noteId!: string;

	@ManyToOne(() => UserEntity, (user) => user.noteUsers, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user!: UserEntity;

	@ManyToOne(() => NoteEntity, (note) => note.noteUsers, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'noteId' })
	note!: NoteEntity;

	// User-specific favorite flag
	@Column({ type: 'boolean', default: false })
	isFavorite!: boolean;

	// User-specific favorite flag
	@Column({ type: 'boolean', default: false })
	isArchived!: boolean;

	// User-specific favorite flag
	@Column({ type: 'boolean', default: false })
	isOwner!: boolean;

	// Date when the note was shared
	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	dateShared!: Date;
}
