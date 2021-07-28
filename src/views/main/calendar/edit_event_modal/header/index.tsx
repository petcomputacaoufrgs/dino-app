import React from 'react'
import DinoIconButton from '../../../../../components/button/icon_button'
import CloseIcon from '@material-ui/icons/Close';
import HeaderProps from './props'
import { useLanguage } from '../../../../../context/language'
import './styles.css'

const Header: React.FC<HeaderProps> = ({ onClose }) => {
	const language = useLanguage()

	return (
		<div className='calendar__edit_event_modal__header'>
			<div className='calendar__edit_event_modal__header__left'>
				<DinoIconButton
					ariaLabel={language.data.CALENDAR_EDIT_BUTTON_ARIA_LABEL}
					icon={CloseIcon}
					onClick={onClose}
				/>
			</div>
		</div>
	)
}

export default Header
