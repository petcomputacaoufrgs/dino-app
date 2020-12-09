import { DropResult } from 'react-beautiful-dnd'
import { NoteContextType } from '../../../../context/provider/note'
import { NoteColumnContextType } from '../../../../context/provider/note_column'
import NoteColumnEntity from '../../../../types/note/database/NoteColumnEntity'
import NoteEntity from '../../../../types/note/database/NoteEntity'
import NoteView from '../../../../types/note/view/NoteView'

export default interface NoteContentProps {
  column: NoteColumnContextType
  tags: string[]
  noteView: NoteView[]
  searching: boolean
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
