import NoteTagLocalModel from './NoteTagLocalModel'

export default interface NoteLocalModel {
    id?: number
    order: number
    question: string
    answer: string
    answered: boolean
    tagList: NoteTagLocalModel[]
    lastUpdateDay: number
    lastUpdateMonth: number
    lastUpdateYear: number
    savedOnServer: boolean
}