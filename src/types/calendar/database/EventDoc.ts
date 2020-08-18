import PouchDB from 'pouchdb'

export default interface EventDoc extends PouchDB.Core.GetMeta {
  _id?: string
  external_id?: number
  name: string
  description: string
  color: string
  init_date: Date
  end_date: Date
  reminder_alarm_ms: number
  type: number
}

