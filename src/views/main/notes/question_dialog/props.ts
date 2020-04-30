import NoteTagLocalModel from '../../../../model/local_storage/NoteTagLocalModel';
export default interface QuestionDialogProps {
    open: boolean
    question: string
    tagList: NoteTagLocalModel[]
    tagOptions: string[]
    onSave: (question: string, tagList: NoteTagLocalModel[]) => void
    onClose: () => void
}