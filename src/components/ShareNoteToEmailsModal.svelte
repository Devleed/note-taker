<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let showModal = false;
	export let noteId: string;
	let emailInput = '';
	let emails: string[] = [];

	const dispatch = createEventDispatcher();

	const closeModal = () => {
		dispatch('close');
	};

	const handleEmailInput = (e: any) => {
		const value = e.target.value.trim();

		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			addEmail(value);
		}
	};

	const addEmail = (email: string) => {
		if (validateEmail(email) && !emails.includes(email)) {
			emails = [...emails, email];
		}
		emailInput = '';
	};

	const removeEmail = (index: number) => {
		emails = emails.filter((_, i) => i !== index);
	};

	const validateEmail = (email: string) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

	const submitEmails = async () => {
		if (emails.length === 0) return;

		try {
			const response = await fetch('/note/share/emails', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ emails, noteId })
			});

			if (response.ok) {
				console.log('Emails submitted successfully');
				// Close modal or handle success as needed
				closeModal();
			} else {
				console.error('Failed to submit emails');
			}
		} catch (error) {
			console.error('Error submitting emails:', error);
		}
	};
</script>

{#if showModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50"
		on:click={closeModal}
	>
		<!-- Modal Content -->
		<div
			class="w-3/4 md:w-1/2 p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto"
			on:click|stopPropagation
		>
			<h2 class="text-2xl font-bold mb-4">Enter Emails</h2>

			<!-- Email Tag Display and Input -->
			<div class="flex flex-wrap rounded">
				{#each emails as email, index}
					<div class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center mr-2 mb-2">
						{email}
						<button on:click={() => removeEmail(index)} class="ml-2 text-blue-600 font-bold"
							>x</button
						>
					</div>
				{/each}

				<input
					type="text"
					bind:value={emailInput}
					on:keydown={handleEmailInput}
					placeholder="Type email and press Enter"
					class="flex-1 p-2 outline-none"
				/>
			</div>

			<button
				class="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full disabled:bg-gray-400"
				on:click={submitEmails}
				disabled={emails.length === 0}
			>
				Share
			</button>
		</div>
	</div>
{/if}

<style>
	.backdrop-blur-sm {
		backdrop-filter: blur(10px);
	}

	input[type='text'] {
		min-width: 100px;
		color: black;
	}
</style>
