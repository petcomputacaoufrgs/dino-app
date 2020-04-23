import Note from "../../../types/Note"

export interface NoteColumnsType {
    id: number,
    cards: Note[];
}

export default interface NoteBoardType {
    columns: NoteColumnsType[]
}
