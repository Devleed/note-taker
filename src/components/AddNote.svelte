<script lang="ts">
	import { onMount } from 'svelte';
	import { notes } from '../store/'; // Import the notes store
	import { NoteItem } from '../store/notes';

	let noteText = '';

	const handleAddNote = () => {
		const tempId = Date.now().toString(); // Generate a temporary ID

		const noteInstance = new NoteItem({
			id: tempId,
			authorId: 'waleed',
			title: '',
			content: noteText
		});

		notes.update((existingNotes) => [...existingNotes, noteInstance]); // Update the notes store with a new note
		noteText = ''; // Reset input

		try {
			// Make an API call to save the note in DB
			// ? On Success replace the temporary ID with the saved ID
			// notes.update(existingNotes => existingNotes.map(n => n.id === note.id ? { ...n, id: savedNote.id } : n));
		} catch (error: any) {
			// ? On Error, remove the note from the store
			// notes.update(existingNotes => existingNotes.filter(n => n.id !== note.id)); // Remove the note on failure
			// console.error('error while adding note ->', error)
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
