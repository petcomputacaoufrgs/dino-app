import NoteDoc from './NoteDoc'
import PouchDB from 'pouchdb'
import StringUtils from '../../utils/StringUtils'

const ID_PREFIX = 'note_'

class NoteDatabase {
    db: PouchDB.Database

    constructor(db: PouchDB.Database) {
        this.db = db
    }

    private getId = (question: string) => (
        StringUtils.normalizer(ID_PREFIX + question)
    )

    put = async (doc: NoteDoc) => {
        if (!doc._id) {
            doc._id = this.getId(doc.question)
        }

        this.db.put(doc)
    }

    deleteByNoteDoc = async (doc: NoteDoc) => {
        try {
            const id = doc._id
            const rev = doc._rev

            this.db.remove(id, rev)
        } catch {
            throw new Error("Delete on local database error")
        }
    }

    getAll = async (): Promise<NoteDoc[]> => {
        try {
            const responseIds: PouchDB.Core.AllDocsResponse<{}> = await this.db.allDocs()

            const ids = responseIds.rows
            .filter(row => {
                const isNote = row.id.startsWith(ID_PREFIX)
                
                if (isNote) {
                    const exists = !row.value.deleted

                    return exists
                }
                
                return false
            })
            .map(row => row.id)

            const responseNotes = await this.db.allDocs({
                include_docs: true,
                keys: ids
            })

            const notes = responseNotes.rows.map(r => {
                const doc: any = r.doc

                if (doc) {
                    return {
                        _id: r.id,
                        _rev: r.value.rev,
                        external_id: doc.external_id,
                        order: doc.order,
                        question: doc.question,
                        answer: doc.answer,
                        answered: doc.answered,
                        tagNames: doc.tagNames,
                        lastUpdate: doc.lastUpdate,
                        savedOnServer: doc.savedOnServer
                    } as NoteDoc
                }

                return {} as NoteDoc
            })

            return notes

        } catch {

            return []
        }
    }

    getByQuestion = async (question: string): Promise<NoteDoc | null> => {
        const id = this.getId(question)

        try {
            const doc: NoteDoc = await this.db.get(id)
            
            return doc
        } catch {

            return null
        }
    }
}

export default NoteDatabase