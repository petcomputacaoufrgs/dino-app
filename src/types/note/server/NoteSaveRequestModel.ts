export default interface NoteSaveRequestModel {
  id?: number

  question: string

  tagNames: string[]

  lastUpdate: number

  lastOrderUpdate: number

  answer: string

  order: number

  columnTitle: string
}
