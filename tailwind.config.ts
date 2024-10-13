/* eslint-disable @typescript-eslint/no-require-imports */
import { join } from 'path';
import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';
import { skeleton } from '@skeletonlabs/tw-plugin';

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			lineClamp: {
				8: '8',
				10: '10'
			}
		}
	},
	plugins: [
		require('tailwind-scrollbar-hide'),
		typography,
		forms,
		skeleton({
			themes: {
				preset: [
					{
						name: 'skeleton',
						enhancements: true
					},
					{
						name: 'vintage',
						enhancements: true
					},
					{
						name: 'seafoam',
						enhancements: true
					},
					{
						name: 'crimson',
						enhancements: true
					}
				]
			}
		})
	]
} satisfies Config;
