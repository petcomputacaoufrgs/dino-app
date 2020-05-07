import PouchDB from 'pouchdb'

export default interface BaseDatabase {
    db: PouchDB.Database
}