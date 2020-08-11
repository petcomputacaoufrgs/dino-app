import React from 'react'
import MonthProps from './props'
import InfoBar from './info_bar'
import MonthDays from './month_days'
import './styles.css'

const Month: React.FC<MonthProps> = ({ date, goToCurrentMonth, isCurrentMonth }) => {
  return (
    <div className="month">
      <InfoBar date={date} goToCurrentMonth={goToCurrentMonth} />
      <MonthDays date={date} isCurrentMonth={isCurrentMonth}/>
    </div>
  )
}

export default Month
