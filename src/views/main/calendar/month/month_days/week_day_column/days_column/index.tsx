import React from 'react'
import DayColumnProps from './props'
import Day from './day'
import './styles.css'

const DaysColumn: React.FC<DayColumnProps> = ({ days, first }) => {
  const getClass = (): string => {
    return `calendar__month__month_days__week_day_column__days_column${
      first ? ' with_two_borders' : ''
    }`
  }

  return (
    <div className={getClass()}>
      {days.map((day, key) => (
        <Day key={key} day={day} />
      ))}
    </div>
  )
}

export default DaysColumn
