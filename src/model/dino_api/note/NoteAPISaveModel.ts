import NoteTagAPIModel from './NoteTagAPIModel'

export default interface NoteAPISaveModel {
    order: number

    question: string

    tagIdList: number[]

    newTags: string[]

    lastUpdateDay: number

    lastUpdateMonth: number

    lastUpdateYear: number
}
