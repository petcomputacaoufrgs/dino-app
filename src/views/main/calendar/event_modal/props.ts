import CalendarEventEntity from "../../../../types/calendar/database/CalendarEventEntity"

export default interface EventModalProps {
  event: CalendarEventEntity
  open: boolean
  onClose: () => void
}
