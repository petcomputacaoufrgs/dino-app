import EventAlarm from "../../../../../../types/calendar/EventAlarm";

export default interface AlarmItemProps {
  alarm: EventAlarm
  onDelete: (item: EventAlarm) => void
}