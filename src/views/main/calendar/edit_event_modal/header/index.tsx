import React from 'react'
import IconButton from '../../../../../components/button/icon_button'
import {ReactComponent as CloseIconSVG} from '../../../../../assets/icons/close.svg'
import HeaderProps from './props'
import './styles.css'

const Header: React.FC<HeaderProps> = ({ onClose }) => {
  return (
    <div className="calendar__edit_event_modal__header">
      <div className="calendar__edit_event_modal__header__left">
        <IconButton  icon={CloseIconSVG} onClick={onClose} />
      </div>
    </div>
  )
}

export default Header
