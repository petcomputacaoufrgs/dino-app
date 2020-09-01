import PouchDB from 'pouchdb'
import findPlugin from 'pouchdb-find'
import LogAppErrorService from '../services/log_app_error/LogAppErrorService'

PouchDB.plugin(findPlugin)

export default class BaseDatabase<T> {
  db: PouchDB.Database<T>
  databaseName: string

  constructor(databaseName: string) {
    this.databaseName = databaseName
    this.db = this.getNewConnection()
  }

  removeAll = async () => {
    try {
      await this.db.destroy()
    } catch (e) {
      LogAppErrorService.saveError(e)
    }

    this.resetDatabase()
  }

  private resetDatabase = () => {
    this.db = this.getNewConnection()
  }

  private getNewConnection = (): PouchDB.Database<T> =>
    new PouchDB(this.databaseName, { auto_compaction: true })
}
