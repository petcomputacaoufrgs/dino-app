import React, { forwardRef } from 'react'
import { Dialog } from '@material-ui/core'
import ContactCardProps from './props'
import ContactCardHeader from './header'
import ContactCardContent from './content'
import TransitionSlide from '../../../../components/slide_transition'
import ContactMenuItems from '../contact_menu_items'

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
					<ContactMenuItems
						anchor={anchorEl}
						setAnchor={setAnchorEl}
						item={item!}
						onEdit={onEdit}
						onDelete={onDelete}
						onCloseDialog={onClose}
					/>
				</ContactCardHeader>
				<ContactCardContent item={item!} />
			</Dialog>
		)
	},
)

export default ContactCard
