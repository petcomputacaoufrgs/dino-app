import PouchDB from 'pouchdb'
import BaseDatabase from '../../../types/services/BaseDatabase'
import DatabaseConstants from '../../../constants/DatabaseConstants'
import StringUtils from '../../../utils/StringUtils'
import NoteDoc from '../../../types/note/database/NoteDoc'
import LogAppErrorService from '../../log_app_error/LogAppErrorService'
import DatabaseDeleteWithoutID from '../../../error/DatabaseDeleteWithoutID'

class DeletedNoteDatabase extends BaseDatabase {
  constructor() {
    super(DatabaseConstants.DELETED_NOTE)
  }

  private getId = (question: string) => StringUtils.normalize(question)

  putNew = async (doc: NoteDoc) => {
    doc._id = this.getId(doc.question)
    doc._rev = ''

    this.db.put(doc)
  }

  deleteByNoteDoc = async (doc: NoteDoc) => {
    try {
      if (doc._id && doc._rev) {
        const id = doc._id
        const rev = doc._rev

        this.db.remove(id, rev)
      } else {
        throw new DatabaseDeleteWithoutID(DatabaseConstants.DELETED_NOTE, doc)
      }
    } catch (e) {
      LogAppErrorService.saveDefault(e)
    }
  }

  getByQuestion = async (question: string): Promise<NoteDoc | null> => {
    const id = this.getId(question)

    try {
      const doc: NoteDoc = await this.db.get(id)

      return doc
    } catch (e) {
      LogAppErrorService.saveDefault(e)
      return null
    }
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
      LogAppErrorService.saveDefault(e)
      return []
    }
  }
}

export default new DeletedNoteDatabase()
