import NoteColumnChangedRequestModel from "./NoteColumnChangedRequestModel";
import NoteColumnSaveRequestModel from "../save/NoteColumnSaveRequestModel";
import NoteColumnSyncDeleteRequestModel from "./NoteColumnSyncDeleteRequestModel";
import NoteColumnSyncOrderRequestModel from "./NoteColumnSyncOrderRequestModel";

export default interface NoteColumnSyncRequestModel {
    changedColumns: NoteColumnChangedRequestModel[]
    newColumns: NoteColumnSaveRequestModel[]
    deletedColumns: NoteColumnSyncDeleteRequestModel[]
    orderColumns: NoteColumnSyncOrderRequestModel[]
}