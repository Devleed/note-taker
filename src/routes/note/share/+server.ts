// src/routes/api/notes/share/+server.ts
import { json } from '@sveltejs/kit';
import { AppDataSource } from '$lib/database/data-source';
import { NoteUserEntity, NoteEntity, UserEntity } from '$lib/database/entities';

export const POST = async ({ request }) => {
	try {
		const { noteId, userId } = await request.json();

		if (!noteId || !userId) {
			return json({ error: 'Note ID and User ID are required' }, { status: 400 });
		}

		const noteRepository = AppDataSource.getRepository(NoteEntity);
		const userRepository = AppDataSource.getRepository(UserEntity);
		const noteUserRepository = AppDataSource.getRepository(NoteUserEntity);

		const note = await noteRepository.findOneBy({ id: noteId });
		const user = await userRepository.findOneBy({ id: userId });

		if (!note || !user) {
			return json({ error: 'Note or User not found' }, { status: 404 });
		}

		// Check if the user already has access to the note
		const existingNoteUser = await noteUserRepository.findOneBy({
			noteId: note.id,
			userId: user.id
		});

		if (!existingNoteUser) {
			const noteUser = new NoteUserEntity();
			noteUser.note = note;
			noteUser.user = user;
			await noteUserRepository.save(noteUser);
		}

		return json({ message: 'Note shared successfully' });
	} catch (error) {
		console.error('Error sharing note:', error);
		return json({ error: 'Failed to share note' }, { status: 500 });
	}
};
