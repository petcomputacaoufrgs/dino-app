import PouchDB from 'pouchdb'

export default interface BaseDoc extends PouchDB.Core.GetMeta, PouchDB.Core.RemoveDocument {
  _id: string
}
