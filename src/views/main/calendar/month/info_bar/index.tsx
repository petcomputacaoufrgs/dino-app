import React from 'react'
import InfoBarProps from './props'
import './styles.css'

const InfoBar: React.FC<InfoBarProps> = ({ currentMonth, currentYear }) => {
  return (
    <div className="calendar__month__info_bar">
      <h1>
        {currentMonth}, {currentYear}
      </h1>
      <div className="calendar__month__info_bar_buttons">
        <button>{'<'}</button>
        <button>{'.'}</button>
        <button>{'>'}</button>
      </div>
    </div>
  )
}

export default InfoBar
