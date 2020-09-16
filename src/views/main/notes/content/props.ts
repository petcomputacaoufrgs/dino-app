import NoteDoc from '../../../../types/note/database/NoteDoc'
import { DropResult } from 'react-beautiful-dnd'
import { NoteColumnViewModel } from '../../../../types/note/view/NoteColumnViewModel'
import NoteViewModel from '../../../../types/note/view/NoteViewModel'

export default interface NoteContentProps {
  tags: string[]
  columns: NoteColumnViewModel[]
  onDragEnd: (result: DropResult) => void
  onDeleteNote: (note: NoteDoc) => void
  onSaveColumn: (column: NoteColumnViewModel, oldTitle?: string) => void
  onDeleteColumn: (column: NoteColumnViewModel) => void
  onSaveNewNote: (question: string, tagList: string[], column: NoteColumnViewModel) => void
  onSaveNote: (note: NoteViewModel) => void
  questionAlreadyExists: (question: string) => boolean
}
