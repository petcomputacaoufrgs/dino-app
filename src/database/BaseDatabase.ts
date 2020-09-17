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

  getByDoc = async (doc: T): Promise<T | null> => {
    if (this.hasValidId(doc)) {
      try {
        const savedDoc = await this.db.get(doc._id)

        return savedDoc
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return null
  }

  put = async (doc: T) => {
    try {
      if (this.hasValidId(doc)) {
        const savedDoc = await this.getByDoc(doc)

        if (savedDoc) {
          const newDoc = this.applyChanges(savedDoc, doc)

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
    const updatedDocs = await this.getAll()

    docs.forEach((doc) => {
      if (!this.hasValidId(doc)) {
        doc._id = this.getId(doc)
      }

      const updatedDocSearch = updatedDocs.filter(
        (updatedDoc) => updatedDoc._id === doc._id
      )

      if (updatedDocSearch.length > 0) {
        doc._rev = updatedDocSearch[0]._rev
      }
    })

    try {
      await this.db.bulkDocs(docs)
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
    new PouchDB(this.dbName, { auto_compaction: true, revs_limit: 50 })
}
