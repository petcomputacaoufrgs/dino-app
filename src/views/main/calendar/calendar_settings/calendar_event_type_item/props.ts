import EventTypeEntity from '../../../../../types/calendar/database/EventTypeEntity'

export interface CalendarEventTypeItemProps {
	item: EventTypeEntity
	onClickMenu: (
		event: React.MouseEvent<HTMLButtonElement>,
		item?: EventTypeEntity | undefined,
	) => void
	onClick: (item: EventTypeEntity) => void
}
