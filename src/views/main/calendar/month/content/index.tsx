import React from 'react'
import ContentProps from './props'
import WeekDayColumn from './week_day_column'
import { useLanguage } from '../../../../../context_provider/app_settings'
import { Calendar } from 'calendar'
import ArrayUtils from '../../../../../utils/ArrayUtils'
import DateUtils from '../../../../../utils/DateUtils'
import DayViewModel from '../../../../../types/calendar/DayViewModel'
import './styles.css'

const DAYS_IN_VIEW = 42

const Content: React.FC<ContentProps> = ({ date, isCurrentMonth }) => {
  const language = useLanguage().current

  const calendar = new Calendar()

  const getWeekDayFirstChar = (weekDayName: string) => {
    return weekDayName.charAt(0).toUpperCase()
  }

  const getAllMonthDaysThatOccursInAWeekday = (dayOfWeek: number): DayViewModel[] => {
    const now = new Date()

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

    const days = monthDays
      .filter((day: Date) => {
        return day.getDay() === dayOfWeek
      })
      .map(
        (day) =>
          ({
            isToday: isCurrentMonth && DateUtils.isEqualDay(day, now),
            date: day,
            events:
              isCurrentMonth && DateUtils.isEqualDay(day, now)
                ? [
                    {
                      color: '#4785E6',
                      name: 'Consulta Oftalmo',
                      description: '',
                      init_date: new Date(new Date().getTime() - 7200000),
                      end_date: new Date(new Date().getTime()),
                    },
                    {
                      color: '#4785E6',
                      name: 'Consulta Oftalmo',
                      description: '',
                      init_date: new Date(new Date().getTime() - 7200000),
                      end_date: new Date(new Date().getTime()),
                    },
                    {
                      color: '#4785E6',
                      name: 'Consulta Oftalmo',
                      description: '',
                      init_date: new Date(new Date().getTime() - 7200000),
                      end_date: new Date(new Date().getTime()),
                    },
                    {
                      color: '#5785E6',
                      name: 'Consulta Oftalmo',
                      description: '',
                      init_date: new Date(new Date().getTime() - 3600000),
                      end_date: new Date(new Date().getTime()),
                    },
                    {
                      color: '#4285E6',
                      name: 'Consulta Oftalmo',
                      description: '',
                      init_date: new Date(new Date().getTime() - 3600000),
                      end_date: new Date(new Date().getTime()),
                    },
                    {
                      color: '#4285E6',
                      name: 'Consulta Oftalmo',
                      description: '',
                      init_date: new Date(new Date().getTime() - 3600000),
                      end_date: new Date(new Date().getTime()),
                    },
                    {
                      color: '#4285E6',
                      name: 'Consulta Oftalmo',
                      description: '',
                      init_date: new Date(new Date().getTime() - 4800000),
                      end_date: new Date(new Date().getTime()),
                    },
                    {
                      color: '#4285E6',
                      name: 'Consulta Oftalmo',
                      description: '',
                      init_date: new Date(new Date().getTime() - 1600000),
                      end_date: new Date(new Date().getTime() + 4800000),
                    },
                    {
                      color: '#4285E6',
                      name: 'Consulta Oftalmo',
                      description: '',
                      init_date: new Date(new Date().getTime() - 1600000),
                      end_date: new Date(new Date().getTime() + 44800000),
                    },
                    {
                      color: '#4285E6',
                      name: 'Consulta Oftalmo',
                      description: '',
                      init_date: new Date(new Date().getTime()),
                      end_date: new Date(new Date().getTime() + 4800000),
                    },
                    {
                      color: '#4285E6',
                      name: 'Consulta Oftalmo',
                      description: '',
                      init_date: new Date(new Date().getTime()),
                      end_date: new Date(new Date().getTime() + 4800000),
                    },
                    {
                      color: '#4285E6',
                      name: 'Consulta Oftalmo',
                      description: '',
                      init_date: new Date(new Date().getTime()),
                      end_date: new Date(new Date().getTime() + 4800000),
                    },
                    {
                      color: '#4285E6',
                      name: 'Consulta Oftalmo',
                      description: '',
                      init_date: new Date(new Date().getTime()),
                      end_date: new Date(new Date().getTime() + 4800000),
                    },
                  ]
                : [],
          } as DayViewModel)
      )

      return days
  }

  return (
    <div className="calendar__month__content">
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

export default Content
