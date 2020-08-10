import React from 'react'
import MonthDaysProps from './props'
import WeekDayColumn from './week_day_column'
import { useLanguage } from '../../../../../context_provider/app_settings'
import { Calendar } from 'calendar'
import ArrayUtils from '../../../../../utils/ArrayUtils'
import DateUtils from '../../../../../utils/DateUtils'
import './styles.css'

const DAYS_IN_VIEW = 42

const MonthDays: React.FC<MonthDaysProps> = ({
  date
}) => {
  const language = useLanguage().current

  const calendar = new Calendar()

  const getWeekDayFirstChar = (weekDayName: string) => {
    return weekDayName.charAt(0).toUpperCase()
  }

  const getAllMonthDaysThatOccursInAWeekday = (dayOfWeek: number): number[] => {
    const monthDays = ArrayUtils.merge(
      calendar.monthDates(date.getFullYear(), date.getMonth())
    )

    if (monthDays.length < DAYS_IN_VIEW) {
      const nextMonthDate = DateUtils.getNextMonth(date)

      const nextMonthDays = ArrayUtils.merge(
        calendar.monthDates(
          nextMonthDate.getFullYear(),
          nextMonthDate.getMonth()
        )
      )

      monthDays.push(...nextMonthDays.splice(7, 7))
    }

    const days = monthDays.filter((day: Date) => {
      return day.getDay() === dayOfWeek
    }).map(day => day.getDate())

    return days
  }
  
  return (
    <div className="calendar__month__month_days">
      <WeekDayColumn
        shortName={getWeekDayFirstChar(language.SUNDAY_NAME)}
        days={getAllMonthDaysThatOccursInAWeekday(0)}
        first
      />
      <WeekDayColumn
        shortName={getWeekDayFirstChar(language.MONDAY_NAME)}
        days={getAllMonthDaysThatOccursInAWeekday(1)}
      />
      <WeekDayColumn
        shortName={getWeekDayFirstChar(language.TUESDAY_NAME)}
        days={getAllMonthDaysThatOccursInAWeekday(2)}
      />
      <WeekDayColumn
        shortName={getWeekDayFirstChar(language.WEDNESDAY_NAME)}
        days={getAllMonthDaysThatOccursInAWeekday(3)}
      />
      <WeekDayColumn
        shortName={getWeekDayFirstChar(language.THURSDAY_NAME)}
        days={getAllMonthDaysThatOccursInAWeekday(4)}
      />
      <WeekDayColumn
        shortName={getWeekDayFirstChar(language.FRIDAY_NAME)}
        days={getAllMonthDaysThatOccursInAWeekday(5)}
      />
      <WeekDayColumn
        shortName={getWeekDayFirstChar(language.SATURDAY_NAME)}
        days={getAllMonthDaysThatOccursInAWeekday(6)}
      />
    </div>
  )
}

export default MonthDays
