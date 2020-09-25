export default interface NoteColumnEntity {
    id?: number
    external_id?: number
    title: string
    order: number
    lastUpdate: number
    lastOrderUpdate: number
    savedOnServer: boolean
}
