import NoteColumnEntity from "../database/NoteColumnEntity"
import NoteEntity from "../database/NoteEntity"

export default interface NoteView {
    column: NoteColumnEntity
    notes: NoteEntity[]
}