import NoteColumnEntity from '../../../../types/note/database/NoteColumnEntity'

export default interface NoteColumnDialogProps {
  onClose: () => void
  onSave: (column: NoteColumnEntity, oldTitle?: string) => void
  open: boolean
  order?: number
  column?: NoteColumnEntity
  titleAlreadyExists: (title: string) => boolean
}
