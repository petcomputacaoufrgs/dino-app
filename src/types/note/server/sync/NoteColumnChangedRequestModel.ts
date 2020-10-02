import NoteColumnSaveRequestModel from "../save/NoteColumnSaveRequestModel";

export default interface NoteColumnChangedRequestModel extends NoteColumnSaveRequestModel {
    id: number
}