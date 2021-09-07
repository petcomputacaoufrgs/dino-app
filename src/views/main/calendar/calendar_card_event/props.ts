import { EventView } from '../../../../types/calendar/view/CalendarView'

export default interface CardEventProps {
	item?: EventView
	open: boolean
	onClose: () => void
	onEdit?: () => void
	onDelete: () => void
}