import BaseDatabase from '../BaseDatabase'
import DatabaseConstants from '../../constants/DatabaseConstants'
import StringUtils from '../../utils/StringUtils'
import NoteDoc from '../../types/note/database/NoteDoc'
import LogAppErrorService from '../../services/log_app_error/LogAppErrorService'

const getId = (doc: NoteDoc) => StringUtils.normalize(doc.question)

class DeletedNoteDatabase extends BaseDatabase<NoteDoc> {
  constructor() {
    super(DatabaseConstants.DELETED_NOTE, getId)
  }

  putNew = async (doc: NoteDoc) => {
    doc.lastUpdate = new Date().getTime()
    doc._id = getId(doc)
    doc._rev = ''

    try {
      await this.db.put(doc)
    } catch(e) {
      LogAppErrorService.saveError(e)
    }
  }
}

export default new DeletedNoteDatabase()
