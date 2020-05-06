import PouchDB from 'pouchdb'

class DatabaseService {
    db: PouchDB.Database

    constructor() {
        this.db = new PouchDB('dinoapp', {auto_compaction: true})
    }

    getConnection = (): PouchDB.Database => {
        return this.db
    }
}

export default new DatabaseService()