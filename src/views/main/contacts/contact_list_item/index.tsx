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
import { Star, Public } from '@material-ui/icons'
import { useLanguage } from '../../../../context/language'
import PhoneService from '../../../../services/contact/PhoneService'
import Utils from '../../../../utils/Utils'
import ContactEntity from '../../../../types/contact/database/ContactEntity'
import EssentialContactEntity from '../../../../types/contact/database/EssentialContactEntity'
import './styles.css'

const ContactItemList: React.FC<ContactItemListProps> = ({
	item,
	onClick,
	onClickMenu
}) => {
	
	const language = useLanguage()
	const cameFromEssential = Utils.isNotEmpty((item.contact as ContactEntity).localEssentialContactId)
	const isUniversalEssential = Boolean((item.contact as EssentialContactEntity).isUniversal)

	return (
		<div className='contacts__list__item'>
			<ListItem button divider onClick={() => onClick(item)}>
				<ListItemAvatar>
					<Avatar
						aria-label={language.data.AVATAR_ALT}
						className={`avatar__color-${item.contact.color}`}
					>
						{item.contact.name[0].toUpperCase()}
					</Avatar>
				</ListItemAvatar>
				<ListItemText
					className='list__item__text'
					primary={item.contact.name}
					secondary={PhoneService.getPhoneTypes(item.phones, language.data)}
				/>
				<ListItemSecondaryAction>
					{cameFromEssential ? <Star /> : isUniversalEssential ? <Public /> : <></>}
					<OptionsIconButton dark onClick={(e) => onClickMenu(e, item)} />
				</ListItemSecondaryAction>
			</ListItem>

		</div>
	)
}

export default ContactItemList
