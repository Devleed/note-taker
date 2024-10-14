<!-- Note.svelte -->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import { NoteItem, type NoteItemResponse } from '../store/notes';
	import { notes, searchTerm, syncNotes } from '../store';
	import ShareNoteToEmailsModal from './ShareNoteToEmailsModal.svelte';
	import NoteOptionsDrawer from './NoteOptionsDrawer.svelte';

	export let note: NoteItemResponse;
	let showShareModal = false;
	let showOptionsDrawer = false;
	let editedContent = note.content;

	const saveContent = async () => {
		const noteInstance = { ...note };

		if (noteInstance.content === editedContent) {
			return;
		}

		noteInstance.content = editedContent;

		updateNote(noteInstance);

		try {
			// Make an API call to update the note in DB
			// ? On Success, do nothing
			await fetch('/note', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: noteInstance.id,
					content: editedContent
				})
			});
		} catch (error) {
			console.error('error while updating note content ->', error);
		} finally {
			syncNotes();
		}

		// note.content = editedContent;
	};

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
				body: JSON.stringify({ noteId: note.id })
			});
		} catch (error: any) {
			// ? On Error, add the note back in store
			// notes.update(existingNotes => [...existingNotes, note]); // Remove the note on failure
			console.error('error while deleting note ->', error);
		} finally {
			syncNotes();
		}
	};

	const openOptionsDrawer = () => {
		showOptionsDrawer = true;
	};
	const closeOptionsDrawer = () => {
		showOptionsDrawer = false;
	};

	const addNoteToArchive = async () => {
		const noteInstance = { ...note };

		if (noteInstance.users[0].isArchived) {
			noteInstance.users[0].isArchived = false;
		} else {
			noteInstance.users[0].isArchived = true;
		}

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
					isArchived: noteInstance.users[0].isArchived
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
		const noteInstance = { ...note };

		if (noteInstance.users[0].isFavorite) {
			noteInstance.users[0].isFavorite = false;
		} else {
			noteInstance.users[0].isFavorite = true;
		}

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
					isFavorite: noteInstance.users[0].isFavorite
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

	const updateNote = (noteInstance: NoteItemResponse) => {
		notes.update((existingNotes) => {
			return existingNotes.map((n) => {
				return n.id === noteInstance.id ? noteInstance : n;
			});
		});
	};

	// Function to open the modal
	const openShareModal = () => {
		showShareModal = true;
	};
	const closeShareModal = () => {
		showShareModal = false;
	};
</script>

<NoteOptionsDrawer {note} showDrawer={showOptionsDrawer} on:close={closeOptionsDrawer} />
<ShareNoteToEmailsModal noteId={note.id} showModal={showShareModal} on:close={closeShareModal} />
<div
	class="relative p-6 rounded-lg w-80 h-[25rem] border border-{note.users[0].isOwner
		? 'red'
		: 'gray'}-600 group overflow-visible"
>
	<div class="gradient w-[85%] h-[80px]"></div>

	<div class="w-[95%] h-[85%] overflow-y-scroll scrollbar-hide">
		<!-- Editable textarea for multiline input with whitespace-preserving styles -->
		<textarea
			bind:value={editedContent}
			class="w-full h-full scrollbar-hide p-[0px] border-none resize-none bg-transparent"
			on:blur={saveContent}
			style="border:none; outline:none box-shadow:none;"
		></textarea>
	</div>

	<button
		on:click={openOptionsDrawer}
		class="absolute top-5 right-5 text-gray-300 hidden group-hover:block group-hover:text-gray-500 transition-colors duration-800"
	>
		<!-- {#if note.users[0].isOwner}
			<Icon icon="mage:trash-2" font-size="20px" />
		{:else}
			<Icon icon="bx:unlink" font-size="20px" />
		{/if} -->
		<Icon icon="mi:options-vertical" font-size="20px" />
	</button>

	<div
		class="w-[87%] hidden flex flex-row align-center absolute bottom-8 right-5 group-hover:flex duration-800"
	>
		<div class="text-gray-500" style="margin-right: auto; font-size: 14px;">
			{new Date(note.updatedAt).toDateString()}
		</div>
		<div class="text-gray-500 flex flex-row align-center">
			<a href="/note/{note.id}" target="_blank" style="margin-top: 2px;">
				<Icon icon="mdi:eye-outline" font-size="20px" />
			</a>

			<button class="" on:click={addNoteToArchive}>
				<Icon
					icon={note.users[0].isArchived
						? 'material-symbols-light:archive'
						: 'material-symbols-light:archive-outline'}
					font-size="20px"
				/>
			</button>

			<button class="" on:click={addNoteToFavorite}>
				<Icon
					icon={note.users[0].isFavorite ? 'ph:heart-fill' : 'ph:heart-light'}
					font-size="20px"
				/>
			</button>

			{#if note.users[0].isOwner}
				<button class="" on:click={openShareModal}>
					<Icon icon="bitcoin-icons:share-outline" font-size="20px" />
				</button>
			{/if}
		</div>
	</div>

	{#if note.users.length > 1}
		<div
			class="absolute flex flex-row items-center bottom-[-20px] right-0 h-[40px] p-2 mr-[5px] shared-users-container"
		>
			{#each note.users as user, index}
				{#if index !== 0}
					<img
						src={user.image}
						alt={user.id.slice(0, 2)}
						class="w-8 h-8 rounded-full object-cover {index > 1 ? '-ml-2' : ''}"
					/>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style>
	.shared-users-container {
		background-color: rgb(var(--color-surface-900));
	}

	.gradient {
		/* background: linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(var(--color-surface-900), 1) 100%); */
		background: linear-gradient(transparent, rgb(var(--color-surface-900)));
		position: absolute;
		bottom: 70px;
	}
</style>
