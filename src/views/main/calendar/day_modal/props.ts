import DayViewModel from "../../../../types/calendar/DayViewModel";

export default interface DayModalProps {
  open: boolean,
  onClose: () => void,
  day: DayViewModel
}