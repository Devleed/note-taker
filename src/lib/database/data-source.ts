// src/lib/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
	UserEntity,
	AccountEntity,
	SessionEntity,
	VerificationTokenEntity,
	NoteEntity,
	NoteUserEntity
} from './entities';
import { AUTH_TYPEORM_CONNECTION } from '$env/static/private';

export const entities = [
	UserEntity,
	AccountEntity,
	SessionEntity,
	VerificationTokenEntity,
	NoteEntity,
	NoteUserEntity
];

export const AppDataSource = new DataSource({
	type: 'postgres',
	url: AUTH_TYPEORM_CONNECTION,
	logging: true,
	entities
});
