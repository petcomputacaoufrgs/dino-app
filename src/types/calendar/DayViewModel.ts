import EventViewModel from "./EventViewModel";

export default interface DayViewModel {
  isToday: boolean
  events: EventViewModel[]
  date: Date
}
