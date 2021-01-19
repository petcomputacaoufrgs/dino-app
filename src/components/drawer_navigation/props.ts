import MenuItemViewModel from '../../types/menu/MenuItemViewModel'

export default interface DrawerNavigationProps {
	groupedItems: MenuItemViewModel[][]

	component: JSX.Element
}
