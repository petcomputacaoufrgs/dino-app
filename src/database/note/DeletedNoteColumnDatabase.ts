import BaseDatabase from '../BaseDatabase'
import DatabaseConstants from '../../constants/DatabaseConstants'
import StringUtils from '../../utils/StringUtils'
import LogAppErrorService from '../../services/log_app_error/LogAppErrorService'
import NoteColumnDoc from '../../types/note/database/NoteColumnDoc'

const getId = (doc: NoteColumnDoc) => StringUtils.normalize(doc.title)

class DeletedNoteColumnDatabase extends BaseDatabase<NoteColumnDoc> {
  constructor() {
    super(DatabaseConstants.DELETED_NOTE_COLUMN, getId)
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
