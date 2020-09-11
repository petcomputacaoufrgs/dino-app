export default interface NoteColumnSaveRequestModel {
  id?: number
  title: string
  order: number
  lastUpdate: number
  oldTitle?: string
}
