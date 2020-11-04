import React from 'react'
import HeaderProps from './props'
import { useCurrentLanguage } from '../../../../../context/provider/app_settings'
import DateUtils from '../../../../../utils/DateUtils'
import { Fab } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import './styles.css'

const Header: React.FC<HeaderProps> = ({ day, onClose }) => {
  const language = useCurrentLanguage()
    
  return (
    <div className="calendar__day__modal__header">
      <div className="calendar__day__modal__header__info">
        <h1>
          {DateUtils.getDateStringFormated(day.date.getTime(), language)}
        </h1>
        <div className="calendar__day__modal__header__info__close">
          <Fab color="primary" aria-label={language.ADD_ARIA_LABEL} onClick={onClose}>
            <ExpandMoreIcon />
          </Fab>
        </div>
      </div>
    </div>
  )
}

export default Header
