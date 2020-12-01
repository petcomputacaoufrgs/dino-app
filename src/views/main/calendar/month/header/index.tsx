import React from 'react'
import HeaderProps from './props'
import DateUtils from '../../../../../utils/DateUtils'
import {ReactComponent as TodayCalendarSVG} from '../../../../../assets/icons/today_calendar.svg'
import IconButton from '../../../../../components/button/icon_button'
import { useCurrentLanguage } from '../../../../../context/provider/app_settings'
import './styles.css'

const Header: React.FC<HeaderProps> = ({ date, goToCurrentMonth }) => {
  const language = useCurrentLanguage()

  return (
    <div className="calendar__month__header">
      <h1>
        {DateUtils.getMonthName(date.getMonth(), language)},{' '}
        {date.getFullYear()}
      </h1>
      <div className="calendar__month__header_buttons">
        <div className="calendar__month__header_buttons__today_button">
          <IconButton
            ariaLabel={language.CALENDAR_CURRENT_MONTH_ARIA_LABEL}
            icon={TodayCalendarSVG}
            onClick={goToCurrentMonth}
          />
        </div>
      </div>
    </div>
  )
}

export default Header
