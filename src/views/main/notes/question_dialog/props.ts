export default interface QuestionDialogProps {
    open: boolean
    question: string
    tagList: string[]
    tagOptions: string[]
    onSave: (question: string, tagList: string[]) => void
    onClose: () => void
}