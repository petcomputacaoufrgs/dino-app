import React, { useState, useEffect } from 'react'
import DayModalHour from "../../../../../types/calendar/DayModalHour"
import StringUtils from '../../../../../utils/StringUtils'
import ContentProps from './props'
import EventItem from './event_item'
import EventDoc from '../../../../../types/calendar/database/EventDoc'
import DateUtils from '../../../../../utils/DateUtils'
import './styles.css'

const DELAY_TO_UPDATE_SCREE_WITH_CURRENT_TIME_IN_MS = 60000

const Content: React.FC<ContentProps> = ({ day, events }) => {
  const [updateCount, setUpdateCount] = useState(0)
  const isToday = DateUtils.isToday(day.date)

  const getFormatedHour = (hour: DayModalHour): string => (
    `${StringUtils.toStringWithZeros(
      hour.hour,
      2
    )}:${StringUtils.toStringWithZeros(hour.min, 2)}`
  ) 

  const getEventsByInitHour = (hour: DayModalHour): EventDoc[] => {
    return events.filter(event => event.init_date.getHours() === hour.hour)
  }

  const renderEventsByInitHour = (hour: DayModalHour): JSX.Element => {
    const startedEvents = getEventsByInitHour(hour)

    return (
      <>
        {startedEvents.map((event, index) => {
          return <EventItem key={index} day={day} event={event} totalEventsOnHour={startedEvents.length} />
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
    if (isToday && updateCount === 0) {
      const element = document.getElementById(
        'calendar__day__modal__hours__hours_list'
      )

      const now = new Date()

      if (element) {
        const scrollTo =
          ((element.scrollHeight - element.clientHeight) / 1440) *
          (now.getHours() * 60 + now.getMinutes())
        element.scrollTop = scrollTo
      }
    }
  }, [updateCount])

  useEffect(() => {
    let updateScreen = () => {
      setUpdateCount(updateCount + 1)
    }

    const cleanBeforeUpdate = () => {
      updateScreen = () => {}
    }

    if (DateUtils.isToday(day.date)) {
      setTimeout(
        updateScreen,
        DELAY_TO_UPDATE_SCREE_WITH_CURRENT_TIME_IN_MS
      )
    } 

    return cleanBeforeUpdate
  }, [updateCount, day.date])

  return (
    <>
      <div className="calendar__day__modal__hours">
        <div
          id="calendar__day__modal__hours__hours_list"
          className="calendar__day__modal__hours__hours_list"
        >
          {HOURS.map((hour, index) => (
            <div
              key={index}
              className={`calendar__day__modal__hours__hours_list__line${
                isToday ? ' today' : ' n_today'
              }`}
            >
              <div className="calendar__day__modal__hours__hours_list__line__hour">
                {index !== 0 && <p>{getFormatedHour(hour)}</p>}
              </div>
              <div className="calendar__day__modal__hours__hours_list__line__events">
                {renderEventsByInitHour(hour)}
              </div>
            </div>
          ))}
          {isToday && (
            <div
              className="calendar__day__modal__now_line"
              style={getNowLineStyles()}
            ></div>
          )}
        </div>
      </div>
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

export default Content