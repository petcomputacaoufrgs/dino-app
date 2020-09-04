export default interface NoteModel {
  id: number

  order: number

  question: string

  answer: string

  tags: string[]

  lastUpdate: number
}
