export default interface NoteLocalModel {
    id?: number
    order: number
    question: string
    answer: string
    answered: boolean
    tagNames: string[]
    lastUpdate: number
    savedOnServer: boolean
}