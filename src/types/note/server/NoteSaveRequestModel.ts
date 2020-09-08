export default interface NoteSaveRequestModel {
  id?: number

  question: string

  tagNames: string[]

  lastUpdate: number

  answer: string

  order: number

  columnTitle: string
}
