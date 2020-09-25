import DinoDatabase from "../../database/DinoDatabase"
import NoteColumnEntity from "../../types/note/database/NoteColumnEntity"

class NoteColumnDatabaseService {
    async getAll(): Promise<NoteColumnEntity[]> {
        return DinoDatabase.noteColumn.toArray()
    }

    async getById(id: number): Promise<NoteColumnEntity | undefined> {
        return DinoDatabase.noteColumn.where("id").equals(id).first()
    }

    async getByTitle(title: string): Promise<NoteColumnEntity | undefined> {
        return DinoDatabase.noteColumn.where("title").equals(title).first()
    }

    async put(column: NoteColumnEntity) {
        const id = await DinoDatabase.noteColumn.put(column)

        column.id = id
    }

    async putAll(columns: NoteColumnEntity[]) {
        const ids = await DinoDatabase.transaction('rw', DinoDatabase.note, () =>
            Promise.all(columns.map((column) => DinoDatabase.noteColumn.put(column)))
        )

        columns.forEach((column, index) => (column.id = ids[index]))
    }


    async deleteByTitle(title: string): Promise<number> {
        return DinoDatabase.noteColumn.where("title").equals(title).delete()
    }

    async deleteById(id: number): Promise<NoteColumnEntity | undefined> {
        const query = DinoDatabase.noteColumn.where("id").equals(id)

        const column = await query.first()

        await query.delete()

        return column
    }

    async deleteByExternalId(externalId: number): Promise<NoteColumnEntity | undefined> {
        const query = DinoDatabase.noteColumn.where("external_id").equals(externalId)

        const column = await query.first()

        await query.delete()

        return column
    }

    async deleteAll() {
        return DinoDatabase.noteColumn.clear()
    }
}

export default new NoteColumnDatabaseService()