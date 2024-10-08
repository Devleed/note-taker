import type { RequestEvent } from '../$types.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GET: (opts: RequestEvent) => void = async ({ locals }) => {
	const session = await locals.auth();

	console.log('hell o- ', session?.user);
};
