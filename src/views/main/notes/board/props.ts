import NoteViewModel from '../../../../types/note/NoteViewModel'

export default interface BoardProps {
  onSaveQuestion: (
    question: string,
    tags: string[],
    noteView: NoteViewModel
  ) => void
  onSaveAnswer: (newAnswer: string, noteView: NoteViewModel) => void
  onBoardOrderChanged: (viewNotes: NoteViewModel[]) => void
  onDeleteNote: (noteId: number) => void
  viewNotes: NoteViewModel[]
  tags: string[]
}
