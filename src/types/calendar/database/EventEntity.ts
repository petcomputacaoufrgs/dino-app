import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface EventEntity extends SynchronizableEntity<number> {
	title: string
	description?: string
	typeLocalId?: number
	date: Date
	initTime?: string
	endTime?: string
}
