import React from 'react'
import MenuItemViewModel from '../../../types/menu/MenuItemViewModel'

export default interface DrawerProps {
	open: boolean
	items: MenuItemViewModel[][]
	onClose: () => void
}
