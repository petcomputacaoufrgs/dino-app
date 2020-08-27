import Week from "../../types/weekday_picker/Week"
import Weekday from "../../types/weekday_picker/Weekday"

export default interface WeekDayPickerProps {
    onWeekdayClick: (weekday: Weekday) => void
    week: Week 
}