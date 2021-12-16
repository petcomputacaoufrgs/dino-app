import React from 'react'
import DinoIconButton from '../../../../../components/button/icon_button'
import CloseIcon from '@material-ui/icons/Close';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { useLanguage } from '../../../../../context/language'
import HeaderProps from './props'
import './styles.css'

const Header: React.FC<HeaderProps> = ({ onClose, onDelete, onEdit }) => {
	const language = useLanguage()

	return (
		<div className='calendar__event_modal__header'>
			<div className='calendar__event_modal__header__right'>
				<DinoIconButton
					ariaLabel={language.data.CALENDAR_CLOSE_BUTTON_ARIA_LABEL}
					icon={CloseIcon}
					onClick={onClose}
				/>
			</div>
			<div className='calendar__event_modal__header__left'>
				<DinoIconButton
					ariaLabel={language.data.CALENDAR_DELETE_BUTTON_ARIA_LABEL}
					icon={CreateIcon}
					onClick={onDelete}
				/>
				<DinoIconButton
					ariaLabel={language.data.CALENDAR_EDIT_BUTTON_ARIA_LABEL}
					icon={DeleteIcon}
					onClick={onEdit}
				/>
			</div>
		</div>
	)
}

export default Header
