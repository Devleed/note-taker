import type { NoteEntity } from '$lib/database/entities/note.entity';
import type { User } from '@auth/sveltekit';

export const getDefaultNoteCreation = (
	title: string,
	content: string,
	user: User
): NoteItemResponse => {
	return {
		content,
		title,
		id: Date.now().toString(),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		ownerId: user.id!,
		users: [
			{
				dateShared: new Date().toISOString(),
				id: user.id!,
				image: user.image || '',
				isArchived: false,
				isFavorite: false,
				isOwner: true
			}
		]
	};
};

export interface NoteUserResponse {
	id: string;
	image: string;
	dateShared: string;
	isOwner: boolean;
	isFavorite: boolean;
	isArchived: boolean;
}

export interface NoteItemResponse {
	id: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	ownerId: string;
	users: NoteUserResponse[];
}

export interface SerializedNoteItem {
	id: string;
	authorId: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	isFavorite: boolean;
	isArchived: boolean;
}

interface Note {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;

	editTitle(newTitle: string): void;
	editContent(newContent: string): void;
}

interface Favoritable {
	isFavorite: boolean;

	markAsFavorite(): void;
	removeFromFavorite(): void;
}

interface Archivable {
	isArchived: boolean;

	archive(): void;
	unarchive(): void;
}

export class NoteItem implements Note, Favoritable, Archivable {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	isFavorite: boolean = false;
	isArchived: boolean = false;

	constructor(noteData: Partial<NoteEntity>) {
		if (noteData.id === undefined) {
			throw new Error('NoteItem constructor requires an id and owner');
		}

		this.id = noteData.id;
		this.title = noteData.title || '';
		this.content = noteData.content || '';
		this.createdAt = noteData.createdAt ? new Date(noteData.createdAt) : new Date();
		this.updatedAt = noteData.updatedAt ? new Date(noteData.updatedAt) : new Date();
	}

	// Note methods
	editTitle(newTitle: string): void {
		this.title = newTitle;
		this.updatedAt = new Date();
	}

	editContent(newContent: string): void {
		this.content = newContent;
		this.updatedAt = new Date();
	}

	// Favoritable methods
	markAsFavorite(): void {
		this.isFavorite = true;
	}

	removeFromFavorite(): void {
		this.isFavorite = false;
	}

	// Archivable methods
	archive(): void {
		this.isArchived = true;
	}

	unarchive(): void {
		this.isArchived = false;
	}
}
