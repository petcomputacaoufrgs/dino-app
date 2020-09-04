import BaseDatabase from './BaseDatabase'
import DatabaseConstants from '../constants/DatabaseConstants'
import StringUtils from '../utils/StringUtils'
import NoteDoc from '../types/note/database/NoteDoc'
import LogAppErrorService from '../services/log_app_error/LogAppErrorService'
import DatabaseDeleteWithoutID from '../error/DatabaseDeleteWithoutID'

class DeletedNoteDatabase extends BaseDatabase<NoteDoc> {
  constructor() {
    super(DatabaseConstants.DELETED_NOTE)
  }

  private getId = (question: string) => StringUtils.normalize(question)

  putNew = async (doc: NoteDoc) => {
    doc.lastUpdate = new Date().getTime()
    doc._id = this.getId(doc.question)
    doc._rev = ''

    try {
      this.db.put(doc)
    } catch(e) {
      LogAppErrorService.saveError(e)
    }
  }

  deleteByNoteDoc = async (doc: NoteDoc) => {
      if (doc._id && doc._rev) {
        const id = doc._id
        const rev = doc._rev
        try {
          this.db.remove(id, rev)
        } catch (e) {
          LogAppErrorService.saveError(e)
        }
      } else {
        LogAppErrorService.saveError(new DatabaseDeleteWithoutID(DatabaseConstants.DELETED_NOTE, doc))
      }
  }

  getById = async (note: NoteDoc): Promise<NoteDoc | null> => {
    if (note._id) {
      try {
        const doc = await this.db.get(note._id)

        return doc
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }
    
    return null
  }

  getAll = async (): Promise<NoteDoc[]> => {
    try {
      const responseIds: PouchDB.Core.AllDocsResponse<{}> = await this.db.allDocs()

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
}

export default new DeletedNoteDatabase()
