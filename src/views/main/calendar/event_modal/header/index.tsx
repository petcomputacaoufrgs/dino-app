import React from 'react'
import IconButton from '../../../../../components/button/icon_button'
import {ReactComponent as CloseIconSVG} from '../../../../../assets/icons/close.svg'
import {ReactComponent as EditIconSVG} from '../../../../../assets/icons/pen.svg'
import {ReactComponent as DeleteIconSVG} from '../../../../../assets/icons/delete.svg'
import HeaderProps from './props'
import './styles.css'

const Header: React.FC<HeaderProps> = ({ onClose, onDelete, onEdit }) => {
  return (
    <div className="calendar__event_modal__header">
      <div className="calendar__event_modal__header__right">
        <IconButton icon={CloseIconSVG} onClick={onClose} />
      </div>
      <div className="calendar__event_modal__header__left">
        <IconButton icon={EditIconSVG} onClick={onDelete} />
        <IconButton icon={DeleteIconSVG} onClick={onEdit} />
      </div>
    </div>
  )
}

export default Header
