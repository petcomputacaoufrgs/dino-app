import EventDoc from '../../../../types/calendar/database/EventDoc'

export default interface EventModalProps {
  event: EventDoc
  open: boolean
  onClose: () => void
}
