// src/routes/api/notes/share/+server.ts
import { json } from '@sveltejs/kit';
import { AppDataSource } from '$lib/database/data-source';
import { NoteUserEntity, NoteEntity, UserEntity } from '$lib/database/entities';
import { In } from 'typeorm';

export const POST = async ({ request, locals }) => {
	try {
		const { noteId, emails }: { noteId: string; emails: string[] } = await request.json();

		const session = await locals.auth();
		const userId = session?.user?.id;

		if (!userId) {
			return json({ error: 'User is not authenticated' }, { status: 401 });
		}

		if (!noteId) {
			return json({ error: 'Note ID is required' }, { status: 400 });
		}

		const noteRepository = AppDataSource.getRepository(NoteEntity);

		const note = await noteRepository.findOneBy({ id: noteId });

		if (!note) {
			return json({ error: 'Note not found' }, { status: 404 });
		}

		const noteUserRepository = AppDataSource.getRepository(NoteUserEntity);

		const noteUser = await noteUserRepository.findOneBy({
			noteId: note.id,
			userId
		});

		if (!noteUser) {
			return json({ error: 'Note User relationship not found' }, { status: 404 });
		}

		if (!noteUser.isOwner) {
			return json({ error: 'User is not the owner of the note' }, { status: 403 });
		}

		const userRepository = AppDataSource.getRepository(UserEntity);

		const users = await userRepository.find({
			where: {
				email: In(emails)
			}
		});

		for (const user of users) {
			try {
				await noteUserRepository.insert({
					note,
					user,
					isOwner: false
				});
				console.log(`User ${userId} successfully added to note ${noteId}.`);
			} catch (error) {
				console.error(`Error adding user ${userId} to note ${noteId}:`, error);
			}
		}

		return json({ message: 'Note shared successfully' });
	} catch (error) {
		console.error('Error sharing note:', error);
		return json({ error: 'Failed to share note' }, { status: 500 });
	}
};
