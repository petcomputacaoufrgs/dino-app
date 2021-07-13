import React from 'react'
import { Menu, MenuItem } from '@material-ui/core'
import ItemListMenuProps from './props'
import { useLanguage } from '../../../context/language'
import './styles.css'

const ItemListMenu = ({
	anchor,
	setAnchor,
	onEdit,
	onDelete,
	onCloseDialog,
	editUnavailable,
	editText
}: ItemListMenuProps) => {
	const language = useLanguage()

	const handleClose = () => {
		setAnchor(null)
	}

	const renderEditMenuItem = () => {
		if (!editUnavailable) {
			return (
				<MenuItem onClick={handleEdit}>
					{editText || language.data.EDIT}
				</MenuItem>
			)
		}
	}

	const handleCloseDialog = () => {
		if(onCloseDialog) onCloseDialog()
	}

	const handleEdit = () => {
		handleClose()
		handleCloseDialog()
		onEdit()
	}

	const handleDelete = () => {
		handleClose()
		handleCloseDialog()
		onDelete()
	}

	return (
		<Menu
			anchorEl={anchor}
			open={Boolean(anchor)}
			onClose={handleClose}
			className='item_list___menu_options'
			getContentAnchorEl={null}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
		>
			{renderEditMenuItem()}
			<MenuItem onClick={handleDelete}>
				{language.data.DELETE}
			</MenuItem>
		</Menu>
	)
}

export default ItemListMenu
