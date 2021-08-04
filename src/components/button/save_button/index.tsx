import React from 'react'
import Button from '..'
import { useLanguage } from '../../../context/language'
import { ReactComponent as SaveSVG } from '../../../assets/icons/general_use/save.svg'
import './styles.css'
import ButtonProps from '../props'

export const SaveButton: React.FC<ButtonProps> = props => {
	const language = useLanguage()

	return (
		<div className='settings__save_button_container'>
			<Button className='settings__save_button' {...props}>
				<SaveSVG className='settings__save_button__icon' />
				{language.data.SAVE}
			</Button>
		</div>
	)
}
