import DinoDatabase from '../../database/DinoDatabase'
import DeletedNoteColumnEntity from '../../types/note/database/DeletedNoteColumnEntity'
import NoteColumnEntity from '../../types/note/database/NoteColumnEntity'
import DeletedNoteColumnEntityWithoutExternalId from '../../error/note/DeletedNoteColumnEntityWithoutExternalId'

class DeletedNoteColumnDatabaseService {
  async getAll(): Promise<DeletedNoteColumnEntity[]> {
    return DinoDatabase.deletedNoteColumn.toArray()
  }

  async getById(id: number): Promise<DeletedNoteColumnEntity | undefined> {
    return DinoDatabase.deletedNoteColumn.where('id').equals(id).first()
  }

  async add(deletedColumn: NoteColumnEntity) {
    const newDeletedColumn = this.createDeletedNoteColumn(deletedColumn)

    if (newDeletedColumn) {
      const id = await DinoDatabase.deletedNoteColumn.add(newDeletedColumn)
      newDeletedColumn.id = id
    }
  }

  async deleteById(id: number): Promise<number> {
    return DinoDatabase.deletedNoteColumn.where('id').equals(id).delete()
  }

  async deleteAll() {
    return DinoDatabase.deletedNoteColumn.clear()
  }

  private createDeletedNoteColumn(
    noteColumn: NoteColumnEntity
  ): DeletedNoteColumnEntity {
    if (noteColumn.external_id !== undefined) {
      const newDeletedColumn: DeletedNoteColumnEntity = {
        external_id: noteColumn.external_id,
        lastUpdate: noteColumn.lastUpdate,
      }

      return newDeletedColumn
    }

    throw new DeletedNoteColumnEntityWithoutExternalId()
  }
}

export default new DeletedNoteColumnDatabaseService()
