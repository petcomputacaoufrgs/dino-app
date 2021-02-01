import React from 'react'
import IconButton from '../../../../../components/button/icon_button'
import { ReactComponent as ChangeColorIconSVG } from '../../../../../assets/icons/color_lens.svg'
import { Avatar, CardHeader } from '@material-ui/core'
import ContactFormDialogHeaderProps from './props'
import { useLanguage } from '../../../../../context/language'
import '../../styles.css'
import './styles.css'
import ColorConstants from '../../../../../constants/app/ColorConstants'
import { IsStaff } from '../../../../../context/private_router'

const AddContactDialogHeader = (
	props: ContactFormDialogHeaderProps,
): JSX.Element => {
	const language = useLanguage()

	const handleChangeColor = () => {
		const colors = ColorConstants.COLORS
		const index = colors.findIndex(c => c === props.contact.color)
		const color = colors[(index + 1) % colors.length]
		props.setContact({ ...props.contact, color })
	}

	const staff = IsStaff()

	return (
		<CardHeader
			avatar={
				<Avatar
					aria-label={language.data.AVATAR_ALT}
					className={`avatar__color-${props.contact.color}`}
				>
					{props.contact.name ? props.contact.name[0].toUpperCase() : '?'}
				</Avatar>
			}
			action={
				<IconButton
					ariaLabel={language.data.COLOR_THEME_SELECTION_ARIA_LABEL}
					icon={ChangeColorIconSVG}
					dark
					onClick={handleChangeColor}
				/>
			}
			title={props.contact.name || (staff
					? language.data.CONTACTS_ADD_ESSENTIAL_CONTACT
					: language.data.NEW_CONTACT)
			}
			subheader={language.data.CONTACT_DIALOG_FORM_SUBTITLE}
			className='contact_dialog_form_header'
		/>
	)
}

export default AddContactDialogHeader
