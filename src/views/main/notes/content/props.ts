import NoteViewModel from '../../../../types/note/NoteViewModel'
import NoteDoc from '../../../../types/note/database/NoteDoc';

export default interface NoteBodyProps {
  onSave: (note: NoteDoc) => void
  onSaveNew: (question: string, tagList: string[], answer: string) => void
  onBoardOrderChanged: (viewNotes: NoteViewModel[]) => void
  onDeleteNote: (note: NoteDoc) => void
  viewNotes: NoteViewModel[]
  tags: string[]
}
