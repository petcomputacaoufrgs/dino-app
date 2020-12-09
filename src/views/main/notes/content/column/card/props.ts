import NoteEntity from "../../../../../../types/note/database/NoteEntity"

export default interface NoteBodyColumnCardProps {
  onClickNote: (note: NoteEntity) => void
  note: NoteEntity
  noteIndex: number
  columnIndex: number
  searching: boolean
}
