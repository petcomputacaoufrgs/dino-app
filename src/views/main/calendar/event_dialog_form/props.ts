import { CalendarDayView } from '../../../../types/calendar/view/CalendarView'

export default interface EventDialogFormProps {
	open: boolean
	onClose: () => void
	item?: CalendarDayView
}
