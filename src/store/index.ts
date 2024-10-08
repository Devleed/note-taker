// src/store.js
import { persisted } from 'svelte-persisted-store';
import { writable } from 'svelte/store';
import { NoteItem } from './notes';
import type { NoteEntity } from '$lib/database/entities/note.entity';

export const notes = persisted<NoteItem[], Omit<NoteEntity, 'user'>[]>('notes', [], {
	// Serialize NoteItem instances before writing to local storage
	beforeWrite: (notesArray) => {
		return notesArray.map((note) => ({
			id: note.id,
			authorId: note.authorId,
			title: note.title,
			content: note.content,
			isFavorite: note.isFavorite,
			isArchived: note.isArchived,
			createdAt: note.createdAt,
			updatedAt: note.updatedAt
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

export async function syncNotes() {
	const res = await fetch('/note');
	const serverNotes = await res.json();
	notes.set(serverNotes);
}

export const searchTerm = writable<string>('');
export const filteredNotes = writable<NoteItem[]>([]);

export enum Tabs {
	All = 1,
	Favorites = 2,
	Archived = 3
}
export const tabSelected = writable<Tabs>(Tabs.All);
