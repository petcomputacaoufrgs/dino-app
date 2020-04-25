export default interface NoteViewModel {
    id: number
    api_id?: number
    question: string
    answer: string
    answered: boolean
    tagList: string[]
    showByTag: boolean
    showByQuestion: boolean
    creationDay: number
    creationMonth: number
    creationYear: number
}

