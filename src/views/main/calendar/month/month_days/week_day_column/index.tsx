import React from 'react'
import WeekDayColumnProps from './props'
import Title from './title'
import './styles.css'
import DaysColumn from './days_column'

const WeekDayColumn: React.FC<WeekDayColumnProps> = ({ shortName, first, days }) => {
  return (
    <div className="calendar__month__month_days__week_day_column">
      <Title shortName={shortName} first={first} />
      <DaysColumn days={days} first={first} />
    </div>
  )
}

export default WeekDayColumn
