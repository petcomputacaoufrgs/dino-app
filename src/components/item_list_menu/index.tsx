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
	editAvailable,
}: ItemListMenuProps) => {
	const language = useLanguage()

	const handleClose = () => {
		setAnchor(null)
	}

	const renderEditMenuItem = () => {

		if (editAvailable) {
			return (
				<MenuItem onClick={handleEdit}>
					{language.data.EDIT_OPTION_TEXT}
				</MenuItem>
			)
		}
	}

	const handleEdit = () => {
		onEdit()
		handleClose()
		onCloseDialog()
	}

	const handleDelete = () => {
		onDelete()
		handleClose()
		onCloseDialog()
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
