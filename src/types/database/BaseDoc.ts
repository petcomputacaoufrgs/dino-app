import PouchDB from 'pouchdb'

export default interface BaseDoc extends PouchDB.Core.GetMeta {
  _id?: string
}
