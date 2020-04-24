import NoteModel from "./NoteModel"

export interface NoteBoardColumnModel {
    id: number,
    cards: NoteModel[],
}

export default interface NoteBoardModel {
    columns: NoteBoardColumnModel[]
}
