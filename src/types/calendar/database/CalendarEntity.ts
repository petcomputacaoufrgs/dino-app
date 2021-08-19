import SynchronizableEntity from '../../sync/database/SynchronizableEntity'
import CalendarEventTypeEnum from '../CalendarEventEnum'

export default interface CalendarEntity extends SynchronizableEntity<number> {
	EventColors?: EventColorsType[]
}

type EventColorsType = {
	event: CalendarEventTypeEnum
	color: number
}
