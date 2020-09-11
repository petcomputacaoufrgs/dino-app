import { NoteColumnViewModel } from '../../../../types/note/view/NoteColumnViewModel'

export default interface NoteColumnDialogProps {
  onClose: () => void
  onSave: (column: NoteColumnViewModel, oldTitle?: string) => void
  open: boolean
  order?: number
  column?: NoteColumnViewModel
  titleAlreadyExists: (title: string) => boolean
}
