import React from 'react'
import DayModalHour from "../../../../../types/calendar/DayModalHour"
import StringUtils from '../../../../../utils/StringUtils'
import DayModalHoursProps from './props'
import './styles.css'

const DayModalHours: React.FC<DayModalHoursProps> = ({ day }) => {
  const getFormatedHour = (hour: DayModalHour): string => (
    `${StringUtils.toStringWithZeros(
      hour.hour,
      2
    )}:${StringUtils.toStringWithZeros(hour.min, 2)}`
  )

  const getHourLineTransform = (index: number): React.CSSProperties => (
    {
        transform: `translate3d(0, -${index*50}%, 0)`
    }
  )
     

  return (
    <div className="calendar__day__modal__hours">
      <div className="calendar__day__modal__hours__hours_column">
        {HOURS.map((hour, index) => (
            index !== 0 && (
            <div
                key={index}
                className="calendar__day__modal__hours__hours_column__line"
                style={getHourLineTransform(index)}
            >
                <p>{getFormatedHour(hour)}</p>
            </div>
            )
        ))}
      </div>
      <div className="calendar__day__modal__hours__events_column">
        {HOURS.map((hour, index) => (
          <div
            key={index}
            className="calendar__day__modal__hours__events_column__line"
          >
            <p>Teste</p>
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