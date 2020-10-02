export default interface NoteEntity {
  id?: number
  external_id?: number
  order: number
  question: string
  answer: string
  tagNames: string[]
  lastUpdate: number
  lastOrderUpdate: number
  savedOnServer: boolean
  columnTitle: string
}