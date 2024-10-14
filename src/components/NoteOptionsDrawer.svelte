<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';
	import type { NoteItemResponse } from '../store/notes';

	export let showDrawer: boolean;
	export let note: NoteItemResponse;

	const dispatch = createEventDispatcher();

	const closeModal = () => {
		dispatch('close');
	};
</script>

<div class={`fixed inset-0 z-40 ${showDrawer ? 'block' : 'hidden'}`}>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div on:click={closeModal} class="fixed inset-0 bg-black bg-opacity-50"></div>
	<div
		class={`drawer-container fixed top-0 right-0 h-full w-[30rem] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${showDrawer ? 'translate-x-0' : 'translate-x-full'}`}
	>
		<div class="p-8">
			<a href="http://localhost:5173/note/{note.id}" target="_blank">
				<h2 class="text-4xl font-bold mb-[80px]">
					http://localhost.....{note.id.slice(-5)}
				</h2>
			</a>

			<!-- Drawer Content -->
			<div class="space-y-6">
				<div class="mb-[60px]">
					<div class="border-b border-gray-300 mb-4">
						<h3 class="text-3xl font-semibold text-lg">Locking</h3>
						<p class="text-gray-500 mb-2">Control who can edit the content of your note.</p>
					</div>
					<div class="space-y-2">
						<label class="flex items-center space-x-2">
							<input class="radio" type="radio" checked name="locking-options" value="1" />
							<p>Only owner</p>
						</label>
						<label class="flex items-center space-x-2">
							<input class="radio" type="radio" name="locking-options" value="2" />
							<p>Everyone</p>
						</label>
						<label class="flex items-center space-x-2">
							<input class="radio" type="radio" name="locking-options" value="3" />
							<p>No one</p>
						</label>
					</div>
				</div>

				<div class="mb-[60px]">
					<div class="border-b border-gray-300 mb-4">
						<h3 class="text-3xl font-semibold text-lg">Sharing</h3>
						<p class="text-gray-500 mb-2">Control who can share your note.</p>
					</div>
					<div class="space-y-2">
						<label class="flex items-center space-x-2">
							<input class="radio" type="radio" checked name="sharing-options" value="1" />
							<p>Only owner</p>
						</label>
						<label class="flex items-center space-x-2">
							<input class="radio" type="radio" name="sharing-options" value="2" />
							<p>All shared users</p>
						</label>
					</div>
				</div>
			</div>

			<button
				type="button"
				class="w-full mt-8 btn variant-filled"
				style="background-color: {note.users[0].isOwner
					? '#630000'
					: '#00499c'}; border-radius: 5px;"
			>
				{#if note.users[0].isOwner}
					<h2 class="text-2xl font-bold text-white">Delete</h2>
				{:else}
					<h2 class="text-2xl font-bold text-white">Unlink</h2>
				{/if}
			</button>
		</div>
	</div>
</div>

<style>
	.drawer-container {
		background-color: rgb(var(--color-surface-900));
	}
</style>
