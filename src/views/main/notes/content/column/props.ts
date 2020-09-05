import NoteViewModel from '../../../../../types/note/NoteViewModel'
import { NoteColumn } from '..';

export default interface NoteBodyColumnProps {
  column: NoteColumn
  onClickNote: (note: NoteViewModel) => void
  onDelete: (note: NoteViewModel) => void
}
