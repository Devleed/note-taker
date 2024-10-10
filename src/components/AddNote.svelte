<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { notes, syncNotes } from '../store/'; // Import the notes store
	import { getDefaultNoteCreation, NoteItem, type NoteItemResponse } from '../store/notes';

	let noteText = '';

	const user = $page.data.session?.user;

	const handleAddNote = async () => {
		const noteToCreate: NoteItemResponse = getDefaultNoteCreation('', noteText, user!);

		notes.update((existingNotes) => [...existingNotes, noteToCreate]); // Update the notes store with a new note
		noteText = ''; // Reset input

		try {
			// Make an API call to save the note in DB
			// ? On Success replace the temporary ID with the saved ID
			// notes.update(existingNotes => existingNotes.map(n => n.id === note.id ? { ...n, id: savedNote.id } : n));

			await fetch('/note', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title: noteToCreate.title, content: noteToCreate.content })
			});
		} catch (error: any) {
			console.error('error while adding note ->', error);
			// ? On Error, remove the note from the store
			// notes.update(existingNotes => existingNotes.filter(n => n.id !== note.id)); // Remove the note on failure
			// console.error('error while adding note ->', error)
		} finally {
			syncNotes();
		}
	};

	const onAddNoteKeyDown = (e: any) => {
		if (e.key === 'Enter' && !e.shiftKey && noteText.trim().length) {
			e.preventDefault();
			handleAddNote();
		}
	};

	onMount(() => {
		const textarea = document.getElementById('auto-grow-textarea') as HTMLTextAreaElement;

		// Adjust height dynamically based on content
		textarea?.addEventListener('input', function () {
			this.style.height = 'auto'; // Reset height
			this.style.height = `${this.scrollHeight}px`; // Adjust height based on scrollHeight
		});
	});
</script>

<textarea
	id="auto-grow-textarea"
	class="w-[800px] p-4 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden"
	rows="4"
	bind:value={noteText}
	placeholder="Write a note..."
	on:keydown={onAddNoteKeyDown}
/>

<style>
</style>
