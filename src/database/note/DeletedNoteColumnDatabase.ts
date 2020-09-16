import BaseDatabase from '../BaseDatabase'
import DatabaseConstants from '../../constants/DatabaseConstants'
import LogAppErrorService from '../../services/log_app_error/LogAppErrorService'
import NoteColumnDoc from '../../types/note/database/NoteColumnDoc'

const getId = (doc: NoteColumnDoc) => doc.title

const applyChanges = (
  origin: NoteColumnDoc,
  changed: NoteColumnDoc
): NoteColumnDoc => {
  const newDoc: NoteColumnDoc = {
    ...origin,
    external_id: changed.external_id,
    lastUpdate: changed.lastUpdate,
    order: changed.order,
    title: changed.title,
    oldTitle: changed.oldTitle,
    savedOnServer: changed.savedOnServer,
  }

  return newDoc
}

class DeletedNoteColumnDatabase extends BaseDatabase<NoteColumnDoc> {
  constructor() {
    super(DatabaseConstants.DELETED_NOTE_COLUMN, getId, applyChanges)
  }

  putNew = async (doc: NoteColumnDoc) => {
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

export default new DeletedNoteColumnDatabase()
