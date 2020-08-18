import PouchDB from 'pouchdb'
import findPlugin from 'pouchdb-find'

PouchDB.plugin(findPlugin)

/**
 * @description Define a base para uma service de banco de dados PouchDB
 */
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
    } catch (e) {}

    this.resetDatabase()
  }

  private resetDatabase = () => {
    this.db = this.getNewConnection()
  }

  private getNewConnection = (): PouchDB.Database<T> =>
    new PouchDB(this.databaseName, { auto_compaction: true })
}
