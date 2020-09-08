import PouchDB from 'pouchdb'
import findPlugin from 'pouchdb-find'
import LogAppErrorService from '../services/log_app_error/LogAppErrorService'
import BaseDoc from '../types/database/BaseDoc'
import DatabaseDeleteWithoutID from '../error/DatabaseDeleteWithoutID'

PouchDB.plugin(findPlugin)

export default class BaseDatabase<T extends BaseDoc> {
  db: PouchDB.Database<T>
  dbName: string
  getId: (doc: T) => string

  constructor(dbName: string, getId: (doc: T) => string) {
    this.dbName = dbName
    this.db = this.getNewConnection()
    this.getId = getId
  }

  getByDoc = async (doc: T): Promise<T | null> => {
    if (doc._id) {
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
    if (!doc._id) {
      doc._id = this.getId(doc)
    }

    try {
      this.db.put(doc)
    } catch (e) {
      LogAppErrorService.saveError(e)
    }
  }

  putAll = async (docs: T[]) => {
    docs.forEach((doc) => {
      if (!doc._id) {
        doc._id = this.getId(doc)
      }
    })

    try {
      this.db.bulkDocs(docs)
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
      if (doc._id && doc._rev) {
        const id = doc._id
        const rev = doc._rev

        this.db.remove(id, rev)
      } else {
        throw new DatabaseDeleteWithoutID(this.dbName, doc)
      }
    } catch (e) {
      LogAppErrorService.saveError(e)
    }
  }

  getAll = async (): Promise<T[]> => {
    try {
      const responseIds = await this.db.allDocs()

      const ids = responseIds.rows
        .filter((row) => !row.value.deleted)
        .map((row) => row.id)

      const responseNotes = await this.db.allDocs({
        include_docs: true,
        keys: ids,
      })

      const docs = responseNotes.rows.map((r) => {
        const doc: any = r.doc

        if (doc) {
          return {
            _id: r.id,
            _rev: r.value.rev,
            ...doc
          } as T
        }

        return {} as T
      })

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
    new PouchDB(this.dbName, { auto_compaction: true })
}
