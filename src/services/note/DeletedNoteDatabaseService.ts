import DinoDatabase from "../../database/DinoDatabase"
import DeletedNoteEntity from "../../types/note/database/DeletedNoteEntity"
import NoteEntity from "../../types/note/database/NoteEntity"
import DeletedNoteEntityWithoutExternalId from "../../error/DeletedNoteEntityWithoutExternalId"

class DeletedNoteDatabaseService {
    async getAll(): Promise<DeletedNoteEntity[]> {
        return DinoDatabase.deletedNote.toArray()
    }

    async add(note: NoteEntity) {
        const deletedNote = this.createDeletedNoteEntity(note)

        if (deletedNote) {
            const id = await DinoDatabase.deletedNote.add(deletedNote)
            deletedNote.id = id
        }
    }

    async addAll(notes: NoteEntity[]): Promise<number> {
        const deletedNotes = notes.map(note => this.createDeletedNoteEntity(note))

        return DinoDatabase.deletedNote.bulkAdd(deletedNotes)
    }

    async deleteById(id: number): Promise<DeletedNoteEntity | undefined> {
        const query = DinoDatabase.deletedNote.where("id").equals(id)

        const note = await query.first()

        await query.delete()

        return note
    }

    async deleteAll() {
        return DinoDatabase.deletedNote.clear()
    }

    private createDeletedNoteEntity(note: NoteEntity): DeletedNoteEntity {
        if (note.external_id) {
            const deletedNote: DeletedNoteEntity = {
                external_id: note.external_id,
                lastUpdate: note.lastOrderUpdate
            }

            return deletedNote
        } else {
            throw new DeletedNoteEntityWithoutExternalId()
        }
    }
}

export default new DeletedNoteDatabaseService()