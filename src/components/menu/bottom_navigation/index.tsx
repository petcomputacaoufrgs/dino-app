import React, { useState, useEffect } from 'react'
import BottomNavigationProps from './props'
import MenuItemViewModel from '../model/MenuItemViewModel'
import DrawerNavigation from '../drawer_navigation'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { default as MaterialBottomNavigation } from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import './styles.css'
import Typography from '@material-ui/core/Typography'

/**
 * @description Menu de navegação inferior
 * @param props Propriedades utilizadas no menu, incluindo os itens que serão utilizados
 */
const BottomNavigation = (props: BottomNavigationProps) => {
  const classes = useStyles()

  const [selectecItemIndex, setSelectedItemIndex] = useState(props.selectedItem)

  const onChange = (
    event: React.ChangeEvent<{}>,
    indexNewSelectedItem: string,
  ) => {
    const intIndex = Number(indexNewSelectedItem)

    setSelectedItemIndex(intIndex)

    const selectedItem = getFirstMenuItemsGroup()[intIndex]

    selectedItem.onClick()
  }

  useEffect(() => {
    setSelectedItemIndex(props.selectedItem ? props.selectedItem : 0)
  }, [props.selectedItem])

  const getFirstMenuItemsGroup = (): MenuItemViewModel[] => {
    if (props.groupedItems.length !== 0 && !props.hideBottomBar) {
      return props.groupedItems[0]
    }

    return []
  }

  const getSecondaryMenuItemsGroups = (): MenuItemViewModel[][] =>
    props.hideBottomBar ? props.groupedItems : props.groupedItems.slice(1)

  const renderMainItems = (): JSX.Element => (
    <MaterialBottomNavigation value={selectecItemIndex} onChange={onChange}>
      {getFirstMenuItemsGroup().map((item, index) => (
        <BottomNavigationAction
          key={index}
          label={item.name}
          value={index}
          icon={
            <img className={classes.image} src={item.image} alt={item.name} />
          }
        />
      ))}
    </MaterialBottomNavigation>
  )

  const renderSecondaryItems = (): JSX.Element => (
    <DrawerNavigation
      mini={props.showMiniDrawer}
      groupedItems={getSecondaryMenuItemsGroups()}
    />
  )

  const renderContent = (): JSX.Element => {
    return props.component
  }

  return (
    <div className="bottom_navigation">
      {renderSecondaryItems()}
      <div
        className={
          props.hideBottomBar
            ? 'bottom_navigation__component_without_bottom'
            : 'bottom_navigation__component'
        }
      >
        {renderContent()}
      </div>
      {!props.hideBottomBar && renderMainItems()}
    </div>
  )
}

/**
 * @description Estilos do Menu
 * */

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      width: '35px',
    },
  }),
)

export default BottomNavigation
