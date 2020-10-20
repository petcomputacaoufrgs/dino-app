import React, { useState, useEffect, useRef } from 'react'
import DrawerProps from './props'
import './styles.css'
import { Divider, IconButton } from '@material-ui/core'
import { ChevronLeft as ChevronLeftIcon } from '@material-ui/icons'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import MenuItemViewModel from '../../../types/menu/MenuItemViewModel'
import { useCurrentLanguage } from '../../../context_provider/app_settings'

const DRAWER_WIDTH = 240

const Drawer: React.FC<DrawerProps> = ({
    open,
    groupedItems,
    swipeZoneEl,
    onClose,
    onOpen
}) => {
    const language = useCurrentLanguage()

    const drawerEl = useRef<HTMLDivElement | null>(null) 

    const [startTouch, setStartTouch] = useState<HorizontalTouch | undefined>(undefined)
    
    useEffect(() => {
        function handleTouchStart(this: GlobalEventHandlers, event: TouchEvent) {
            const touch = getTouch(event)
            setStartTouch(touch)
            disableDivTransition(drawerEl)
        }

        function handleTouchEnd(this: GlobalEventHandlers, event: TouchEvent) {
            enableDivTransition(drawerEl)

            const currentTouch = getTouch(event)

            if (currentTouch && startTouch) {
                const diff = calcSwipeDiff(currentTouch)

                if (diff > DRAWER_WIDTH / 2) {
                    openDrawer(drawerEl)
                    if (!open) {
                        onOpen()
                    }
                } else {
                    closeDrawer(drawerEl)
                    if (open) {
                        onClose()
                    }
                }
            }

            setStartTouch(undefined)
        }

        function handleTouchMove(this: GlobalEventHandlers, event: TouchEvent) {
            const currentTouch = getTouch(event)
            if (startTouch && currentTouch) {
                const diff = calcSwipeDiff(currentTouch)
                if (diff > 0) {
                    const translateX = diff - DRAWER_WIDTH
                    if (translateX > 0) {
                        openDrawer(drawerEl)
                        disableDivTransition(drawerEl)
                    } else {
                        changeDivTransform(drawerEl, `translate3d(${translateX}px, 0, 0)`)
                        disableDivTransition(drawerEl)
                    }
                }
            }
        }

        if (swipeZoneEl && swipeZoneEl.current) {
            swipeZoneEl.current.addEventListener('touchstart', handleTouchStart, {passive: true})
            swipeZoneEl.current.addEventListener('touchend', handleTouchEnd, { passive: true })
            swipeZoneEl.current.addEventListener('touchmove', handleTouchMove, { passive: true })
        }

        const cleanBeforeUpdate = () => {
            if (swipeZoneEl && swipeZoneEl.current) {
                swipeZoneEl.current.removeEventListener('touchstart', handleTouchStart, false)
                swipeZoneEl.current.removeEventListener('touchend', handleTouchEnd, false)
                swipeZoneEl.current.removeEventListener('touchmove', handleTouchMove, false)
            }
        }

        return cleanBeforeUpdate
    })

    useEffect(() => {
        enableDivTransition(drawerEl)
        
        if (open) {
            openDrawer(drawerEl)
        } else {
            closeDrawer(drawerEl)
        }
    }, [open])

    const calcSwipeDiff = (currentTouch: HorizontalTouch): number => {
        const touchDiff = currentTouch.x - startTouch!.x 

        if (open) {
            return touchDiff + DRAWER_WIDTH
        }
        return touchDiff
    }

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
            <ListItem button aria-label={language.CLICK_TO_OPEN_MENU_ITEM + item.name} key={itemIndex} onClick={() => handleClick(item)}>
                <ListItemIcon>
                    <img className='drawer_navigation__drawer__visible__item_image' src={item.image} alt={item.name} />
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
        <>
            <div 
                className={'drawer_navigation__drawer'}
                ref={drawerEl}
            >
                <div
                    className='drawer_navigation__drawer__visible' 
                >
                    <div className='drawer_navigation__drawer__header'>
                        <IconButton 
                            onClick={handleCloseClick}
                            aria-label={language.CLOSE_MENU_ARIA_LABEL}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    {renderGroupItems()}
                </div>
            </div>
            {open && <button className='drawer_navigation__drawer__invisible' onClick={handleCloseClick} aria-label={language.CLOSE_MENU_ARIA_LABEL} />}
        </>
    )
}
                
interface HorizontalTouch {
    x: number
}

const getTouch = (event: TouchEvent): HorizontalTouch | undefined => {
    const touches = event.touches
    if (touches.length > 0) {
        return {
            x: touches[0].clientX,
        }
    } else {
        const changedTouches = event.changedTouches
        if (changedTouches.length > 0) {
            return {
                x: changedTouches[0].clientX,
            }
        } 
    }

    return undefined
}

const openDrawer = (divEl: React.MutableRefObject<HTMLDivElement | null>) => {
    changeDivTransform(divEl, 'translate3d(0px, 0, 0)')
}

const closeDrawer = (divEl: React.MutableRefObject<HTMLDivElement | null>) => {
    changeDivTransform(divEl, 'translate3d(-240px, 0, 0)')
}

const enableDivTransition = (divEl: React.MutableRefObject<HTMLDivElement | null>) => {
    if (divEl && divEl.current) {
        divEl.current.style.transition = 'transform 250ms'
    }
}

const disableDivTransition = (divEl: React.MutableRefObject<HTMLDivElement | null>) => {
    if (divEl && divEl.current) {
        divEl.current.style.transition = 'transform 0ms'
    }
}


const changeDivTransform = (divEl: React.MutableRefObject<HTMLDivElement | null>, value: string) => {
    if (divEl && divEl.current) {
        divEl.current.style.transform = value
    }
}

export default Drawer