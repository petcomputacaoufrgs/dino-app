import React from 'react'
import MenuItemViewModel from "../../../types/menu/MenuItemViewModel";

export default interface DrawerProps {
    open: boolean,
    groupedItems: MenuItemViewModel[][]
    onClose: () => void
    onOpen: () => void
    swipeZoneEl: React.MutableRefObject<HTMLDivElement | null>
}