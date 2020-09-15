import NoteDoc from '../../types/note/database/NoteDoc'
import StringUtils from '../../utils/StringUtils'
import BaseDatabase from '../BaseDatabase'
import ArrayUtils from '../../utils/ArrayUtils'
import DatabaseConstants from '../../constants/DatabaseConstants'
import LogAppErrorService from '../../services/log_app_error/LogAppErrorService'

const getIdByQuestion = (question: string) => StringUtils.normalize(question)

const getId = (doc: NoteDoc) => getIdByQuestion(doc.question)

const applyChanges = (origin: NoteDoc, changed: NoteDoc): NoteDoc => {
  const newDoc: NoteDoc = {
    ...origin,
    external_id: changed.external_id,
    lastUpdate: changed.lastUpdate,
    order: changed.order,
    savedOnServer: changed.savedOnServer,
    columnTitle: changed.columnTitle,
    answer: changed.answer,
    question: changed.question,
    tagNames: changed.tagNames,
  }

  return newDoc
}

class NoteDatabase extends BaseDatabase<NoteDoc> {
  constructor() {
    super(DatabaseConstants.NOTE, getId, applyChanges)

    this.db.createIndex({
      index: {
        fields: ['columnTitle'],
      },
    })
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

  deleteByColumnTitle = async (columnTitle: string): Promise<void> => {
    try {
      const findResponse = await this.db.find({
        selector: {
          $and: [
            {
              columnTitle: {$eq: columnTitle },
            },
          ],
        }
      })

      await this.deleteByDocs(findResponse.docs)

    } catch (e) {
      LogAppErrorService.saveError(e)
    }
  }
}

export default new NoteDatabase()
