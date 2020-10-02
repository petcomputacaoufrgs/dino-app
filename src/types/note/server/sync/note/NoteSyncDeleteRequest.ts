import NoteDeleteRequestModel from "../../delete/NoteDeleteRequestModel";

export default interface NoteSyncDeleteRequest extends NoteDeleteRequestModel {
  lastUpdate: number
}