import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface EventEntity extends SynchronizableEntity<number> {
	title: string
	description?: string
	typeLocalId?: number
	date: Date
	endTime?: string
	repeat?: string
	alert?: string
}
