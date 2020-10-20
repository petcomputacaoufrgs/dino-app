import NoteViewModel from '../../../../../../types/note/view/NoteViewModel'

export default interface NoteBodyColumnCardProps {
  onClickNote: (note: NoteViewModel) => void
  note: NoteViewModel
  noteIndex: number
  searching: boolean
}
