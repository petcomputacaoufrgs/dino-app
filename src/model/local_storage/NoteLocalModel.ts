export default interface NoteLocalModel {
    id?: number
    order: number
    question: string
    answer: string
    answered: boolean
    tagNames: string[]
    lastUpdateDay: number
    lastUpdateMonth: number
    lastUpdateYear: number
    savedOnServer: boolean
}