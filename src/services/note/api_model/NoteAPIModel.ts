export default interface NoteAPIModel {
    id: number

    order: number

    question: string

    answer: string

    answered: boolean

    tags: string[]

    lastUpdate: number
}