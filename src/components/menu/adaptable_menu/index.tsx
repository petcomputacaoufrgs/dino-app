import React, { useState } from 'react'
import AdaptableMenuProps from './props'
import DrawerNavigation from '../drawer_navigation'
import './styles.css'

interface HorizontalTouch {
  x: number
}

const drawerWidth: number = 240

const getTouch = (event: React.TouchEvent<HTMLDivElement>): HorizontalTouch | undefined => {
  const touches = event.touches
  if (touches.length > 0) {
    return {
      x: touches[0].clientX,
    }
  }

  return undefined
}

const AdaptableMenu = (props: AdaptableMenuProps): JSX.Element => {
  const [startTouch, setStartTouch] = useState<HorizontalTouch | undefined>(undefined)
  const [translateXMenu, setTranslateXMenu] = useState<number | undefined>(undefined)

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = getTouch(event)
    setStartTouch(touch)
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    setStartTouch(undefined)
    setTranslateXMenu(undefined)
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (startTouch) {
      const currentTouch = getTouch(event)
      if (currentTouch) {
        const diff = currentTouch.x - startTouch.x
        if (diff > drawerWidth) {
          setTranslateXMenu(drawerWidth)
        } else if (diff < 0) {
          setTranslateXMenu(0)
        } else {
          setTranslateXMenu(diff)
        }
      }
    }
  }

  const renderAdaptableMenu = (): JSX.Element => {
    return (
      <div className="adaptable_menu" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchMove={handleTouchMove}>
        <DrawerNavigation
          component={props.component}
          groupedItems={props.groupedItems}
          translateMenuX={translateXMenu}
        />
      </div>
    )
  }

  return renderAdaptableMenu()
}

export default AdaptableMenu
