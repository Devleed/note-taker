<script>
	import { page } from '$app/stores';
</script>

<nav class="w-full pl-[50px] pr-[50px] pt-4 pb-4">
	<div class="flex justify-between items-center">
		<!-- Left side (Logo or Brand Name) -->
		<div class="text-white text-2xl font-bold">Nex.io</div>

		<!-- Right side (User Avatar) -->
		<div class="flex items-center space-x-3">
			{#if $page.data.session && $page.data.session?.user}
				<span class="text-white text-lg">{$page.data.session?.user.name}</span>
				<img
					src={$page.data.session?.user.image}
					alt="User Avatar"
					class="w-10 h-10 rounded-full object-cover"
				/>
				<a href="/auth/signout" class="text-white text-lg" data-sveltekit-preload-data="off">
					Sign Out
				</a>
			{:else}
				<a href="/auth/signin" class="text-white text-lg" data-sveltekit-preload-data="off">
					Sign in
				</a>
			{/if}
		</div>
	</div>
</nav>

<style>
</style>
