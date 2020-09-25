import DinoDatabase from "../../database/DinoDatabase"
import NoteEntity from "../../types/note/database/NoteEntity"
import ArrayUtils from "../../utils/ArrayUtils"

class NoteDatabaseService {
    async getById(id: number): Promise<NoteEntity | undefined> {
        return DinoDatabase.note.where("id").equals(id).first()
    }

    async getByQuestion(question: string): Promise<NoteEntity | undefined> {
        return DinoDatabase.note.where("question").equals(question).first()
    }

    async getAllById(ids: number[]): Promise<NoteEntity[]> {
        return DinoDatabase.note.where("id").anyOf(ids).toArray()
    }

    async getAll(): Promise<NoteEntity[]> {
        return DinoDatabase.note.toArray()
    }

    async getAllTags(): Promise<string[]> {
        const notes = await this.getAll()
        const notesTags = notes.map(note => note.tagNames)
        const tags = ArrayUtils.merge(notesTags)

        return ArrayUtils.removeRepeatedValues(tags)
    }

    async saveExternalIdById(id: number, externalId: number) {
        return DinoDatabase.note.where("id").equals(id).modify(note => {
            note.external_id = externalId
        })
    }

    async put(entity: NoteEntity) {
        const id = await DinoDatabase.note.put(entity)

        entity.id = id
    }

    async putAll(entities: NoteEntity[]) {
        const ids = await DinoDatabase.transaction('readwrite', DinoDatabase.note, () =>
            Promise.all(entities.map((entity) => DinoDatabase.note.put(entity)))
        )

        entities.forEach((entity, index) => (entity.id = ids[index]))
    }

    async updateColumnTitle(newColumnTitle: string, oldCclumnTitle: string) {
        return DinoDatabase.note.where("columnTitle").equals(oldCclumnTitle).modify(note => {
            note.columnTitle = newColumnTitle
        })
    }

    async deleteByColumnTitle(columnTitle: string): Promise<NoteEntity[]> {
        const query = DinoDatabase.note.where("columnTitle").equals(columnTitle)

        const notes = await query.toArray()

        await query.delete()

        return notes
    }

    async deleteById(id: number): Promise<NoteEntity | undefined> {
        const query = DinoDatabase.note.where("id").equals(id)

        const note = await query.first()

        await query.delete()

        return note
    }

    async deleteByExternalIds(ids: number[]): Promise<number> {
        return DinoDatabase.note.where("external_id").anyOf(ids).delete()
    }

    async deleteAll() {
        return DinoDatabase.note.clear()
    }
}

export default new NoteDatabaseService()