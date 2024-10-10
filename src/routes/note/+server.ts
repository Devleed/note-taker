import { AppDataSource } from '$lib/database/data-source';
import { UserEntity } from '$lib/database/entities';
import { NoteEntity } from '$lib/database/entities/note.entity';
import { NoteUserEntity } from '$lib/database/entities/noteUser.entity.js';
import { json } from '@sveltejs/kit';
import type { NoteItemResponse } from '../../store/notes';

export const GET = async ({ locals }) => {
	try {
		const session = await locals.auth();
		const userId = session?.user?.id;

		if (!userId) {
			return json({ error: 'User is not authenticated' }, { status: 401 });
		}

		const rawQuery = `
			SELECT n.id, n.title, n.content, n."createdAt", n."updatedAt", n."ownerId",
			json_agg(json_build_object('id', u.id, 'image', u.image, 'dateShared', nnu."dateShared", 'isOwner', nnu."isOwner", 'isFavorite', nnu."isFavorite", 'isArchived', nnu."isArchived")
			ORDER BY 
				CASE WHEN u.id = $1 THEN 0 ELSE 1 END,
				nnu."dateShared" DESC) FILTER (WHERE nnu."userId" IS NOT NULL) AS users
			FROM notes n
			LEFT JOIN LATERAL (
				SELECT *
				FROM note_users nnu
				WHERE nnu."noteId" = n.id
				LIMIT 5
			) nnu ON true
			LEFT JOIN note_users nu ON n.id = nu."noteId"
			LEFT JOIN users u ON u.id = nnu."userId"
			WHERE nu."userId"=$1
			GROUP BY n.id, n."ownerId"
			ORDER BY n."createdAt" DESC
		`;

		const allNotes: NoteItemResponse[] = await AppDataSource.query(rawQuery, [userId]);

		return json(allNotes);
	} catch (error) {
		console.error('Error fetching notes:', error);
		return json({ error: 'Failed to retrieve notes' }, { status: 500 });
	}
};

export const POST = async ({ request, locals }) => {
	const { title, content } = await request.json();

	const session = await locals.auth();
	const user = session?.user;
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	const userRepository = AppDataSource.getRepository(UserEntity);

	const dbUser = await userRepository.findOneBy({ id: user.id });

	if (!dbUser) {
		return json({ error: 'User not found' }, { status: 404 });
	}

	const note = new NoteEntity();
	note.title = title;
	note.content = content;
	note.owner = dbUser;

	const savedNote = await AppDataSource.getRepository(NoteEntity).save(note);

	const noteUser = new NoteUserEntity();
	noteUser.note = savedNote;
	noteUser.user = dbUser;
	noteUser.isFavorite = false;
	noteUser.isArchived = false;
	noteUser.isOwner = true;

	await AppDataSource.getRepository(NoteUserEntity).save(noteUser);

	return json(savedNote);
};

export const DELETE = async ({ request }) => {
	try {
		const { noteIds } = await request.json();

		if (!noteIds || !Array.isArray(noteIds) || noteIds.length === 0) {
			return json({ error: 'Invalid or missing noteIds array' }, { status: 400 });
		}

		// Access the note repository
		const noteRepository = AppDataSource.getRepository(NoteEntity);

		// Delete notes by IDs
		await noteRepository.delete(noteIds);

		return json({ message: 'Selected notes deleted successfully' });
	} catch (error) {
		console.error('Error deleting notes:', error);
		return json({ error: 'Failed to delete notes' }, { status: 500 });
	}
};

export const PUT = async ({ request, locals }) => {
	try {
		const { id, content, isFavorite, isArchived } = await request.json();
		const session = await locals.auth();

		const user = session?.user;

		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const noteRepository = AppDataSource.getRepository(NoteEntity);

		const note = await noteRepository.findOneBy({ id });

		if (!note) {
			return json({ error: 'Note not found' }, { status: 404 });
		}

		const noteUserRepository = AppDataSource.getRepository(NoteUserEntity);

		const noteUser = await noteUserRepository.findOneBy({ noteId: note.id, userId: user.id });

		if (!noteUser) {
			return json({ error: 'Note User relationship not found' }, { status: 404 });
		}

		if (content !== undefined) note.content = content;
		if (isFavorite !== undefined) noteUser.isFavorite = isFavorite;
		if (isArchived !== undefined) noteUser.isArchived = isArchived;

		await Promise.all([noteRepository.save(note), noteUserRepository.save(noteUser)]);

		return json({ message: 'Note updated successfully', success: true });
	} catch (error) {
		console.error('Error updating note:', error);
		return json({ error: 'Failed to update note', success: false }, { status: 500 });
	}
};
