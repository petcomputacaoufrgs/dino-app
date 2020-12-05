import Database from '../Database'
import DeletedNoteColumnEntity from '../../../types/note/database/DeletedNoteColumnEntity'
import NoteColumnEntity from '../../../types/note/database/NoteColumnEntity'
import DeletedNoteColumnEntityWithoutExternalId from '../../../error/note/DeletedNoteColumnEntityWithoutExternalId'

class DeletedNoteColumnRepository {
  private table = Database.deletedNoteColumn

  async getAll(): Promise<DeletedNoteColumnEntity[]> {
    return this.table.toArray()
  }

  async getById(id: number): Promise<DeletedNoteColumnEntity | undefined> {
    return this.table.where('id').equals(id).first()
  }

  async add(deletedColumn: NoteColumnEntity) {
    const newDeletedColumn = this.createDeletedNoteColumn(deletedColumn)

    if (newDeletedColumn) {
      const id = await this.table.add(newDeletedColumn)
      newDeletedColumn.id = id
    }
  }

  async deleteById(id: number): Promise<number> {
    return this.table.where('id').equals(id).delete()
  }

  async deleteAll() {
    return this.table.clear()
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

export default new DeletedNoteColumnRepository()
