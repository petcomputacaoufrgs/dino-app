import React, { useState, useEffect } from 'react'
import DayModalHour from "../../../../../types/calendar/DayModalHour"
import StringUtils from '../../../../../utils/StringUtils'
import HoursListProps from './props'
import EventViewModel from '../../../../../types/calendar/EventViewModel'
import DateUtils from '../../../../../utils/DateUtils'
import './styles.css'

const HoursList: React.FC<HoursListProps> = ({ day }) => {
  const [updateCount, setUpdateCount] = useState(0)

  const getFormatedHour = (hour: DayModalHour): string => (
    `${StringUtils.toStringWithZeros(
      hour.hour,
      2
    )}:${StringUtils.toStringWithZeros(hour.min, 2)}`
  ) 

  const adjustEndDate = (end: Date) => (
    end.getDate() !== day.date.getDate() ? DateUtils.getEndOfDay(end) : end
  )

  const getEventsByInitHour = (hour: DayModalHour): EventViewModel[] =>
    day.events.filter((event) => event.init_date.getHours() === hour.hour)

  const renderEventsByInitHour = (hour: DayModalHour): JSX.Element => {
    const startedEvents = getEventsByInitHour(hour)

    return (
      <>
        {startedEvents.map((event, index) => {
          console.log(event.init_date)
          console.log(event.end_date)
          const minutes = event.init_date.getMinutes()
          const end = adjustEndDate(event.end_date)

          const hoursDuration = end.getHours() - event.init_date.getHours()
          const minutesDuration =
            end.getMinutes() - event.init_date.getMinutes()

          return (
            <div
              key={index}
              className="calendar__day__modal__hours__hours_list__line__events__item"
              style={{
                width: `${100 / startedEvents.length}%`,
                backgroundColor: event.color,
                transform: `translate3d(0,${(40 / 60) * minutes}px,0)`,
                height: `${
                  (40 / 60) * (hoursDuration * 60 + minutesDuration)
                }px`
              }}
            >
              <p>{event.name}</p>
            </div>
          )
        })}
      </>
    )
  }

  const getNowLineStyles = (): React.CSSProperties => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()

    const top = `${50 + 40 * hours + 40 / 60 * minutes}px` 
    return {
      top: top
    }
  }

  useEffect(() => {
    let updateScreen = () => {
      setUpdateCount(updateCount + 1)
    }

    const cleanBeforeUpdate = () => {
      updateScreen = () => {}
    }

    if (day.isToday) {
      setTimeout(updateScreen, 30000)
    } 

    return cleanBeforeUpdate
  }, [updateCount, day.isToday])

  return (
    <>
      <div className="calendar__day__modal__hours">
        <div className="calendar__day__modal__hours__hours_list">
          {HOURS.map((hour, index) => (
            <div
              key={index}
              className="calendar__day__modal__hours__hours_list__line"
            >
              <div className="calendar__day__modal__hours__hours_list__line__hour">
                {index !== 0 && <p>{getFormatedHour(hour)}</p>}
              </div>
              <div className="calendar__day__modal__hours__hours_list__line__events">
                {renderEventsByInitHour(hour)}
              </div>
            </div>
          ))}
        </div>
      </div>
      {day.isToday && (
        <div
          className="calendar__day__modal__now_line"
          style={getNowLineStyles()}
        ></div>
      )}
    </>
  )
}

const HOURS: DayModalHour[] = [
  { hour: 0, min: 0 },
  { hour: 1, min: 0 },
  { hour: 2, min: 0 },
  { hour: 3, min: 0 },
  { hour: 4, min: 0 },
  { hour: 5, min: 0 },
  { hour: 6, min: 0 },
  { hour: 7, min: 0 },
  { hour: 8, min: 0 },
  { hour: 9, min: 0 },
  { hour: 10, min: 0 },
  { hour: 11, min: 0 },
  { hour: 12, min: 0 },
  { hour: 13, min: 0 },
  { hour: 14, min: 0 },
  { hour: 15, min: 0 },
  { hour: 16, min: 0 },
  { hour: 17, min: 0 },
  { hour: 18, min: 0 },
  { hour: 19, min: 0 },
  { hour: 20, min: 0 },
  { hour: 21, min: 0 },
  { hour: 22, min: 0 },
  { hour: 23, min: 0 },
] 

export default HoursList