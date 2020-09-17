import BaseDatabase from '../BaseDatabase'
import DatabaseConstants from '../../constants/DatabaseConstants'
import NoteColumnDoc from '../../types/note/database/NoteColumnDoc'
import LogAppErrorService from '../../services/log_app_error/LogAppErrorService'

const getIdByTitle = (title: string) => title

const getId = (doc: NoteColumnDoc) => getIdByTitle(doc.title)

const applyChanges = (
  origin: NoteColumnDoc,
  changed: NoteColumnDoc
): NoteColumnDoc => {
  const newDoc: NoteColumnDoc = {
    ...origin,
    external_id: changed.external_id,
    lastUpdate: changed.lastUpdate,
    order: changed.order,
    savedOnServer: changed.savedOnServer,
    title: changed.title,
    oldTitle: changed.oldTitle,
  }

  return newDoc
}

class NoteColumnDatabase extends BaseDatabase<NoteColumnDoc> {
  constructor() {
    super(DatabaseConstants.NOTE_COLUMN, getId, applyChanges)
  }

  getByTitle = async (title: string): Promise<NoteColumnDoc | null> => {
    const id = getIdByTitle(title)

    try {
      const doc = await this.db.get(id)
      return doc
    } catch (e) {
      LogAppErrorService.saveError(e)
      return null
    }
  }

  deleteByTitles = async (titles: string[]) => {
    const docs = await this.getAll()

    const deletedDocs = docs.filter(doc => titles.includes(doc.title))

    for (const deletedDoc of deletedDocs) {
      await this.db.remove(deletedDoc)
    }
  }

  updateTitle = async (newTitle: string, oldTitle: string, lastUpdate: number) => {
    try {
      const doc = await this.getByTitle(oldTitle)

      if (doc) {
        await this.db.remove(doc)

        const newDoc: NoteColumnDoc = {
          lastUpdate: doc.lastUpdate,
          order: doc.order,
          savedOnServer: doc.savedOnServer,
          title: newTitle,
          external_id: doc.external_id,
          oldTitle: doc.oldTitle ? doc.oldTitle : oldTitle,
          _rev: '',
          _id: getIdByTitle(newTitle)
        }

        await this.db.put(newDoc)
      }
    } catch (e) {
      LogAppErrorService.saveError(e)
    }
  }
}

export default new NoteColumnDatabase()
