export default interface CalendarEventEntity {
	id?: number

	external_id?: number

	name: string

	description: string

	color: string

	init_date: Date

	end_date: Date

	reminder_alarm_ms: number

	type: number
}
