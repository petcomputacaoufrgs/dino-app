import React from 'react'
import HeaderProps from './props'
import DateUtils from '../../../../../utils/DateUtils'
import { useLanguage } from '../../../../../context_provider/app_settings'
import TodayCalendarSVG from '../../../../../assets/icons/today_calendar.svg'
import { IconButton } from '@material-ui/core'
import './styles.css'

const Header: React.FC<HeaderProps> = ({ date, goToCurrentMonth }) => {
  const language = useLanguage().current

  return (
    <div className="calendar__month__header">
      <h1>
        {DateUtils.getMonthName(date.getMonth(), language)},{' '}
        {date.getFullYear()}
      </h1>
      <div className="calendar__month__header_buttons">
        <div className="calendar__month__header_buttons__today_button">
          <IconButton onClick={goToCurrentMonth} color="primary">
            <img
              src={TodayCalendarSVG}
              alt=""
              className="calendar__month__header_buttons__today_button__image"
            />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default Header
