import NoteResponseModel from "../../get/NoteResponseModel";

export default interface NoteSyncResponseModel {
  notes: NoteResponseModel[]
  version: number
}