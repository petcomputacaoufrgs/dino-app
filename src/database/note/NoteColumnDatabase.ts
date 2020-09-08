import StringUtils from '../../utils/StringUtils'
import BaseDatabase from '../BaseDatabase'
import DatabaseConstants from '../../constants/DatabaseConstants'
import NoteColumnDoc from '../../types/note/database/NoteColumnDoc'
import LogAppErrorService from '../../services/log_app_error/LogAppErrorService'

const getIdByTitle = (title: string) => StringUtils.normalize(title)

const getId = (doc: NoteColumnDoc) => getIdByTitle(doc.title)

class NoteColumnDatabase extends BaseDatabase<NoteColumnDoc> {
  constructor() {
    super(DatabaseConstants.NOTE_COLUMN, getId)
  }

  getByTitle = async (title: string) => {
    const id = getIdByTitle(title)

    try {
      const doc = await this.db.get(id)
      return doc
    } catch (e) {
      LogAppErrorService.saveError(e)
      return null
    }
  }
}

export default new NoteColumnDatabase()
