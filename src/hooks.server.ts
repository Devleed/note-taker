import 'reflect-metadata';
import { SvelteKitAuth } from '@auth/sveltekit';
import GoogleProvider from '@auth/core/providers/google';
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	AUTH_TYPEORM_CONNECTION
} from '$env/static/private';
import { TypeORMAdapter } from '@auth/typeorm-adapter';
import { UserEntity } from '$lib/database/entities';
import { AppDataSource } from '$lib/database/data-source';

AppDataSource.initialize()
	.then(() => {
		console.log('Data Source has been initialized!');
	})
	.catch((error) => {
		console.error('Error during Data Source initialization:', error);
	});

export const { handle } = SvelteKitAuth({
	adapter: TypeORMAdapter({
		type: 'postgres',
		url: AUTH_TYPEORM_CONNECTION,
		synchronize: true, // Set to false in production and use migrations
		logging: true,
		// entities: [UserEntity, AccountEntity, SessionEntity, VerificationTokenEntity]
		entities: ['src/lib/database/entities/*.entity.{js,ts}']
	}),
	providers: [
		GoogleProvider({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code'
				}
			}
		})
	],
	callbacks: {
		async signIn({ profile }) {
			console.log('🚀 ~ signIn ~ profile:', profile);
			if (!profile) throw new Error('No profile found');

			const userRepository = AppDataSource.getRepository(UserEntity);
			let user = await userRepository.findOneBy({ email: profile.email! });

			if (!user) {
				user = new UserEntity();
				user.email = profile.email!;
				user.name = profile.name!;
				user.image = profile.picture;
				await userRepository.save(user);
			}

			return true;
		},
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session }) {
			return session;
		}
	}
});
