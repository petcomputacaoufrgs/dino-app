import SynchronizableEntity from '../../sync/database/SynchronizableEntity'
import CalendarEventEnum from '../CalendarEventEnum'

export default interface CalendarEntity extends SynchronizableEntity<number> {
	EventColors?: EventColorsType[]
}

type EventColorsType = {
	event: CalendarEventEnum
	color: number
}
