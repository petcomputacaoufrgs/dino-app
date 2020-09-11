import BaseDoc from '../../database/BaseDoc'

export default interface NoteColumnDoc extends BaseDoc {
  external_id?: number
  title: string
  order: number
  lastUpdate: number
  savedOnServer: boolean
  oldTitle?: string
}
