import NoteViewModel from '../../../../../types/note/view/NoteViewModel'
import { NoteColumnViewModel } from '../../../../../types/note/view/NoteColumnViewModel'

export default interface NoteBodyColumnProps {
  column: NoteColumnViewModel
  columnIndex: number
  onClickNote: (note: NoteViewModel) => void
  onDelete: (note: NoteViewModel) => void
  onEditColumn: (column: NoteColumnViewModel) => void
  onDeleteColumn: (column: NoteColumnViewModel) => void
  onAddNote: (column: NoteColumnViewModel) => void
}
