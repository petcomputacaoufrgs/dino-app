import NoteViewModel from '../../../../../types/note/view/NoteViewModel';
import { NoteColumnViewModel } from '../../../../../types/note/view/NoteColumnViewModel';

export default interface NoteBodyColumnProps {
  column: NoteColumnViewModel
  columnIndex: number
  onClickNote: (note: NoteViewModel) => void
  onDelete: (note: NoteViewModel) => void
  onColumnEdit: (column: NoteColumnViewModel) => void
}
