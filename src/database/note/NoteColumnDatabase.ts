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
    lastOrderUpdate: changed.lastOrderUpdate,
    savedOnServer: changed.savedOnServer,
    title: changed.title,
  }

  return newDoc
}

class NoteColumnDatabase extends BaseDatabase<NoteColumnDoc> {
  constructor() {
    super(DatabaseConstants.NOTE_COLUMN, getId, applyChanges)
  }

  getByTitle = async (title: string): Promise<NoteColumnDoc | undefined> => {
    const id = getIdByTitle(title)

    try {
      const doc = await this.db.get(id)
      return doc
    } catch (e) {
      LogAppErrorService.saveError(e)
      return undefined
    }
  }

  deleteByTitle = async (title: string) => {
    const doc = await this.getByTitle(title)

    if (doc) {
      try {
        await this.db.remove(doc)
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }
  }

  deleteByTitles = async (titles: string[]) => {
    for (const title of titles) {
      await this.deleteByTitle(title)
    }
  }
}

export default new NoteColumnDatabase()
