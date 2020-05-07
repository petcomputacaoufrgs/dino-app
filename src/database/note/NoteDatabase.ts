import NoteDoc from './NoteDoc'
import StringUtils from '../../utils/StringUtils'
import Database from '../Database'
import ArrayUtils from '../../utils/ArrayUtils'

const ID_PREFIX = 'note_'

class NoteDatabase extends Database {

    private getId = (question: string) => (
        StringUtils.normalizer(ID_PREFIX + question)
    )

    put = async (doc: NoteDoc) => {
        if (!doc._id) {
            doc._id = this.getId(doc.question)
        }

        this.db.put(doc)
    }

    putAll = async (docs: NoteDoc[]) => {
        docs.forEach(doc => {
            if (!doc._id) {
                doc._id = this.getId(doc.question)
            }
        })

        this.db.bulkDocs(docs)
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

    getAllTags = async (): Promise<string[]> => {
        const noteDocs = await this.getAll()

        const tags: string[] = []

        noteDocs.forEach(noteDoc => tags.push.apply(tags, noteDoc.tagNames))

        return ArrayUtils.removeRepeatedValues(tags)
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

    removeAll = async () => {
        const allDocs = await this.getAll()

        allDocs.forEach(doc => {
            this.deleteByNoteDoc(doc)
        })
    }
}

export default new NoteDatabase()