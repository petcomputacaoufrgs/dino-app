import BaseDoc from '../../database/BaseDoc'

export default interface NoteDoc extends BaseDoc {
  external_id?: number
  order: number
  question: string
  answer: string
  tagNames: string[]
  lastUpdate: number
  savedOnServer: boolean
  columnTitle: string
}
