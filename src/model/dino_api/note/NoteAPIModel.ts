import NoteTagAPIModel from './NoteTagAPIModel'

export default interface NoteAPIModel {
    id: number

    order: number

    question: string

    answer: string

    answered: boolean

    tagList: NoteTagAPIModel[]

    lastUpdateDay: number

    lastUpdateMonth: number

    lastUpdateYear: number
}