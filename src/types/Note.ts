export default interface Note {
    id: number
    api_id?: number
    question: string
    answer: string
    answered: boolean
    tagList: string[]
}