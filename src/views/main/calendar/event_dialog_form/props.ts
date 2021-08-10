import CalendarEventEntity from '../../../../types/calendar/database/CalendarEventEntity'

export default interface EventDialogFormProps {
	open: boolean
	onClose: () => void
	item?: CalendarEventEntity
}
