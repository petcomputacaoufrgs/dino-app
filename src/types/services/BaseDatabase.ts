import PouchDB from 'pouchdb'

/**
 * @description Define a base para uma service de banco de dados PouchDB
 */
export default class BaseDatabase {
  db: PouchDB.Database<{}>
  databaseName: string

  constructor(databaseName: string) {
    this.databaseName = databaseName
    this.db = this.getNewConnection()
  }

  removeAll = async () => {
    await this.db.destroy()
    this.resetDatabase()
  }

  private resetDatabase = () => {
    this.db = this.getNewConnection()
  }

  private getNewConnection = (): PouchDB.Database<{}> =>
    new PouchDB(this.databaseName, { auto_compaction: true })
}
