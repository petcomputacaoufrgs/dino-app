import DayViewModel from '../../../../../../types/calendar/DayViewModel'
import CalendarEventEntity from '../../../../../../types/calendar/database/CalendarEventEntity'

export default interface EventItemProps {
  day: DayViewModel
  event: CalendarEventEntity
  totalEventsOnHour: number
}
