export interface CalendarEventView {
	title: string
	description?: string
	color?: string
	time: string
}

export interface CalendarDayView {
	dayOfMonth: string
	events: CalendarEventView[]
}
