import NoteDoc from '../../../../types/note/database/NoteDoc'
import { DropResult } from 'react-beautiful-dnd'
import { NoteColumnViewModel } from '../../../../types/note/view/NoteColumnViewModel'

export default interface NoteBodyProps {
  onSave: (note: NoteDoc) => void
  onSaveNew: (question: string, tagList: string[], answer: string) => void
  onSaveColumn: (column: NoteColumnViewModel) => void
  onDragEnd: (result: DropResult) => void
  onDeleteNote: (note: NoteDoc) => void
  columns: NoteColumnViewModel[]
  tags: string[]
}
