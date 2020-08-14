import React from 'react'
import { IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { useLanguage } from '../../../../../context_provider/app_settings'
import HeaderProps from './props'
import './styles.css'

const Header: React.FC<HeaderProps> = ({onClose, onDelete, onEdit}) => {

    const language = useLanguage().current
    
    return (
      <div className="calendar__event_modal__header">
        <div className="calendar__event_modal__header__right">
            <IconButton 
                aria-label={language.CLOSE_ARIA_LABEL} 
                onClick={onClose}
            >
            <CloseIcon fontSize="default" />
          </IconButton>
        </div>
        <div className="calendar__event_modal__header__left">
            <IconButton
                aria-label={language.DELETE_ARIA_LABEL}
                onClick={onDelete}
            >
                <EditIcon fontSize="default" />
            </IconButton>
            <IconButton aria-label={language.EDIT_ARIA_LABEL} onClick={onEdit}>
                <DeleteIcon fontSize="default" />
            </IconButton>
        </div>
      </div>
    )
}

export default Header