import NoteViewModel from '../../../../../types/note/NoteViewModel'

export default interface NoteBodyColumnProps {
  notes: NoteViewModel[]
  onClickNote: (note: NoteViewModel) => void
  onDelete: (note: NoteViewModel) => void
}
