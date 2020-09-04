export default interface NoteSaveModel {
  id?: number

  question: string

  tagNames: string[]

  lastUpdate: number

  answer: string

  order: number
}
