export default interface NoteColumnSaveRequestModel {
  id?: number
  title: string
  order?: number
  lastUpdate: number
  lastOrderUpdate?: number
  oldTitle?: string
}
