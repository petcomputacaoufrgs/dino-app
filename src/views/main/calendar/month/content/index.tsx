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
        (day): DayViewModel => ({
          isToday: isCurrentMonth && DateUtils.isEqualDay(day, now),
          date: day,
          events:
            isCurrentMonth && DateUtils.isEqualDay(day, now)
              ? [
                  {
                    color: '#4785E6',
                    name: 'Consulta Oftalmo',
                    description:
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.",
                    init_date: new Date(new Date().getTime() - 7200000),
                    end_date: new Date(new Date().getTime()),
                    alarm: new Date(new Date().getTime() - 9200000),
                    type: 0,
                  },
                  {
                    color: '#4785E6',
                    name: 'Consulta Oftalmo',
                    description:
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.",
                    init_date: new Date(new Date().getTime() - 7200000),
                    end_date: new Date(new Date().getTime()),
                    alarm: new Date(new Date().getTime() - 9200000),
                    type: 0,
                  },
                  {
                    color: '#4785E6',
                    name: 'Consulta Oftalmo',
                    description:
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.",
                    init_date: new Date(new Date().getTime() - 7200000),
                    end_date: new Date(new Date().getTime()),
                    alarm: new Date(new Date().getTime() - 9200000),
                    type: 0,
                  },
                  {
                    color: '#5785E6',
                    name: 'Consulta Oftalmo',
                    description:
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.",
                    init_date: new Date(new Date().getTime() - 3600000),
                    end_date: new Date(new Date().getTime()),
                    alarm: new Date(new Date().getTime() - 9200000),
                    type: 0,
                  },
                  {
                    color: '#4285E6',
                    name: 'Consulta Oftalmo',
                    description:
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.",
                    init_date: new Date(new Date().getTime() - 3600000),
                    end_date: new Date(new Date().getTime()),
                    alarm: new Date(new Date().getTime() - 9200000),
                    type: 0,
                  },
                  {
                    color: '#4285E6',
                    name: 'Consulta Oftalmo',
                    description:
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.",
                    init_date: new Date(new Date().getTime() - 3600000),
                    end_date: new Date(new Date().getTime()),
                    alarm: new Date(new Date().getTime() - 9200000),
                    type: 0,
                  },
                  {
                    color: '#4285E6',
                    name: 'Consulta Oftalmo',
                    description:
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.",
                    init_date: new Date(new Date().getTime() - 4800000),
                    end_date: new Date(new Date().getTime()),
                    alarm: new Date(new Date().getTime() - 9200000),
                    type: 0,
                  },
                  {
                    color: '#4285E6',
                    name: 'Consulta Oftalmo',
                    description:
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.",
                    init_date: new Date(new Date().getTime() - 1600000),
                    end_date: new Date(new Date().getTime() + 4800000),
                    alarm: new Date(new Date().getTime() - 9200000),
                    type: 0,
                  },
                  {
                    color: '#4285E6',
                    name: 'Consulta Oftalmo',
                    description:
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.",
                    init_date: new Date(new Date().getTime() - 1600000),
                    end_date: new Date(new Date().getTime() + 44800000),
                    alarm: new Date(new Date().getTime() - 9200000),
                    type: 0,
                  },
                  {
                    color: '#4285E6',
                    name: 'Consulta Oftalmo',
                    description:
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.",
                    init_date: new Date(new Date().getTime()),
                    end_date: new Date(new Date().getTime() + 4800000),
                    alarm: new Date(new Date().getTime() - 9200000),
                    type: 0,
                  },
                  {
                    color: '#4285E6',
                    name: 'Consulta Oftalmo',
                    description:
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.",
                    init_date: new Date(new Date().getTime()),
                    end_date: new Date(new Date().getTime() + 4800000),
                    alarm: new Date(new Date().getTime() - 9200000),
                    type: 0,
                  },
                  {
                    color: '#4285E6',
                    name: 'Consulta Oftalmo',
                    description:
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.",
                    init_date: new Date(new Date().getTime()),
                    end_date: new Date(new Date().getTime() + 4800000),
                    alarm: new Date(new Date().getTime() - 9200000),
                    type: 0,
                  },
                  {
                    color: '#4285E6',
                    name: 'Antes',
                    description:
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.",
                    init_date: new Date(new Date().getTime()),
                    end_date: new Date(new Date().getTime() + 4800000),
                    alarm: new Date(new Date().getTime() - 192000000),
                    type: 0,
                  },
                ]
              : [],
        })
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
