import PouchDB from 'pouchdb'

export default class DatabaseService {
    db: PouchDB.Database

    constructor() {
        this.db = new PouchDB('dinoapp', {auto_compaction: true})
    }
}