import PouchDB from 'pouchdb'

export default interface NoteDoc extends PouchDB.Core.GetMeta {
  _id?: string
  external_id?: number
  order: number
  question: string
  answer: string
  answered: boolean
  tagNames: string[]
  lastUpdate: number
  savedOnServer: boolean
}
