import PouchDB from 'pouchdb'
import BaseDatabase from '../../BaseDatabase'
import DatabaseConstants from '../../../constants/DatabaseConstants'
import StringUtils from '../../../utils/StringUtils'
import NoteDoc from './docs/NoteDoc'

class DeletedNoteDatabase implements BaseDatabase {
    db: PouchDB.Database<{}>

    constructor() {
        this.db = new PouchDB(DatabaseConstants.DELETED_NOTE, {auto_compaction: true})
    }

    private getId = (question: string) => (
        StringUtils.normalizer(question)
    )

    putNew = async (doc: NoteDoc) => {
        doc._id = this.getId(doc.question)
        doc._rev = undefined

        this.db.put(doc)
    }

    deleteByNoteDoc = async (doc: NoteDoc) => {
        try {
            if (doc._id && doc._rev) {
                const id = doc._id
                const rev = doc._rev
    
                this.db.remove(id, rev)
            } else {
                throw new Error("Deletando item sem id ou sem rev")
            }

        } catch {
            throw new Error("Erro ao deletar item do banco de dados local.")
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

    getAll = async (): Promise<NoteDoc[]> => {
        try {
            const responseIds: PouchDB.Core.AllDocsResponse<{}> = await this.db.allDocs()

            const ids = responseIds.rows
                .filter(row => !row.value.deleted)
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

    removeAll = async () => {
        const allDocs = await this.getAll()

        allDocs.forEach(doc => {
            this.deleteByNoteDoc(doc)
        })
    }
    
}

export default new DeletedNoteDatabase()