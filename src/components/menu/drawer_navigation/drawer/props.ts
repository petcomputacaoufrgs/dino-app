import MenuItemViewModel from "../../../../types/menu/MenuItemViewModel";

export default interface DrawerProps {
    open: boolean,
    translateX: number | undefined,
    groupedItems: MenuItemViewModel[][]
    onClose: () => void
}