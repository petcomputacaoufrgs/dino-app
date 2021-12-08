import EventTypeEntity from '../../../../types/calendar/database/EventTypeEntity'
import { EventView } from '../../../../types/calendar/view/CalendarView'

export default interface EventDialogFormProps {
	open: boolean
	onClose: () => void
	item?: EventView
	eventTypes?: EventTypeEntity[]
}
