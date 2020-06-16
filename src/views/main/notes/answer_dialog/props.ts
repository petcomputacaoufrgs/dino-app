export default interface AnswerDialogProps {
  open: boolean
  answer: string
  onSave: (answer: string) => void
  onClose: () => void
}
