import DayViewModel from '../../../../../types/calendar/DayViewModel'
import CalendarEventEntity from '../../../../../types/calendar/database/CalendarEventEntity'

export default interface ContentProps {
  day: DayViewModel
  events: CalendarEventEntity[]
}
