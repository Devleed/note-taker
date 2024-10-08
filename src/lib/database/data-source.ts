// src/lib/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserEntity, AccountEntity, SessionEntity, VerificationTokenEntity } from './entities';
import { AUTH_TYPEORM_CONNECTION } from '$env/static/private';
import { NoteEntity } from './entities/note.entity';

export const entities = [
	UserEntity,
	AccountEntity,
	SessionEntity,
	VerificationTokenEntity,
	NoteEntity
];

export const AppDataSource = new DataSource({
	type: 'postgres',
	url: AUTH_TYPEORM_CONNECTION,
	synchronize: true, // Set to false in production and use migrations
	logging: true,
	entities
});
