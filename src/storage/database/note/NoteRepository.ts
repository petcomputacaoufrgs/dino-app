import DinoDatabase from '../DinoDatabase'
import NoteEntity from '../../../types/note/database/NoteEntity'
import ArrayUtils from '../../../utils/ArrayUtils'

class NoteRepository {
  private table = DinoDatabase.note

  async getById(id: number): Promise<NoteEntity | undefined> {
    return this.table.where('id').equals(id).first()
  }

  async getByQuestion(question: string): Promise<NoteEntity | undefined> {
    return this.table.where('question').equals(question).first()
  }

  async getAllById(ids: number[]): Promise<NoteEntity[]> {
    return this.table.where('id').anyOf(ids).toArray()
  }

  async getAll(): Promise<NoteEntity[]> {
    return this.table.toArray()
  }

  async getAllTags(): Promise<string[]> {
    const notes = await this.getAll()
    const notesTags = notes.map((note) => note.tagNames)
    const tags = ArrayUtils.merge(notesTags)

    return ArrayUtils.removeRepeatedValues(tags)
  }

  async saveExternalIdByQuestionAndSavedOnServer(
    question: string,
    externalId: number,
    savedOnServer: boolean
  ): Promise<number> {
    return this.table
      .where('question')
      .equals(question)
      .modify((note) => {
        note.external_id = externalId
        note.savedOnServer = savedOnServer
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
      .modify((note) => {
        note.external_id = externalId
        note.savedOnServer = savedOnServer
      })
  }

  async put(entity: NoteEntity) {
    const id = await this.table.put(entity)

    entity.id = id
  }

  async putAll(entities: NoteEntity[]) {
    const ids = await DinoDatabase.transaction('readwrite', this.table, () =>
      Promise.all(entities.map((entity) => this.table.put(entity)))
    )

    entities.forEach((entity, index) => (entity.id = ids[index]))
  }

  async updateColumnTitle(newColumnTitle: string, oldCclumnTitle: string) {
    return this.table
      .where('columnTitle')
      .equals(oldCclumnTitle)
      .modify((note) => {
        note.columnTitle = newColumnTitle
      })
  }

  async deleteByColumnTitle(columnTitle: string): Promise<NoteEntity[]> {
    const query = this.table.where('columnTitle').equals(columnTitle)

    const notes = await query.toArray()

    await query.delete()

    return notes
  }

  async deleteById(id: number): Promise<NoteEntity | undefined> {
    const query = this.table.where('id').equals(id)

    const note = await query.first()

    await query.delete()

    return note
  }

  async deleteByExternalIds(ids: number[]): Promise<number> {
    return this.table.where('external_id').anyOf(ids).delete()
  }

  async deleteAllById(ids: number[]) {
    return this.table.where('id').anyOf(ids).delete()
  }

  async deleteAll() {
    return this.table.clear()
  }
}

export default new NoteRepository()
