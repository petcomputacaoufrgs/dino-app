import React from 'react'
import MonthDaysProps from './props'
import WeekDayColumn from './week_day_column'
import { useLanguage } from '../../../../../context_provider/app_settings'
import './styles.css'

const MonthDays: React.FC<MonthDaysProps> = () => {
  const language = useLanguage().current

  const getWeekDayFirstChar = (weekDayName: string) => {
    return weekDayName.charAt(0).toUpperCase()
  }

  return (
    <div className="calendar__month__month_days">
      <WeekDayColumn
        shortName={getWeekDayFirstChar(language.SUNDAY_NAME)}
        first
      />
      <WeekDayColumn shortName={getWeekDayFirstChar(language.MONDAY_NAME)} />
      <WeekDayColumn shortName={getWeekDayFirstChar(language.TUESDAY_NAME)} />
      <WeekDayColumn shortName={getWeekDayFirstChar(language.WEDNESDAY_NAME)} />
      <WeekDayColumn shortName={getWeekDayFirstChar(language.THURSDAY_NAME)} />
      <WeekDayColumn shortName={getWeekDayFirstChar(language.FRIDAY_NAME)} />
      <WeekDayColumn shortName={getWeekDayFirstChar(language.SATURDAY_NAME)} />
    </div>
  )
}

export default MonthDays
