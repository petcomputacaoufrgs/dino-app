import NoteDoc from '../../../../types/note/database/NoteDoc'
import { DropResult } from 'react-beautiful-dnd'
import { NoteColumnViewModel } from '../../../../types/note/view/NoteColumnViewModel'

export default interface NoteBodyProps {
  onSave: (note: NoteDoc) => void
  onSaveNew: (question: string, tagList: string[], answer: string) => void
  onAddNote: (column: NoteColumnViewModel) => void
  onDeleteNote: (note: NoteDoc) => void
  onSaveColumn: (column: NoteColumnViewModel, oldTitle?: string) => void
  onDeleteColumn: (column: NoteColumnViewModel) => void
  onDragEnd: (result: DropResult) => void
  columns: NoteColumnViewModel[]
  tags: string[]
}
