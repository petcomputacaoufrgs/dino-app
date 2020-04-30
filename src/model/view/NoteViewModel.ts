import NoteTagLocalModel from '../local_storage/NoteTagLocalModel'

export default interface NoteViewModel {
    id: number
    api_id?: number
    question: string
    answer: string
    answered: boolean
    tagList: NoteTagLocalModel[]
    showByTag: boolean
    showByQuestion: boolean
    lastUpdateDay: number
    lastUpdateMonth: number
    lastUpdateYear: number
    savedOnServer: boolean
}

