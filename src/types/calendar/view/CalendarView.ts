import EventEntity from '../database/EventEntity'
import EventTypeEntity from '../database/EventTypeEntity'

export interface EventView {
	event: EventEntity
	type?: EventTypeEntity
}

export interface DayView {
	dayOfMonth: string
	dayOfWeek: string
	events: EventView[]
}
