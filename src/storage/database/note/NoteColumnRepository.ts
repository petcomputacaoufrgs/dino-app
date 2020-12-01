import DinoDatabase from '../DinoDatabase'
import NoteColumnEntity from '../../../types/note/database/NoteColumnEntity'

class NoteColumnRepository {
  private table = DinoDatabase.noteColumn

  async getAll(): Promise<NoteColumnEntity[]> {
    return this.table.toArray()
  }

  async getById(id: number): Promise<NoteColumnEntity | undefined> {
    return this.table.where('id').equals(id).first()
  }

  async getByTitle(title: string): Promise<NoteColumnEntity | undefined> {
    return this.table.where('title').equals(title).first()
  }

  async saveExternalIdByTitleAndSavedOnServer(
    title: string,
    externalId: number,
    savedOnServer: boolean
  ): Promise<number> {
    return this.table
      .where('title')
      .equals(title)
      .modify((column) => {
        column.external_id = externalId
        column.savedOnServer = savedOnServer
      })
  }

  async saveExternalIdByIdAndSavedOnServer(
    id: number,
    externalId: number,
    savedOnServer: boolean
  ): Promise<number> {
    return this.table
      .where('id')
      .equals(id)
      .modify((column) => {
        column.external_id = externalId
        column.savedOnServer = savedOnServer
      })
  }

  async put(column: NoteColumnEntity) {
    const id = await this.table.put(column)

    column.id = id
  }

  async putAll(columns: NoteColumnEntity[]) {
    const ids = await DinoDatabase.transaction('readwrite', this.table, () =>
      Promise.all(columns.map((column) => this.table.put(column)))
    )

    columns.forEach((column, index) => (column.id = ids[index]))
  }

  async deleteByTitle(title: string): Promise<number> {
    return this.table.where('title').equals(title).delete()
  }

  async deleteById(id: number): Promise<NoteColumnEntity | undefined> {
    const query = this.table.where('id').equals(id)

    const column = await query.first()

    await query.delete()

    return column
  }

  async deleteByExternalId(
    externalId: number
  ): Promise<NoteColumnEntity | undefined> {
    const query = this.table.where('external_id').equals(externalId)

    const column = await query.first()

    await query.delete()

    return column
  }

  async deleteAllById(ids: number[]) {
    return this.table.where('id').anyOf(ids).delete()
  }

  async deleteAll() {
    return this.table.clear()
  }
}

export default new NoteColumnRepository()
