export default interface NoteResponseModel {
  id: number

  order: number

  question: string

  answer: string

  tags: string[]

  lastUpdate: number

  columnTitle: string
}
