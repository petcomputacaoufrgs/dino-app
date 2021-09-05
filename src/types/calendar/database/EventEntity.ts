import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface CalendarEventEntity
	extends SynchronizableEntity<number> {
	title: string
	description?: string
	typeLocalId?: number
	beginTime: string
	endTime?: string
	date: Date
}
