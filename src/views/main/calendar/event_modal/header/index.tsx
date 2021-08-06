import React from 'react'
import DinoIconButton from '../../../../../components/button/icon_button'
import { ReactComponent as CloseIconSVG } from '../../../../../assets/icons/close.svg'
import { ReactComponent as EditIconSVG } from '../../../../../assets/icons/pen.svg'
import { ReactComponent as DeleteIconSVG } from '../../../../../assets/icons/delete.svg'
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
					icon={CloseIconSVG}
					onClick={onClose}
				/>
			</div>
			<div className='calendar__event_modal__header__left'>
				<DinoIconButton
					ariaLabel={language.data.CALENDAR_DELETE_BUTTON_ARIA_LABEL}
					icon={EditIconSVG}
					onClick={onDelete}
				/>
				<DinoIconButton
					ariaLabel={language.data.CALENDAR_EDIT_BUTTON_ARIA_LABEL}
					icon={DeleteIconSVG}
					onClick={onEdit}
				/>
			</div>
		</div>
	)
}

export default Header
