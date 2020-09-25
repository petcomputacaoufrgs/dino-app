import NoteUpdateAllItemResponseModel from "./NoteUpdateAllItemResponseModel"

export default interface NoteUpdateAllResponseModel {
  newVersion: number
  items: NoteUpdateAllItemResponseModel[]
}