import Note from '../../../../types/Note'

export default interface NotesCardDialogProps {
    open: boolean
    newCard: boolean
    questionCard: boolean
    model: Note
    onClose: () => void
    onSave: (order: number, text: string) => void
}