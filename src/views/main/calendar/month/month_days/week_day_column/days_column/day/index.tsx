import React from 'react'
import DayProps from './props'
import './styles.css'

const Day: React.FC<DayProps> = ({ day }) => {
  return (
    <div className="calendar__month__month_days__week_day_column__days_column__day">
      <div className="calendar__month__month_days__week_day_column__days_column__day__title">
        <h3>{day}</h3>
      </div>
    </div>
  )
}

export default Day
