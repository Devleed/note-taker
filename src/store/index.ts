// src/store.js
import { persisted } from 'svelte-persisted-store';
import { writable } from 'svelte/store';
import { type NoteItemResponse } from './notes';

export const notes = persisted<NoteItemResponse[], NoteItemResponse[]>('notes', [], {
	// Serialize NoteItem instances before writing to local storage
	// beforeWrite: (notesArray) => {
	// 	console.log('🚀 ~ notesArray:', notesArray);
	// 	return notesArray;
	// 	// if (!Array.isArray(notesArray)) return [];
	// 	// return notesArray.map((note) => ({
	// 	// 	id: note.id,
	// 	// 	title: note.title,
	// 	// 	content: note.content,
	// 	// 	isFavorite: note.isFavorite,
	// 	// 	isArchived: note.isArchived,
	// 	// 	createdAt: note.createdAt,
	// 	// 	updatedAt: note.updatedAt
	// 	// }));
	// },
	// // Deserialize (rehydrate) notes from storage into NoteItem instances
	// beforeRead: (storedNotes) => {
	// 	console.log('🚀 ~ storedNotes:', storedNotes);
	// 	if (Array.isArray(storedNotes)) {
	// 		return storedNotes.map((noteData) => {
	// 			const noteItem = new NoteItem(noteData);
	// 			return noteItem;
	// 		});
	// 	}
	// 	return [];
	// }
});

export async function syncNotes() {
	const res = await fetch('/note');
	const serverNotes: NoteItemResponse[] = await res.json();
	console.log('🚀 ~ syncNotes ~ serverNotes:', serverNotes);
	notes.set(serverNotes);
}

export const searchTerm = writable<string>('');
export const filteredNotes = writable<NoteItemResponse[]>([]);

export enum Tabs {
	All = 1,
	Favorites = 2,
	Archived = 3
}
export const tabSelected = writable<Tabs>(Tabs.All);
