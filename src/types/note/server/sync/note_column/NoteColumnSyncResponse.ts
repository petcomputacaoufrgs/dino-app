import NoteColumnResponseModel from "../../get/NoteColumnResponseModel";
import ChangedTitleColumnModel from "./ChangedTitleColumnModel";

export default interface NoteColumnSyncResponse {
  columns: NoteColumnResponseModel[]
  version: number
  changedTitleColumnModels: ChangedTitleColumnModel[]
}