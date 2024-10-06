// src/store.js
import { persisted } from 'svelte-persisted-store';
import { writable } from 'svelte/store';
import { NoteItem, type SerializedNoteItem } from './notes';

export const notes = persisted<NoteItem[], SerializedNoteItem[]>('notes', [], {
	// Serialize NoteItem instances before writing to local storage
	beforeWrite: (notesArray) => {
		return notesArray.map((note) => ({
			id: note.id,
			authorId: note.authorId,
			title: note.title,
			content: note.content,
			isFavorite: note.isFavorite,
			isArchived: note.isArchived,
			createdAt: note.createdAt.toISOString(),
			updatedAt: note.updatedAt.toISOString()
		}));
	},

	// Deserialize (rehydrate) notes from storage into NoteItem instances
	beforeRead: (storedNotes) => {
		if (Array.isArray(storedNotes)) {
			return storedNotes.map((noteData) => {
				const noteItem = new NoteItem(noteData);

				return noteItem;
			});
		}
		return [];
	}
});

export const searchTerm = writable<string>('');
export const filteredNotes = writable<NoteItem[]>([]);

export enum Tabs {
	All = 1,
	Favorites = 2,
	Archived = 3
}
export const tabSelected = writable<Tabs>(Tabs.All);
