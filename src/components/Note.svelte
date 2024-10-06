<!-- Note.svelte -->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { NoteItem } from '../store/notes';
	import { notes, searchTerm } from '../store';

	export let note: NoteItem;

	const onDelete = () => {
		notes.update((existingNotes) =>
			existingNotes.filter((existingNote) => existingNote.id !== note.id)
		);
		searchTerm.set('');

		try {
			// Make an API call to delete the note from DB
			// ? On Success, do nothing
		} catch (error: any) {
			// ? On Error, add the note back in store
			// notes.update(existingNotes => [...existingNotes, note]); // Remove the note on failure
			// console.error('error while deleting note ->', error)
		}
	};

	const addNoteToArchive = () => {
		note.isArchived ? note.unarchive() : note.archive();
		updateNote();

		try {
			// Make an API call to mark the note as archived in DB
			// ? On Success, do nothing
		} catch (error: any) {
			// ? On Error, unarchive the note back in store
			// notes.update(existingNotes => existingNotes.map((n) => (n.id === note.id ? {...note, isArchived: false} : n)));
			// console.error('error while archiving note ->', error)
		}
	};

	const addNoteToFavorite = () => {
		note.isFavorite ? note.removeFromFavorite() : note.markAsFavorite();
		updateNote();

		try {
			// Make an API call to mark the note as favorite in DB
			// ? On Success, do nothing
		} catch (error: any) {
			// ? On Error, unarchive the note back in store
			// notes.update(existingNotes => existingNotes.map((n) => (n.id === note.id ? {...note, isFavorite: false} : n)));
			// console.error('error while marking the note as favorite ->', error)
		}
	};

	const updateNote = () => {
		notes.update((existingNotes) => existingNotes.map((n) => (n.id === note.id ? note : n)));
	};
</script>

<div class="relative p-6 rounded-lg w-60 h-80 border border-gray-600 group overflow-hidden pb-6">
	<a href="note/{note.id}" class="line-clamp-10">{note.content}</a>
	<button
		on:click={onDelete}
		class="absolute top-5 right-5 text-gray-300 hidden group-hover:block group-hover:text-gray-500 transition-colors duration-800"
	>
		<Icon icon="mage:trash-2" font-size="20px" />
	</button>

	<div
		class="absolute bottom-5 right-5 text-gray-300 hidden group-hover:block group-hover:text-gray-500 transition-colors duration-800 flex flex-row align-center"
	>
		<button class="" on:click={addNoteToArchive}>
			<Icon
				icon={note.isArchived
					? 'material-symbols-light:archive'
					: 'material-symbols-light:archive-outline'}
				font-size="20px"
			/>
		</button>

		<button class="" on:click={addNoteToFavorite}>
			<Icon icon={note.isFavorite ? 'ph:heart-fill' : 'ph:heart-light'} font-size="20px" />
		</button>
	</div>
</div>

<style>
</style>
