import React from 'react'
import InfoBarProps from './props'
import './styles.css'
import DateUtils from '../../../../../utils/DateUtils'
import { useLanguage } from '../../../../../context_provider/app_settings'

const InfoBar: React.FC<InfoBarProps> = ({ date, goToCurrentMonth }) => {

  const language = useLanguage().current

  return (
    <div className="calendar__month__info_bar">
      <h1>
        {DateUtils.getMonthName(date.getMonth(), language)}, {date.getFullYear()}
      </h1>
      <div className="calendar__month__info_bar_buttons">
        <button onClick={goToCurrentMonth}>{'.'}</button>
      </div>
    </div>
  )
}

export default InfoBar
