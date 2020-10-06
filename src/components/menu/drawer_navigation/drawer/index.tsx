import React from 'react'
import DrawerProps from './props'
import './styles.css'
import { Divider, IconButton, makeStyles, createStyles, Theme } from '@material-ui/core'
import { ChevronLeft as ChevronLeftIcon } from '@material-ui/icons'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import MenuItemViewModel from '../../../../types/menu/MenuItemViewModel'

const Drawer: React.FC<DrawerProps> = ({
    open,
    translateX,
    groupedItems,
    onClose
}) => {

    const handleClick = (item: MenuItemViewModel) => {
        onClose()
        item.onClick()
    }

    const handleCloseClick = () => {
        onClose()
    }

    const isLastGroup = (groupIndex: number): boolean =>
        groupedItems.length - 1 === groupIndex

    const renderItems = (items: MenuItemViewModel[]): JSX.Element[] =>
        items.map((item, itemIndex) => (
            <ListItem button key={itemIndex} onClick={() => handleClick(item)}>
                <ListItemIcon>
                    <img className='drawer__navigation__drawer__visible__item_image' src={item.image} alt={item.name} />
                </ListItemIcon>
                <ListItemText primary={item.name} />
            </ListItem>
        ))
        
    const renderGroupItems = (): JSX.Element[] =>
        groupedItems.map((items, groupIndex) => (
            <div key={groupIndex}>
                <List>{renderItems(items)}</List>
                {!isLastGroup(groupIndex) && <Divider />}
            </div>
        ))

    return (
        <div className={'drawer__navigation__drawer ' + (open ? 'drawer__navigation__drawer__open' : 'drawer__navigation__drawer__close')}>
            <div className='drawer__navigation__drawer__visible'>
                <div className='drawer__navigation__drawer__header'>
                    <IconButton onClick={handleCloseClick}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                {renderGroupItems()}
            </div>
            {!open && <button className='drawer__navigation__drawer__invisible' onClick={handleCloseClick} />}
        </div>
    )
}

export default Drawer