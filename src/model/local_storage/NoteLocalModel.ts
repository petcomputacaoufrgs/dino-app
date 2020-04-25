export default interface NoteLocalModel {
    id?: number
    order: number
    question: string
    answer: string
    answered: boolean
    tagList: string[]
    creationDay: number
    creationMonth: number
    creationYear: number
    savedOnServer: boolean
}