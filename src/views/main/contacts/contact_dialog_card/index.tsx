import React, { forwardRef } from 'react'
import { Dialog } from '@material-ui/core'
import ContactCardProps from './props'
import ContactCardHeader from './header'
import ContactCardContent from './content'
import TransitionSlide from '../../../../components/slide_transition'
import ItemListMenu from '../../../../components/item_list_menu'

const ContactCard = forwardRef(
	(
		{ item, dialogOpen, onClose, onEdit, onDelete }: ContactCardProps,
		ref: React.Ref<unknown>,
	): JSX.Element => {
		const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

		const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
			setAnchorEl(event.currentTarget)
		}

		return (
			<Dialog
				ref={ref}
				style={{ padding: 0 }}
				fullWidth
				maxWidth='xs'
				onClose={onClose}
				TransitionComponent={TransitionSlide}
				open={dialogOpen}
			>
				<ContactCardHeader item={item!} onClick={handleClick}>
					<ItemListMenu
						anchor={anchorEl}
						setAnchor={setAnchorEl}
						onEdit={onEdit}
						onDelete={onDelete}
						onCloseDialog={onClose}
						editAvailable
					/>
				</ContactCardHeader>
				<ContactCardContent item={item!} />
			</Dialog>
		)
	},
)

export default ContactCard
