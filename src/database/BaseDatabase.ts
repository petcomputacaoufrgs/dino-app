import PouchDB from 'pouchdb'
import findPlugin from 'pouchdb-find'
import LogAppErrorService from '../services/log_app_error/LogAppErrorService'
import BaseDoc from '../types/database/BaseDoc'

PouchDB.plugin(findPlugin)

export default class BaseDatabase<T extends BaseDoc> {
  db: PouchDB.Database<T>
  dbName: string
  getId: (doc: T) => string
  applyChanges: (origin: T, changed: T) => T

  constructor(
    dbName: string,
    getId: (doc: T) => string,
    applyChanges: (origin: T, changed: T) => T
  ) {
    this.dbName = dbName
    this.db = this.getNewConnection()
    this.getId = getId
    this.applyChanges = applyChanges
  }

  hasValidId = (doc: T) => (
   doc._id && doc._id.length !== 0
  )

  getById = async (id: string): Promise<T | undefined> => {
    try {
      const doc = await this.db.get(id)

      return doc
    } catch (e) {
      LogAppErrorService.saveError(e)
    }

    return undefined
  }

  getUpdatedDocByDoc = async (doc: T): Promise<T | null> => {
    if (this.hasValidId(doc)) {
      try {
        const updatedDoc = await this.db.get(doc._id)

        return updatedDoc
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return null
  }

  put = async (doc: T) => {
    try {
      if (this.hasValidId(doc)) {
        const updatedDoc = await this.getById(doc._id)
        if (updatedDoc) {
          const newDoc = this.applyChanges(updatedDoc, doc)

          await this.db.put(newDoc)
        }
      } else {
        doc._id = this.getId(doc)
        await this.db.put(doc)
      }
    } catch (e) {
      LogAppErrorService.saveError(e)
    }
  }

  putAll = async (docs: T[]) => {
    const updatedDocs = [...docs]

    const savedDocs = await this.getAll()

    const newDocs: T[] = []

    savedDocs.forEach(savedDoc => {
      const updatedDocIndex = updatedDocs.findIndex(ud => ud._id === savedDoc._id)

      if (updatedDocIndex >= 0) {
        const newDoc = this.applyChanges(savedDoc, updatedDocs[updatedDocIndex])
        newDocs.push(newDoc)
        updatedDocs.splice(updatedDocIndex, 1)
      }
    })

    updatedDocs.forEach(newDoc => {
      if (!this.hasValidId(newDoc)) {
        newDoc._id = this.getId(newDoc)
      }
      newDocs.push(newDoc)
    })

    try {
      await this.db.bulkDocs(newDocs)
    } catch (e) {
      LogAppErrorService.saveError(e)
    }
  }

  removeAll = async () => {
    try {
      await this.db.destroy()
    } catch (e) {
      LogAppErrorService.saveError(e)
    }

    this.resetDatabase()
  }

  deleteByDoc = async (doc: T) => {
    try {
      if (this.hasValidId(doc)) {
        const savedDoc = await this.db.get(doc._id)
        await this.db.remove(savedDoc)
      }
    } catch (e) {
      LogAppErrorService.saveError(e)
    }
  }
  
  getAll = async (): Promise<T[]> => {
    try {
      const allDocs = await this.db.allDocs(({
        include_docs: true,
      }))

      const docs = allDocs.rows
        .filter((row) => !row.value.deleted && !row.key.startsWith('_design'))
        .map((row) => row.doc as T)

      return docs
    } catch (e) {
      LogAppErrorService.saveError(e)
      return []
    }
  }

  private resetDatabase = () => {
    this.db = this.getNewConnection()
  }

  private getNewConnection = (): PouchDB.Database<T> =>
    new PouchDB(this.dbName, { auto_compaction: true, revs_limit: 1 })
}
