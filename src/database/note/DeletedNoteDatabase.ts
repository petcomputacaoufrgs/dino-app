import BaseDatabase from '../BaseDatabase'
import DatabaseConstants from '../../constants/DatabaseConstants'
import NoteDoc from '../../types/note/database/NoteDoc'
import LogAppErrorService from '../../services/log_app_error/LogAppErrorService'

const getId = (doc: NoteDoc) => doc.question

const applyChanges = (origin: NoteDoc, changed: NoteDoc): NoteDoc => {
  const newDoc: NoteDoc = {
    ...origin,
    external_id: changed.external_id,
    lastUpdate: changed.lastUpdate,
    order: changed.order,
    savedOnServer: changed.savedOnServer,
    answer: changed.answer,
    columnTitle: changed.columnTitle,
    question: changed.question,
    tagNames: changed.tagNames,
  }

  return newDoc
}

class DeletedNoteDatabase extends BaseDatabase<NoteDoc> {
  constructor() {
    super(DatabaseConstants.DELETED_NOTE, getId, applyChanges)
  }

  putNew = async (doc: NoteDoc) => {
    doc.lastUpdate = new Date().getTime()
    doc._id = getId(doc)
    doc._rev = ''

    try {
      await this.db.put(doc)
    } catch (e) {
      LogAppErrorService.saveError(e)
    }
  }
}

export default new DeletedNoteDatabase()
