import SynchronizableEntity from '../../synchronizable/database/SynchronizableEntity'

export default interface NoteEntity extends SynchronizableEntity<number, number> {
    order: number
    question: string
    answer: string
    tags: string[]
    localColumnId?: number
}
