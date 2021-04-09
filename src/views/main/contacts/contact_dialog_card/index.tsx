import React from 'react'
import { Dialog } from '@material-ui/core'
import ContactCardProps from './props'
import ContactCardHeader from './header'
import ContactCardContent from './content'
import TransitionSlide from '../../../../components/slide_transition'
import ItemListMenu from '../../../../components/item_list_menu'
import ContactEntity from '../../../../types/contact/database/ContactEntity'

const ContactCard = ({ item, dialogOpen, onClose, onEdit, onDelete }: ContactCardProps) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	return item ?
		<Dialog
			style={{ padding: 0 }}
			fullWidth
			onClose={onClose}
			TransitionComponent={TransitionSlide}
			open={dialogOpen}
		>
			<ContactCardHeader item={item} onClick={handleClick}>
				<ItemListMenu
					anchor={anchorEl}
					setAnchor={setAnchorEl}
					onEdit={onEdit}
					onDelete={onDelete}
					onCloseDialog={onClose}
					editUnavailable={(item.contact as ContactEntity).localEssentialContactId !== undefined}
				/>
			</ContactCardHeader>
			<ContactCardContent item={item} />
		</Dialog>
		: <></>
}

export default ContactCard
