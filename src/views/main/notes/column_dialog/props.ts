import { NoteColumnViewModel } from '../../../../types/note/view/NoteColumnViewModel'
import NoteColumnEntity from '../../../../types/note/database/NoteColumnEntity'

export default interface NoteColumnDialogProps {
  onClose: () => void
  onSave: (column: NoteColumnEntity, oldTitle?: string) => void
  open: boolean
  order?: number
  column?: NoteColumnViewModel
  titleAlreadyExists: (title: string) => boolean
}
