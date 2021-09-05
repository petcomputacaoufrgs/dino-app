import EventEntity from '../database/EventEntity'

export interface EventView {
	event: EventEntity
	color?: string
	icon?: string
}

export interface DayView {
	dayOfMonth: string
	dayOfWeek: string
	events: EventView[]
}
