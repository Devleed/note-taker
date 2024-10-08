<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	import { filteredNotes, Tabs, tabSelected } from '../store/'; // Import the notes store
	import Note from './Note.svelte';
	import Icon from '@iconify/svelte';

	console.log('🚀 ~ $filteredNotes:', $filteredNotes);
</script>

<div class="mt-[50px]">
	<TabGroup>
		<Tab bind:group={$tabSelected} name="tab1" value={Tabs.All}>
			<div class="flex flex-row items-center justify-center">
				<Icon icon="solar:notes-bold" font-size="25px" />
				<span class="ml-[10px]">All</span>
			</div>
		</Tab>
		<Tab bind:group={$tabSelected} name="tab2" value={Tabs.Favorites}>
			<div class="flex flex-row items-center justify-center">
				<Icon icon="ph:heart-fill" font-size="25px" />
				<span class="ml-[10px]">Favorites</span>
			</div>
		</Tab>
		<Tab bind:group={$tabSelected} name="tab3" value={Tabs.Archived}>
			<div class="flex flex-row items-center justify-center">
				<Icon icon="material-symbols-light:archive" font-size="25px" />
				<span class="ml-[10px]">Archived</span>
			</div>
		</Tab>
		<!-- Tab Panels --->
		<svelte:fragment slot="panel">
			<div class="flex flex-wrap gap-4 p-4">
				{#each $filteredNotes as note}
					<Note {note} />
				{/each}
			</div>
		</svelte:fragment>
	</TabGroup>
</div>

<style>
</style>
