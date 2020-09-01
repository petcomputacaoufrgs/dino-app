import NoteDoc from '../types/note/database/NoteDoc'
import StringUtils from '../utils/StringUtils'
import BaseDatabase from './BaseDatabase'
import ArrayUtils from '../utils/ArrayUtils'
import DatabaseConstants from '../constants/DatabaseConstants'
import LogAppErrorService from '../services/log_app_error/LogAppErrorService'
import DatabaseDeleteWithoutID from '../error/DatabaseDeleteWithoutID'

class NoteDatabase extends BaseDatabase<NoteDoc> {
  constructor() {
    super(DatabaseConstants.NOTE)
  }

  private getId = (question: string) => StringUtils.normalize(question)

  put = async (doc: NoteDoc) => {
    if (!doc._id) {
      doc._id = this.getId(doc.question)
    }

    try {
      this.db.put(doc)
    } catch(e) {
      console.log(e)
    }
    
  }

  putAll = async (docs: NoteDoc[]) => {
    docs.forEach((doc) => {
      if (!doc._id) {
        doc._id = this.getId(doc.question)
      }
    })

    try {
      this.db.bulkDocs(docs)
    } catch (e) {
      console.log(e)
    }
  }

  deleteByNoteDoc = async (doc: NoteDoc) => {
    try {
      if (doc._id && doc._rev) {
        const id = doc._id
        const rev = doc._rev

        this.db.remove(id, rev)
      } else {
        throw new DatabaseDeleteWithoutID(DatabaseConstants.NOTE, doc)
      }
    } catch (e) {
      LogAppErrorService.saveError(e)
    }
  }

  getByQuestion = async (question: string): Promise<NoteDoc | null> => {
    const id = this.getId(question)

    try {
      const doc = await this.db.get(id)

      return doc
    } catch (e) {
      LogAppErrorService.saveError(e)
      return null
    }
  }

  getAll = async (): Promise<NoteDoc[]> => {
    try {
      const responseIds = await this.db.allDocs()

      const ids = responseIds.rows
        .filter((row) => !row.value.deleted)
        .map((row) => row.id)

      const responseNotes = await this.db.allDocs({
        include_docs: true,
        keys: ids,
      })

      const notes = responseNotes.rows.map((r) => {
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
            savedOnServer: doc.savedOnServer,
          } as NoteDoc
        }

        return {} as NoteDoc
      })

      return notes
    } catch (e) {
      LogAppErrorService.saveError(e)
      return []
    }
  }

  getAllTags = async (): Promise<string[]> => {
    const noteDocs = await this.getAll()

    const tags: string[] = []

    noteDocs.forEach((noteDoc) => tags.push.apply(tags, noteDoc.tagNames))

    return ArrayUtils.removeRepeatedValues(tags)
  }
}

export default new NoteDatabase()
