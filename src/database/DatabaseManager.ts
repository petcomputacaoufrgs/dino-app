import PouchDB from 'pouchdb'

class DatabaseManager {
    db: PouchDB.Database

    constructor() {
        this.db = new PouchDB('dinoapp', {auto_compaction: true})
    }

    getDatabase = (): PouchDB.Database => {
        return this.db
    }
}

export default new DatabaseManager()