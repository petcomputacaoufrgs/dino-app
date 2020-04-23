import Note from '../../../../types/Note';

export default interface CardProps { 
    onEditQuestion: (model: Note) => void
    onEditAnswer: (model: Note) => void
    onDelete: (order: number) => void
    dragging: any
    content: any
    children?: any
}