import MenuItemViewModel from '../../types/menu/MenuItemViewModel'

export default interface DrawerNavigationProps {
	items: MenuItemViewModel[][]

	component: JSX.Element
}
