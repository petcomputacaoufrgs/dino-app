import React, { useState, useRef } from 'react'
import DrawerNavigationProps from './props'
import './styles.css'
import AppBar from './app_bar'
import Drawer from './drawer'
import Content from './content'

const DrawerNavigation: React.FC<DrawerNavigationProps> = ({
  groupedItems,
  component,
}): JSX.Element => {
  const drawerNavigationEl = useRef<HTMLDivElement|null>(null);

  const [open, setOpen] = useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <div className='drawer_navigation' ref={drawerNavigationEl}>
      <AppBar
        onDrawerOpen={handleDrawerOpen}
        open={open}
      />
      <Content
        component={component}
      />
      <Drawer
        groupedItems={groupedItems}
        onClose={handleDrawerClose}
        onOpen={handleDrawerOpen}
        open={open}
        swipeZoneEl={drawerNavigationEl}
      />
    </div>
  )
}
export default DrawerNavigation
