import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface CalendarEventTypeEntity
	extends SynchronizableEntity<number> {
	title: string
	color?: string
	icon?: string
	isUniversal: 0 | 1
}
