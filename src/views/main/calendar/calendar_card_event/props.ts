import EventTypeEntity from '../../../../types/calendar/database/EventTypeEntity'
import { EventView } from '../../../../types/calendar/view/CalendarView'

export default interface EventDialogFormProps {
	item?: EventView
	open: boolean
	onClose: () => void
	onClickMenu: (event: React.MouseEvent<HTMLButtonElement>, item: EventView | undefined) => void
}