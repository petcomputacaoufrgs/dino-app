import React from 'react'
import ContactItemListProps from './props'
import {
	Avatar,
	ListItem,
	ListItemText,
	ListItemAvatar,
	ListItemSecondaryAction,
} from '@material-ui/core'
import OptionsIconButton from '../../../../components/button/icon_button/options_icon_button'
import { Star } from '@material-ui/icons'
import { useLanguage } from '../../../../context/language'
import PhoneService from '../../../../services/contact/PhoneService'
import Utils from '../../../../utils/Utils'
import './styles.css'

const ContactItemList: React.FC<ContactItemListProps> = ({
	item,
	onClick,
	setSelected,
	setAnchor
}) => {
	const language = useLanguage()

	const handleOpen = () => {
		setSelected(item)
		onClick()
	}

	const isEssential = Utils.isNotEmpty(item.contact.localEssentialContactId)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(event.currentTarget)
    setSelected(item)
  }

	return (
		<div className='contacts__list__item'>
			<ListItem button divider onClick={handleOpen}>
				<ListItemAvatar>
					<Avatar
						aria-label={language.data.AVATAR_ALT}
						className={`avatar__color-${item.contact.color}`}
					>
						{item.contact.name[0].toUpperCase()}
					</Avatar>
				</ListItemAvatar>
				<ListItemText
					primary={item.contact.name}
					secondary={PhoneService.getPhoneTypes(item.phones, language.data)}
				/>
				<ListItemSecondaryAction>
					{isEssential ? <Star /> : <></>}
					<OptionsIconButton dark onClick={handleClick} />
				</ListItemSecondaryAction>
			</ListItem>

		</div>
	)
}

export default ContactItemList
