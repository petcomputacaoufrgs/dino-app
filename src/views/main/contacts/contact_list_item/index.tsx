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
import ItemListMenu from '../../../../components/item_list_menu'
import Utils from '../../../../utils/Utils'
import './styles.css'

const ContactItemList: React.FC<ContactItemListProps> = ({
	item,
	onClick,
	onEdit,
	onDelete,
	onCloseDialog,
}) => {
	const language = useLanguage()

	const handleOpen = () => onClick(item.contact.localId!)

	const isEssential = () => Utils.isNotEmpty(item.contact.localEssentialContactId)

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const isEditAvailable = item.contact.localEssentialContactId === undefined

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
					{isEssential() ? <Star /> : <></>}
					<OptionsIconButton dark onClick={handleClick} />
				</ListItemSecondaryAction>
			</ListItem>
			<ItemListMenu
				anchor={anchorEl}
				setAnchor={setAnchorEl}
				onEdit={onEdit}
				onDelete={onDelete}
				onCloseDialog={onCloseDialog}
				editAvailable={isEditAvailable}
			/>
		</div>
	)
}

export default ContactItemList
