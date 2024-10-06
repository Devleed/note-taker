<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Fuse from 'fuse.js';
	import NoteList from '../components/NoteList.svelte';
	import AddNote from '../components/AddNote.svelte';
	import { notes, filteredNotes, searchTerm, tabSelected, Tabs } from '../store/'; // Import the notes store
	import type { IFuseOptions } from 'fuse.js';

	import Icon from '@iconify/svelte';
	import type { NoteItem } from '../store/notes';

	let fuse: any = null; // Fuse.js instance

	// Define Fuse.js search options
	const options: IFuseOptions = {
		keys: ['title', 'content'], // Specify the field to search in (assumed that notes have a `content` field)
		ignoreLocation: true,
		threshold: 0.3
	};

	// Reactive block to initialize Fuse.js whenever `notes` change
	$: {
		if ($notes.length && $tabSelected) {
			// Reinitialize Fuse.js with the latest notes
			fuse = new Fuse(
				filterNotesBasedOnTab($notes, $tabSelected).map((note) => ({
					content: note.content,
					title: note.title,
					item: note
				})),
				options
			);
			updateFilteredNotes(); // Immediately update filtered notes after initializing Fuse.js
		}
	}

	// Function to update filtered notes based on the current search term
	function updateFilteredNotes() {
		if ($searchTerm.trim()) {
			type FuseResult = {
				item: { item: NoteItem };
			}[];

			const result: FuseResult = fuse.search($searchTerm); // Perform search on the notes
			filteredNotes.set(result.map((r) => r.item.item)); // Update `filteredNotes` store
		} else {
			filteredNotes.set($notes); // If no search term, show all notes
		}
	}

	// Reactive block to run whenever `searchTerm` changes
	$: {
		if (fuse && $searchTerm.trim() && $tabSelected) {
			// Explicit reference to `$searchTerm`
			updateFilteredNotes(); // Perform search and update filtered notes when the search term changes
		} else if (fuse) {
			filteredNotes.set(filterNotesBasedOnTab($notes, $tabSelected)); // If no search term, show all notes
		}
	}

	// Global keydown event handler
	const handleGlobalKeydown = (e: any) => {
		const targetTag = e.target.tagName.toLowerCase();
		if (targetTag !== 'input' && targetTag !== 'textarea') {
			if (!e.key.match(/^\w$/) && e.key !== 'Backspace' && e.key !== ' ') return;

			if (e.key === 'Backspace') {
				searchTerm.update((value) => value.slice(0, -1));
			} else {
				searchTerm.update((value) => value + e.key);
			}
		}
	};

	const filterNotesBasedOnTab = (notes: NoteItem[], tab: Tabs) => {
		return notes.filter((note) => {
			if (tab === Tabs.Favorites) return note.isFavorite;
			if (tab === Tabs.Archived) return note.isArchived;
			return true;
		});
	};

	onMount(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleGlobalKeydown);
		}
	});

	// Clean up event listeners only in the browser
	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleGlobalKeydown);
		}
	});
</script>

<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<div class="container h-full mx-auto">
	<div class="px-4 py-4">
		<div>
			<AddNote />
		</div>

		<div>
			<NoteList />
		</div>

		{#if $searchTerm && $searchTerm.trim()?.length}
			<div
				class="fixed top-4 right-4 h-[60px] bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center justify-center"
			>
				<!-- <SearchIcon /> -->
				<Icon icon="ic:round-search" />
				<span class="ml-[10px]">{$searchTerm}</span>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	figure {
		@apply flex relative flex-col;
	}
	figure svg,
	.img-bg {
		@apply w-64 h-64 md:w-80 md:h-80;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation:
			pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite,
			glow 5s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-primary-400/50;
		}
		33% {
			@apply bg-secondary-400/50;
		}
		66% {
			@apply bg-tertiary-400/50;
		}
		100% {
			@apply bg-primary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
	}

	.search-text {
		position: fixed;
		top: 60px;
		left: 10px;
	}

	.search-text h1 {
		font-size: 3.5rem;
	}
</style>
