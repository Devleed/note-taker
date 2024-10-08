<!-- Note.svelte -->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import { NoteItem } from '../store/notes';
	import { notes, searchTerm, syncNotes } from '../store';

	export let note: NoteItem;

	const onDelete = async () => {
		notes.update((existingNotes) =>
			existingNotes.filter((existingNote) => existingNote.id !== note.id)
		);
		searchTerm.set('');

		try {
			// Make an API call to delete the note from DB
			// ? On Success, do nothing

			await fetch('/note', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ noteIds: [note.id] })
			});
		} catch (error: any) {
			// ? On Error, add the note back in store
			// notes.update(existingNotes => [...existingNotes, note]); // Remove the note on failure
			console.error('error while deleting note ->', error);
		} finally {
			syncNotes();
		}
	};

	const addNoteToArchive = async () => {
		const noteInstance = new NoteItem(note);

		noteInstance.isArchived ? noteInstance.unarchive() : noteInstance.archive();
		updateNote(noteInstance);

		try {
			// Make an API call to mark the note as archived in DB
			// ? On Success, do nothing
			await fetch('/note', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: noteInstance.id,
					isArchived: noteInstance.isArchived
				})
			});
		} catch (error: any) {
			// ? On Error, unarchive the note back in store
			// notes.update(existingNotes => existingNotes.map((n) => (n.id === note.id ? {...note, isArchived: false} : n)));
			console.error('error while archiving note ->', error);
		} finally {
			syncNotes();
		}
	};

	const addNoteToFavorite = async () => {
		const noteInstance = new NoteItem(note);

		noteInstance.isFavorite ? noteInstance.removeFromFavorite() : noteInstance.markAsFavorite();
		updateNote(noteInstance);

		try {
			// Make an API call to mark the note as favorite in DB
			// ? On Success, do nothing
			await fetch('/note', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: noteInstance.id,
					isFavorite: noteInstance.isFavorite
				})
			});
		} catch (error: any) {
			// ? On Error, unarchive the note back in store
			// notes.update(existingNotes => existingNotes.map((n) => (n.id === note.id ? {...note, isFavorite: false} : n)));
			console.error('error while marking the note as favorite ->', error);
		} finally {
			syncNotes();
		}
	};

	const updateNote = (noteInstance: NoteItem) => {
		notes.update((existingNotes) => {
			return existingNotes.map((n) => {
				return n.id === noteInstance.id ? noteInstance : n;
			});
		});
	};
</script>

<div class="relative p-6 rounded-lg w-60 h-80 border border-gray-600 group overflow-hidden pb-6">
	<a href="note/{note.id}">
		<p class="line-clamp-10 whitespace-pre-wrap">
			{note.content}
		</p>
	</a>
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
