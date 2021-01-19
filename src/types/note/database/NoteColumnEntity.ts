import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface NoteColumnEntity extends SynchronizableEntity<number> {
	order: number
	title: string
}
