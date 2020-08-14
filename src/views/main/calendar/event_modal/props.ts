import EventViewModel from "../../../../types/calendar/EventViewModel";

export default interface EventModalProps {
  event: EventViewModel
  open: boolean
  onClose: () => void
}