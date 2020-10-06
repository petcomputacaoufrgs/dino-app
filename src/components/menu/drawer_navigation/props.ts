import MenuItemViewModel from '../../../types/menu/MenuItemViewModel'

export default interface DrawerNavigationProps {
  groupedItems: MenuItemViewModel[][]

  translateMenuX: number | undefined

  component?: JSX.Element
}
