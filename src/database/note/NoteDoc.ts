export default interface NoteDoc {
    _id?: string
    _rev?: string
    external_id?: number
    order: number
    question: string
    answer: string
    answered: boolean
    tagNames: string[]
    lastUpdate: number
    savedOnServer: boolean
}