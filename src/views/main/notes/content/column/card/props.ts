import NoteViewModel from '../../../../../../types/note/NoteViewModel'

export default interface NoteBodyColumnCardProps {
  onClickNote: (note: NoteViewModel) => void
  onDelete: (note: NoteViewModel) => void
  note: NoteViewModel
}
