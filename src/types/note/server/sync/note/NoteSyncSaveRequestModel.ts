export default interface NoteSyncSaveRequestModel {
  question: string
  lastUpdate: number
  lastOrderUpdate?: number
  answer: string
  order?: number
  columnId: number
  tagNames: string[]
}
