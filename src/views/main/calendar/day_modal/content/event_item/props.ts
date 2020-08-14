import EventViewModel from "../../../../../../types/calendar/EventViewModel";
import DayViewModel from "../../../../../../types/calendar/DayViewModel";

export default interface EventItemProps {
    day: DayViewModel
    event: EventViewModel
    totalEventsOnHour: number
}