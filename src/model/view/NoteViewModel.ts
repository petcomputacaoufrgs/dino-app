export default interface NoteViewModel {
    id: number
    question: string
    answer: string
    answered: boolean
    tagNames: string[]
    showByTag: boolean
    showByQuestion: boolean
    lastUpdate: number
    savedOnServer: boolean
}

