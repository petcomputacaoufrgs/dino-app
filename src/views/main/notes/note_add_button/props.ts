export default interface NoteAddButtonProps {
  tags: string[]
  onSave: (question: string, tags: string[], answer: string) => void
}
