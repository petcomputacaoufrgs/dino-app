import NoteModel from '../../../../model/NoteModel'

export default interface NoteCardProps { 
    onEditQuestion: (note: NoteModel) => void
    onEditAnswer: (note: NoteModel) => void
    onDelete: (id: number) => void
    dragging: boolean
    note: NoteModel
    children?: any
}