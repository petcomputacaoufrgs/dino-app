import NoteViewModel from "../../../../types/note/view/NoteViewModel";

export default interface NoteInfoDialogProps {
    note: NoteViewModel
    open: boolean
    tagOptions: string[]
    onSave: (question: string, answer: string, tagList: string[]) => void
    onDelete: () => void
    onClose: () => void
    questionAlreadyExists: (question: string) => boolean
}