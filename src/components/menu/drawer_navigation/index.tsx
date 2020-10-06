import React, { useState } from 'react'
import DrawerNavigationProps from './props'
import './styles.css'
import AppBar from './app_bar'
import Drawer from './drawer'
import Content from './content'

const DrawerNavigation: React.FC<DrawerNavigationProps> = ({
  groupedItems,
  component,
  translateMenuX,
}): JSX.Element => {

  const [open, setOpen] = useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <div className='drawer__navigation'>
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
        open={open}
        translateX={translateMenuX}
      />
      <div>
        <div
          style={
            {
              width: '10px',
              height: '10px',
              backgroundColor: 'black',
              transform: translateMenuX !== undefined ? `translateX(${translateMenuX}px)` : ''
            }
          }>
          {translateMenuX}
        </div>
      </div>
    </div>
  )
}
export default DrawerNavigation
