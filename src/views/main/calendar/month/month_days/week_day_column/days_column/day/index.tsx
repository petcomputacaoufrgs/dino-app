import React from 'react'
import DayProps from './props'
import './styles.css'

const Day: React.FC<DayProps> = ({ day }) => {
  const getBoxClass = (): string => (
    `calendar__month__month_days__week_day_column__days_column__box__day__title__box ${day.isToday ? 'today' : ''}`
  )

  return (
    <button className="calendar__month__month_days__week_day_column__days_column__box">
      <div className="calendar__month__month_days__week_day_column__days_column__box__day">
        <div className="calendar__month__month_days__week_day_column__days_column__box__day__title">
          <div className={getBoxClass()}>
            <h3>{day.number}</h3>
          </div>
        </div>
        <div className="calendar__month__month_days__week_day_column__days_column__box__day__events">
          {day.events.map((item, index) => (
            <div key={index} style={{ backgroundColor: item.color }} className="calendar__month__month_days__week_day_column__days_column__box__day__events__item">
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </button>
  )
}

export default Day
