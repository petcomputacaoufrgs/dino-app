import React from 'react'
import DayModalHour from "../../../../../types/calendar/DayModalHour"
import StringUtils from '../../../../../utils/StringUtils'
import DayModalHoursProps from './props'
import './styles.css'
import EventViewModel from '../../../../../types/calendar/EventViewModel'

const DayModalHours: React.FC<DayModalHoursProps> = ({ day }) => {

  const getFormatedHour = (hour: DayModalHour): string => (
    `${StringUtils.toStringWithZeros(
      hour.hour,
      2
    )}:${StringUtils.toStringWithZeros(hour.min, 2)}`
  ) 

  const getEventsStartedBeforeAndEndedAfter = (hour: DayModalHour): EventViewModel[] =>
    day.events.filter((event) => event.init_hour < hour.hour && event.end_hour > hour.hour)
  
  const getEventsByInitHour = (hour: DayModalHour): EventViewModel[] =>
    day.events.filter((event) => event.init_hour === hour.hour)

  const renderEventsByInitHour = (hour: DayModalHour): JSX.Element => {
    const startedEvents = getEventsByInitHour(hour)
    const currentEvents = getEventsStartedBeforeAndEndedAfter(hour)

    const eventsCount = startedEvents.length + currentEvents.length

    return (
      <>
        {startedEvents.map((event, index) => (
          <div
            key={index}
            className="calendar__day__modal__hours__hours_list__line__events__item"
            style={{ width: `${100 / eventsCount}%` }}
          >
            {event.name}
          </div>
        ))}
      </>
    )
  }

  return (
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

export default DayModalHours