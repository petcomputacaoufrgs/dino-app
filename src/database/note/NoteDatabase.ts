import NoteDoc from '../../types/note/database/NoteDoc'
import StringUtils from '../../utils/StringUtils'
import BaseDatabase from '../BaseDatabase'
import ArrayUtils from '../../utils/ArrayUtils'
import DatabaseConstants from '../../constants/DatabaseConstants'
import LogAppErrorService from '../../services/log_app_error/LogAppErrorService'

const getIdByQuestion = (question: string) => StringUtils.normalize(question)

const getId = (doc: NoteDoc) => getIdByQuestion(doc.question)

class NoteDatabase extends BaseDatabase<NoteDoc> {
  constructor() {
    super(DatabaseConstants.NOTE, getId)
  }

  getByQuestion = async (question: string): Promise<NoteDoc | null> => {
    const id = getIdByQuestion(question)

    try {
      const doc = await this.db.get(id)

      return doc
    } catch (e) {
      LogAppErrorService.saveError(e)
      return null
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
