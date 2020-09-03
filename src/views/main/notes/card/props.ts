import NoteViewModel from '../../../../types/note/NoteViewModel'

export default interface NoteCardProps {
  onEditQuestion: (note: NoteViewModel) => void
  onEditAnswer: (note: NoteViewModel) => void
  onDelete: (id: number) => void
  note: NoteViewModel
  children?: any
}
