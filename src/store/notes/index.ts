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
	authorId: string;
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
	authorId: string;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	isFavorite: boolean = false;
	isArchived: boolean = false;

	constructor(noteData: Partial<SerializedNoteItem>) {
		if (noteData.id === undefined || noteData.authorId === undefined) {
			throw new Error('NoteItem constructor requires an id and authorId');
		}

		this.id = noteData.id;
		this.authorId = noteData.authorId;
		this.title = noteData.title || '';
		this.content = noteData.content || '';
		this.isFavorite = noteData.isFavorite || false;
		this.isArchived = noteData.isArchived || false;
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
