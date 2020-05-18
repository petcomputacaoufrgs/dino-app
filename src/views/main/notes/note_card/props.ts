import NoteViewModel from '../../../../model/view/NoteViewModel'

export default interface NoteCardProps { 
    onEditQuestion: (note: NoteViewModel) => void
    onEditAnswer: (note: NoteViewModel) => void
    onDelete: (id: number) => void
    dragging: boolean
    note: NoteViewModel
    children?: any
}