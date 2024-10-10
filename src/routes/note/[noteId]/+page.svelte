<script lang="ts">
	import { notes } from '../../../store';
	import { onMount } from 'svelte';
	import type { NoteItemResponse } from '../../../store/notes';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	const noteId = $page?.params?.noteId; // noteId passed from the load function
	let selectedNote: NoteItemResponse | null = null; // Will hold the selected note

	// Fetch the note from the store after the component is rendered
	onMount(() => {
		const note = $notes.find((n) => n.id === noteId);

		if (note) {
			selectedNote = note; // Set the selected note
		} else {
			// ? Make an API call to fetch the note from the server
		}
	});

	// Handle modal close and delete actions (you can implement these methods as needed)
	const closeModal = () => {
		// Close modal action
	};

	const deleteNote = () => {
		// Delete note action
	};

	const toggleFavorite = () => {
		// Toggle favorite action
	};

	const toggleArchive = () => {
		// Toggle archive action
	};
</script>

<!-- Modal Backdrop with Blur Effect -->
<div class="fixed inset-0 container h-full mx-auto flex justify-center items-center z-50">
	<!-- Modal Content -->
	<div
		class="border border-gray-600 w-3/4 md:w-1/2 p-[40px] rounded-lg relative max-h-[80vh] overflow-y-auto"
	>
		{#if selectedNote}
			<!-- Back Icon (Top Left) -->
			<button class="absolute top-5 left-5 text-gray-500 hover:text-gray-700" on:click={closeModal}>
				<!-- Back icon (you can replace with an actual icon if you have an icon library) -->
				&#x2190;
			</button>

			<!-- Delete Icon (Top Right) -->
			<button class="absolute top-5 right-5 text-red-500 hover:text-red-700" on:click={deleteNote}>
				<!-- Delete icon (replace with your preferred icon) -->
				<Icon icon="mage:trash-2" font-size="20px" />
			</button>

			<!-- Note Content -->
			<h1 class="text-2xl font-bold mb-4">{selectedNote.title}</h1>
			<p class="text-white-700 mb-8 whitespace-pre-wrap">{selectedNote.content}</p>

			<!-- Favorite and Archive Icons (Bottom Right) -->
			<!-- <div class="flex ml-[auto] space-x-4">
				<button class="text-yellow-500 hover:text-yellow-700" on:click={toggleFavorite}>
					<Icon
						icon={selectedNote.isFavorite ? 'ph:heart-fill' : 'ph:heart-light'}
						font-size="20px"
					/>
				</button>
				<button class="text-blue-500 hover:text-blue-700" on:click={toggleArchive}>
					<Icon
						icon={selectedNote.isArchived
							? 'material-symbols-light:archive'
							: 'material-symbols-light:archive-outline'}
						font-size="20px"
					/>
				</button>
			</div> -->
		{:else}
			<!-- Not Found Content -->
			<div class="flex justify-center items-center h-[70vh]">
				<h1 class="text-4xl font-bold text-white-600 text-center">
					Oops, looks like what you're looking for doesn't exist.
				</h1>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	/* Modal Styling */
	.backdrop-blur-sm {
		backdrop-filter: blur(10px);
	}

	/* Ensures modal height is large enough for the "Not Found" message */
	/* .h-[70vh] {
		height: 70vh;
	} */
</style>
