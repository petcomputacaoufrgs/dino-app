import React from 'react'
import HeaderProps from './props'
import DateUtils from '../../../../../utils/DateUtils'
import { Fab } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useUserSettings } from '../../../../../context/provider/user_settings'
import './styles.css'

const Header: React.FC<HeaderProps> = ({ day, onClose }) => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)

  return (
    <div className="calendar__day__modal__header">
      <div className="calendar__day__modal__header__info">
        <h1>{DateUtils.getDateStringFormated(day.date, language)}</h1>
        <div className="calendar__day__modal__header__info__close">
          <Fab
            color="primary"
            aria-label={language.ADD_ARIA_LABEL}
            onClick={onClose}
          >
            <ExpandMoreIcon />
          </Fab>
        </div>
      </div>
    </div>
  )
}

export default Header
