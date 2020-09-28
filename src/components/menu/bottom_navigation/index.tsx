import React from 'react'
import BottomNavigationProps from './props'
import DrawerNavigation from '../drawer_navigation'
import './styles.css'

/**
 * @description Menu de navegação inferior
 * @param props Propriedades utilizadas no menu, incluindo os itens que serão utilizados
 */
const BottomNavigation = (props: BottomNavigationProps) => {

  const renderMenuItems = (): JSX.Element => (
    <DrawerNavigation
      mini={props.showMiniDrawer}
      groupedItems={props.groupedItems}
    />
  )

  const renderContent = (): JSX.Element => {
    return props.component
  }

  return (
    <div className="bottom_navigation">
      {renderMenuItems()}
      <div
        className={
          props.showMiniDrawer
            ? 'bottom_navigation__component_with_mini'
            : 'bottom_navigation__component'
        }
      >
        {renderContent()}
      </div>
    </div>
  )
}

export default BottomNavigation
