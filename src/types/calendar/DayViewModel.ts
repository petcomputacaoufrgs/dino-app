import EventViewModel from "./EventViewModel";

export default interface DayViewModel {
  number: number
  isToday: boolean
  events: EventViewModel[]
}
