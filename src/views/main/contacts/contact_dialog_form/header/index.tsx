import React from 'react'
import DinoIconButton from '../../../../../components/button/icon_button'
import ColorLensIcon from '@material-ui/icons/ColorLens'
import { Avatar, CardHeader } from '@material-ui/core'
import ContactFormDialogHeaderProps from './props'
import { useLanguage } from '../../../../../context/language'
import '../../styles.css'
import './styles.css'
import { HasStaffPowers } from '../../../../../context/private_router'
import { renderIcon } from '../..'
import { ColorPalette } from '../../../../../components/color_pallete'

const AddContactDialogHeader = (
	props: ContactFormDialogHeaderProps,
): JSX.Element => {
	const language = useLanguage()

	const isStaff = HasStaffPowers()

	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

	const handleClickChooseColor = event => {
		setAnchorEl(event.currentTarget)
	}

	return (
		<CardHeader
			avatar={
				<Avatar
					aria-label={language.data.AVATAR_ALT}
					className={`dino_icon__color-${props.contact.color}`}
				>
					{renderIcon(props.contact)}
				</Avatar>
			}
			action={
				<ColorPalette
					onClick={color => props.setContact({ ...props.contact, color })}
					anchorEl={anchorEl}
					onClose={() => setAnchorEl(null)}
				>
					<DinoIconButton
						ariaLabel={language.data.COLOR_THEME_SELECTION_ARIA_LABEL}
						icon={ColorLensIcon}
						onClick={handleClickChooseColor}
					/>
				</ColorPalette>
			}
			title={
				props.contact.name ||
				(isStaff
					? language.data.CONTACTS_ADD_ESSENTIAL_CONTACT
					: language.data.NEW_CONTACT)
			}
			subheader={language.data.CONTACT}
			className='contact_dialog_form_header'
		/>
	)
}

export default AddContactDialogHeader
