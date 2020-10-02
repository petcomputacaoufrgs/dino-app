import { DropResult } from 'react-beautiful-dnd'
import { NoteColumnViewModel } from '../../../../types/note/view/NoteColumnViewModel'
import NoteViewModel from '../../../../types/note/view/NoteViewModel'
import NoteColumnEntity from '../../../../types/note/database/NoteColumnEntity'

export default interface NoteContentProps {
  tags: string[]
  columns: NoteColumnViewModel[]
  searching: boolean
  onDragEnd: (result: DropResult) => void
  onSaveColumn: (column: NoteColumnEntity, oldTitle?: string) => void
  onDeleteColumn: (column: NoteColumnViewModel) => void
  onSaveNewNote: (question: string, tagList: string[], column: NoteColumnViewModel) => void
  onSaveNote: (note: NoteViewModel) => void
  onDeleteNote: (note: NoteViewModel) => void
  questionAlreadyExists: (question: string) => boolean
}
