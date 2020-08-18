import DayViewModel from "../../../../../../types/calendar/DayViewModel";
import EventDoc from "../../../../../../types/calendar/database/EventDoc";

export default interface EventItemProps {
    day: DayViewModel
    event: EventDoc
    totalEventsOnHour: number
}