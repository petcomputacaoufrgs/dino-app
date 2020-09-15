import NoteDoc from '../../../../types/note/database/NoteDoc'
import { DropResult } from 'react-beautiful-dnd'
import { NoteColumnViewModel } from '../../../../types/note/view/NoteColumnViewModel'
import NoteViewModel from '../../../../types/note/view/NoteViewModel'

export default interface NoteBodyProps {
  tags: string[]
  columns: NoteColumnViewModel[]
  onSave: (note: NoteDoc) => void
  onSaveNew: (question: string, tagList: string[], answer: string) => void
  onDeleteNote: (note: NoteDoc) => void
  onSaveColumn: (column: NoteColumnViewModel, oldTitle?: string) => void
  onDeleteColumn: (column: NoteColumnViewModel) => void
  onDragEnd: (result: DropResult) => void
  onAddNote: (column: NoteColumnViewModel) => void
  onClickNote: (note: NoteViewModel) => void
}
