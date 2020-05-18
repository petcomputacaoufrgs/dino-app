import NoteViewModel from '../model/NoteViewModel'

export default interface NoteCardProps {
  onEditQuestion: (note: NoteViewModel) => void
  onEditAnswer: (note: NoteViewModel) => void
  onDelete: (id: number) => void
  dragging: boolean
  note: NoteViewModel
  children?: any
}
