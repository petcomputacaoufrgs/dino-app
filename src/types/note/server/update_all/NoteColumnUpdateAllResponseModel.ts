import NoteColumnItemUpdateAllResponseModel from "./NoteColumnItemUpdateAllResponseModel";

export default interface NoteColumnUpdateAllResponseModel {
    newVersion: number
    items: NoteColumnItemUpdateAllResponseModel[]
}