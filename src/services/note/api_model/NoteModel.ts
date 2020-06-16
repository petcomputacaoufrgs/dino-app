export default interface NoteModel {
  id: number

  order: number

  question: string

  answer: string

  answered: boolean

  tags: string[]

  lastUpdate: number
}
