import NoteColumnResponseModel from "../get/NoteColumnResponseModel";

export default interface NoteColumnSyncResponse {
    columns: NoteColumnResponseModel[]
    version: number
}