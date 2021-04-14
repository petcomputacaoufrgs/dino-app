import React from 'react'
import { Avatar, CardHeader } from '@material-ui/core'
import ContactCardHeaderProps from './props'
import { Star } from '@material-ui/icons'
import OptionsIconButton from '../../../../../components/button/icon_button/options_icon_button'
import { useLanguage } from '../../../../../context/language'
import PhoneService from '../../../../../services/contact/PhoneService'
import Utils from '../../../../../utils/Utils'
import '../../styles.css'
import './styles.css'
import ContactEntity from '../../../../../types/contact/database/ContactEntity'

const ContactCardHeader: React.FC<ContactCardHeaderProps> = ({ item, onClick, children }) => {
	const language = useLanguage()
	const isEssential = Utils.isNotEmpty((item.contact as ContactEntity).localEssentialContactId)

	return (
		<div className='contact_dialog_content_header dino__text__wrap'>
			<CardHeader
				avatar={
					<Avatar
						aria-label={language.data.AVATAR_ALT}
						className={`avatar__color-${item.contact.color}`}
					>
						{item.contact.name[0].toUpperCase()}
					</Avatar>
				}
				action={
					<div className='dino__flex_row'>
						{isEssential ? <Star /> : <></>}
						<OptionsIconButton dark onClick={onClick} />
					</div>
				}
				title={item.contact.name}
				subheader={PhoneService.getPhoneTypes(item.phones, language.data)}
			/>
			{children}
		</div>
	)
}

export default ContactCardHeader
