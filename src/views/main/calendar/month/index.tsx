import React from 'react'
import MonthProps from './props'
import InfoBar from './info_bar'
import MonthDays from './month_days'
import './styles.css'

const Month: React.FC<MonthProps> = ({ name, year }) => {
  return (
    <div className="month">
      <InfoBar currentMonth={name} currentYear={year} />
      <MonthDays />
    </div>
  )
}

export default Month
