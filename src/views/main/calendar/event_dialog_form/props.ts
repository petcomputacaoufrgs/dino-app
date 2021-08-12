import { EventView } from '../../../../components/calendar/calendar_event';

export default interface EventDialogFormProps {
	open: boolean
	onClose: () => void
	item?: EventView
}
