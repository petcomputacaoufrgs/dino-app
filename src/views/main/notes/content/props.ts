import { DropResult } from 'react-beautiful-dnd'
import NoteColumnEntity from '../../../../types/note/database/NoteColumnEntity'
import NoteEntity from '../../../../types/note/database/NoteEntity'
import NoteView from '../../../../types/note/view/NoteView'

export default interface NoteContentProps {
  tags: string[]
  noteViews: NoteView[]
  searching: boolean,
  tagSearch: string[],
  textSearch: string,
  onDragEnd: (result: DropResult) => void
  onSaveColumn: (column: NoteColumnEntity, oldTitle?: string) => void
  onDeleteColumn: (column: NoteColumnEntity) => void
  onSaveNewNote: (
    question: string,
    tagList: string[],
    noteView: NoteView
  ) => void
  onSaveNote: (note: NoteEntity) => void
  onDeleteNote: (note: NoteEntity) => void
  questionAlreadyExists: (question: string) => boolean
}
