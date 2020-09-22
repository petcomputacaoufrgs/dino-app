import NoteDoc from '../../types/note/database/NoteDoc'
import BaseDatabase from '../BaseDatabase'
import ArrayUtils from '../../utils/ArrayUtils'
import DatabaseConstants from '../../constants/DatabaseConstants'
import LogAppErrorService from '../../services/log_app_error/LogAppErrorService'

const getIdByQuestion = (question: string) => question

const getId = (doc: NoteDoc) => getIdByQuestion(doc.question)

const applyChanges = (origin: NoteDoc, changed: NoteDoc): NoteDoc => {
  const newDoc: NoteDoc = {
    ...origin,
    external_id: changed.external_id,
    lastUpdate: changed.lastUpdate,
    lastOrderUpdate: changed.lastOrderUpdate,
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

  getAllByColumnTitle = async (columnTitle: string): Promise<NoteDoc[]> => {
    const findResponse = await this.db.find({
      selector: {
        $and: [
          {
            columnTitle: { $eq: columnTitle },
          },
        ],
      }
    })

    return findResponse.docs
  }

  deleteByColumnTitle = async (columnTitle: string): Promise<NoteDoc[]> => {
    try {
      const docs = await this.getAllByColumnTitle(columnTitle)

      for (const doc of docs) {
        await this.db.remove(doc)
      }

      return docs
    } catch (e) {
      LogAppErrorService.saveError(e)
    }

    return []
  }

  updateColumnTitle = async (newTitle: string, oldTitle: string) => {
    try {
      const docs = await this.getAllByColumnTitle(oldTitle)

      docs.forEach(doc => doc.columnTitle = newTitle)

      await this.putAll(docs)
    } catch (e) {
      LogAppErrorService.saveError(e)
    }
  }
}

export default new NoteDatabase()
