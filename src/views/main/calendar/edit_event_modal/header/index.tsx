import React from 'react'
import IconButton from '../../../../../components/button/icon_button'
import { ReactComponent as CloseIconSVG } from '../../../../../assets/icons/close.svg'
import HeaderProps from './props'
import { useUserSettings } from '../../../../../context/provider/user_settings'
import './styles.css'

const Header: React.FC<HeaderProps> = ({ onClose }) => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)

  return (
    <div className="calendar__edit_event_modal__header">
      <div className="calendar__edit_event_modal__header__left">
        <IconButton
          ariaLabel={language.CALENDAR_EDIT_BUTTON_ARIA_LABEL}
          icon={CloseIconSVG}
          onClick={onClose}
        />
      </div>
    </div>
  )
}

export default Header
