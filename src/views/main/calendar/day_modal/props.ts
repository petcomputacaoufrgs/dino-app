import DayViewModel from '../../../../types/calendar/DayViewModel'
import CalendarEventEntity from '../../../../types/calendar/database/CalendarEventEntity'

export default interface DayModalProps {
	open: boolean
	onClose: () => void
	day: DayViewModel
	events: CalendarEventEntity[]
}
