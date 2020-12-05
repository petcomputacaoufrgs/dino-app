import Database from '../Database'
import DeletedNoteEntity from '../../../types/note/database/DeletedNoteEntity'
import NoteEntity from '../../../types/note/database/NoteEntity'
import DeletedNoteEntityWithoutExternalId from '../../../error/note/DeletedNoteEntityWithoutExternalId'

class DeletedNoteRepository {
  private table = Database.deletedNote

  async getAll(): Promise<DeletedNoteEntity[]> {
    return this.table.toArray()
  }

  async add(note: NoteEntity) {
    const deletedNote = this.createDeletedNoteEntity(note)

    if (deletedNote) {
      const id = await this.table.add(deletedNote)
      deletedNote.id = id
    }
  }

  async addAll(notes: NoteEntity[]): Promise<number> {
    const deletedNotes = notes.map((note) => this.createDeletedNoteEntity(note))

    return this.table.bulkAdd(deletedNotes)
  }

  async deleteById(id: number): Promise<DeletedNoteEntity | undefined> {
    const query = this.table.where('id').equals(id)

    const note = await query.first()

    await query.delete()

    return note
  }

  async deleteAll() {
    return this.table.clear()
  }

  private createDeletedNoteEntity(note: NoteEntity): DeletedNoteEntity {
    if (note.external_id) {
      const deletedNote: DeletedNoteEntity = {
        external_id: note.external_id,
        lastUpdate: note.lastUpdate,
      }

      return deletedNote
    } else {
      throw new DeletedNoteEntityWithoutExternalId()
    }
  }
}

export default new DeletedNoteRepository()
