import NoteSyncChangedRequestModel from "./NoteSyncChangedRequestModel";
import NoteSyncSaveRequestModel from "./NoteSyncSaveRequestModel";
import NoteSyncDeleteRequest from "./NoteSyncDeleteRequest";
import NoteSyncOrderRequestModel from "./NoteSyncOrderRequestModel";

export default interface NoteSyncRequestModel {
  changedNotes: NoteSyncChangedRequestModel[]
  newNotes: NoteSyncSaveRequestModel[]
  deletedNotes: NoteSyncDeleteRequest[]
  notesOrder: NoteSyncOrderRequestModel[]
}