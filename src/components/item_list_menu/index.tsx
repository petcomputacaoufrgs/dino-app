import React from 'react'
import { Menu, MenuItem } from '@material-ui/core'
import ItemListMenuProps from './props'
import { useLanguage } from '../../context/language'
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
					{editText ? editText : language.data.EDIT_OPTION_TEXT}
				</MenuItem>
			)
		}
	}

	const handleCloseDialog = () => {
		if(onCloseDialog) {
			onCloseDialog()
		}
	}

	const handleEdit = () => {
		onEdit()
		handleClose()
		handleCloseDialog()
	}

	const handleDelete = () => {
		onDelete()
		handleClose()
		handleCloseDialog()
	}

	return (
		<Menu
			anchorEl={anchor}
			open={Boolean(anchor)}
			onClose={handleClose}
			className='item_list___menu_options'
		>
			{renderEditMenuItem()}
			<MenuItem onClick={handleDelete}>
				{language.data.DELETE_OPTION_TEXT}
			</MenuItem>
		</Menu>
	)
}

export default ItemListMenu
