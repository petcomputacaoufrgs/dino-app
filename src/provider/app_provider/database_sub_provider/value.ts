export default interface DatabaseSubProviderValue {
    getConnection: () => PouchDB.Database
}