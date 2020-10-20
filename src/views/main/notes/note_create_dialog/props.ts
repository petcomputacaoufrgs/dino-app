export default interface NoteCreateDialogProps {
  open: boolean
  tagOptions: string[]
  questionAlreadyExists: (question: string) => boolean
  onSave: (question: string, tagList: string[]) => void
  onClose: () => void
}
