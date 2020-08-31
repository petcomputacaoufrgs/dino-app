import DayViewModel from "../../../../../types/calendar/DayViewModel";
import EventDoc from "../../../../../types/calendar/database/EventDoc";

export default interface ContentProps {
  day: DayViewModel,
  events: EventDoc[]
}
