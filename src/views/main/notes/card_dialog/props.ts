import Note from '../../../../types/Note'

export default interface NotesCardDialogProps {
    open: boolean
    newCard: boolean
    questionCard: boolean
    model: Note
    tagOptions: string[]
    onClose: () => void
    onSave: (order: number, text: string, tagList: string[]) => void
}