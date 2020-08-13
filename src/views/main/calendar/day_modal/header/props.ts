import DayViewModel from "../../../../../types/calendar/DayViewModel";

export default interface DayModalHeaderProps {
  day: DayViewModel
  onClose: () => void
}