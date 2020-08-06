import React from 'react'
import TitleProps from './props'
import './styles.css'

const Title: React.FC<TitleProps> = ({ shortName, first }) => {
  const getBarClass = (): string => {
    return `calendar__month__month_days__week_day_column__title__separation_bar`
  }

  return (
    <div className="calendar__month__month_days__week_day_column__title">
      <div className="calendar__month__month_days__week_day_column__title__info">
        {first && <div className={getBarClass()} />}
        <h2>{shortName}</h2>
        <div className={getBarClass()} />
      </div>
    </div>
  )
}

export default Title
