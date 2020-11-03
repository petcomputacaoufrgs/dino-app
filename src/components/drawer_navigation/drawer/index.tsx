import React from 'react'
import DrawerProps from './props'
import './styles.css'
import { Divider, IconButton } from '@material-ui/core'
import { ChevronLeft as ChevronLeftIcon } from '@material-ui/icons'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import MenuItemViewModel from '../../../types/menu/MenuItemViewModel'
import { useCurrentLanguage } from '../../../context_provider/app_settings'
import { Avatar } from '@material-ui/core'
import { useUser } from '../../../context_provider/user'

const Drawer: React.FC<DrawerProps> = ({ open, groupedItems, onClose }) => {
  const language = useCurrentLanguage()

  const user = useUser()

  const handleClick = (item: MenuItemViewModel) => {
    onClose()
    item.onClick()
  }

  const handleCloseClick = () => {
    onClose()
  }

  const isLastGroup = (groupIndex: number): boolean =>
    groupedItems.length - 1 === groupIndex

  const renderItems = (items: MenuItemViewModel[]): JSX.Element[] => {
    return items.map((item, itemIndex) => (
      <ListItem
        button
        aria-label={language.CLICK_TO_OPEN_MENU_ITEM + item.name}
        key={itemIndex}
        onClick={() => handleClick(item)}
      >
        <ListItemIcon>{renderItemImage(item.image)}</ListItemIcon>
        <ListItemText primary={item.name} />
      </ListItem>
    ))
  }

  const renderItemImage = (
    image: React.FunctionComponent<
      React.SVGProps<SVGSVGElement> & {
        title?: string | undefined
      }
    >
  ) => {
    const Image = image

    return <Image className="drawer_navigation__drawer__visible__menu__icon" />
  }

  const renderUser = (): JSX.Element => (
    <div className="user">
      <Avatar src={user.picture} alt={language.AVATAR_ALT} className="avatar" />
      <p className="username">{user.name}</p>
    </div>
  )

  const renderGroupItems = (): JSX.Element[] =>
    groupedItems.map((items, groupIndex) => (
      <div key={groupIndex}>
        <List>{renderItems(items)}</List>
        {!isLastGroup(groupIndex) && <Divider />}
      </div>
    ))

  return (
    <>
      <div className={'drawer_navigation__drawer'}>
        <div className="drawer_navigation__drawer__visible">
          <div className="drawer_navigation__drawer__header">
            <IconButton
              onClick={handleCloseClick}
              aria-label={language.CLOSE_MENU_ARIA_LABEL}
            >
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          {renderUser()}
          {renderGroupItems()}
        </div>
      </div>
      {open && (
        <button
          className="drawer_navigation__drawer__invisible"
          onClick={handleCloseClick}
          aria-label={language.CLOSE_MENU_ARIA_LABEL}
        />
      )}
    </>
  )
}

export default Drawer
