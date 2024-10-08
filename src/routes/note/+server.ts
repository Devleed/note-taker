import { AppDataSource } from '$lib/database/data-source';
import { NoteEntity } from '$lib/database/entities/note.entity';
import { json } from '@sveltejs/kit';

export const GET = async ({ locals }) => {
	const session = await locals.auth();

	if (!session?.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const notes = await AppDataSource.getRepository(NoteEntity).find({
		where: { authorId: session.user.id },
		order: {
			createdAt: 'DESC'
		}
	});
	return json(notes);
};

export const POST = async ({ request, locals }) => {
	const { title, content } = await request.json();

	const session = await locals.auth();
	const user = session?.user;
	if (!user) return json({ error: 'Unauthorized' }, { status: 401 });

	const note = new NoteEntity();
	note.title = title;
	note.content = content;
	note.authorId = user.id!;

	await AppDataSource.getRepository(NoteEntity).save(note);
	return json(note);
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

export const PUT = async ({ request }) => {
	try {
		// Parse the note ID and updated fields from the request body
		const { id, content, isFavorite, isArchived } = await request.json();

		if (!id) {
			return json({ error: 'Note ID is required' }, { status: 400 });
		}

		// Access the note repository
		const noteRepository = AppDataSource.getRepository(NoteEntity);

		// Find the note by ID
		const note = await noteRepository.findOneBy({ id });

		if (!note) {
			return json({ error: 'Note not found' }, { status: 404 });
		}

		// Update the note's fields only if they are provided in the request
		if (content !== undefined) note.content = content;
		if (isFavorite !== undefined) note.isFavorite = isFavorite;
		if (isArchived !== undefined) note.isArchived = isArchived;

		// Save the updated note
		const savedNote = await noteRepository.save(note);

		return json({ message: 'Note updated successfully', note: savedNote });
	} catch (error) {
		console.error('Error updating note:', error);
		return json({ error: 'Failed to update note' }, { status: 500 });
	}
};
