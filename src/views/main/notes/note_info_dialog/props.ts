import NoteViewModel from "../../../../types/note/view/NoteViewModel";

export default interface NoteInfoDialogProps {
    note: NoteViewModel
    open: boolean
    tagOptions: string[]
    onClose: () => void
}