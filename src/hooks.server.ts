import 'reflect-metadata';
import { SvelteKitAuth } from '@auth/sveltekit';
import GoogleProvider from '@auth/core/providers/google';
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	AUTH_TYPEORM_CONNECTION
} from '$env/static/private';
import { TypeORMAdapter } from '@auth/typeorm-adapter';
import { AccountEntity, SessionEntity, UserEntity, VerificationTokenEntity } from '$lib/entities/';

export const { handle } = SvelteKitAuth({
	adapter: TypeORMAdapter({
		type: 'postgres',
		url: AUTH_TYPEORM_CONNECTION,
		synchronize: true, // Set to false in production and use migrations
		logging: true,
		entities: [UserEntity, AccountEntity, SessionEntity, VerificationTokenEntity]
	}),
	providers: [
		GoogleProvider({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,

			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code'
				}
			}
		})
	],
	callbacks: {}
});
