import DayViewModel from '../../../../types/calendar/DayViewModel'
import EventDoc from '../../../../types/calendar/database/EventDoc'

export default interface DayModalProps {
  open: boolean
  onClose: () => void
  day: DayViewModel
  events: EventDoc[]
}
