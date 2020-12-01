import React from 'react'
import IconButton from '../../../../../components/button/icon_button'
import {ReactComponent as CloseIconSVG} from '../../../../../assets/icons/close.svg'
import {ReactComponent as EditIconSVG} from '../../../../../assets/icons/pen.svg'
import {ReactComponent as DeleteIconSVG} from '../../../../../assets/icons/delete.svg'
import HeaderProps from './props'
import './styles.css'
import { useCurrentLanguage } from '../../../../../context/provider/app_settings'

const Header: React.FC<HeaderProps> = ({ onClose, onDelete, onEdit }) => {
  const language = useCurrentLanguage()
  
  return (
    <div className="calendar__event_modal__header">
      <div className="calendar__event_modal__header__right">
        <IconButton
          ariaLabel={language.CALENDAR_CLOSE_BUTTON_ARIA_LABEL}
          icon={CloseIconSVG}
          onClick={onClose}
        />
      </div>
      <div className="calendar__event_modal__header__left">
        <IconButton
          ariaLabel={language.CALENDAR_DELETE_BUTTON_ARIA_LABEL}
          icon={EditIconSVG}
          onClick={onDelete}
        />
        <IconButton
          ariaLabel={language.CALENDAR_EDIT_BUTTON_ARIA_LABEL}
          icon={DeleteIconSVG}
          onClick={onEdit}
        />
      </div>
    </div>
  )
}

export default Header
