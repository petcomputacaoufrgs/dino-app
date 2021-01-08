import React from 'react'
import ContentProps from './props'
import WeekDayColumn from './week_day_column'
import { Calendar } from 'calendar'
import ArrayUtils from '../../../../../utils/ArrayUtils'
import DateUtils from '../../../../../utils/DateUtils'
import DayViewModel from '../../../../../types/calendar/DayViewModel'
import { useLanguage } from '../../../../../context/language'
import './styles.css'

const DAYS_IN_VIEW = 42

const Content: React.FC<ContentProps> = ({ date, isCurrentMonth }) => {
  const language = useLanguage()

  const calendar = new Calendar()

  const getWeekDayFirstChar = (weekDayName: string) => {
    return weekDayName.charAt(0).toUpperCase()
  }

  const getAllMonthDaysThatOccursInAWeekday = (
    dayOfWeek: number
  ): DayViewModel[] => {
    const monthDays = ArrayUtils.apply(
      calendar.monthDates(date.getFullYear(), date.getMonth())
    )

    if (monthDays.length < DAYS_IN_VIEW) {
      const nextMonthDate = DateUtils.getNextMonth(date)

      const nextMonthDays = ArrayUtils.apply(
        calendar.monthDates(
          nextMonthDate.getFullYear(),
          nextMonthDate.getMonth()
        )
      )

      monthDays.push(...nextMonthDays.splice(7, 7))
    }

    const days = monthDays
      .filter((day: Date) => {
        return day.getDay() === dayOfWeek
      })
      .map<DayViewModel>((day) => ({
        date: day,
      }))

    return days
  }

  return (
    <div className="calendar__month__content">
      <WeekDayColumn
        shortName={getWeekDayFirstChar(language.data.SUNDAY_NAME)}
        days={getAllMonthDaysThatOccursInAWeekday(0)}
        first
      />
      <WeekDayColumn
        shortName={getWeekDayFirstChar(language.data.MONDAY_NAME)}
        days={getAllMonthDaysThatOccursInAWeekday(1)}
      />
      <WeekDayColumn
        shortName={getWeekDayFirstChar(language.data.TUESDAY_NAME)}
        days={getAllMonthDaysThatOccursInAWeekday(2)}
      />
      <WeekDayColumn
        shortName={getWeekDayFirstChar(language.data.WEDNESDAY_NAME)}
        days={getAllMonthDaysThatOccursInAWeekday(3)}
      />
      <WeekDayColumn
        shortName={getWeekDayFirstChar(language.data.THURSDAY_NAME)}
        days={getAllMonthDaysThatOccursInAWeekday(4)}
      />
      <WeekDayColumn
        shortName={getWeekDayFirstChar(language.data.FRIDAY_NAME)}
        days={getAllMonthDaysThatOccursInAWeekday(5)}
      />
      <WeekDayColumn
        shortName={getWeekDayFirstChar(language.data.SATURDAY_NAME)}
        days={getAllMonthDaysThatOccursInAWeekday(6)}
      />
    </div>
  )
}

export default Content
