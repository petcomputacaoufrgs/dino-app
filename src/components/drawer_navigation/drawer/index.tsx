import React from 'react'
import DrawerProps from './props'
import './styles.css'
import { Divider } from '@material-ui/core'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import MenuItemViewModel from '../../../types/menu/MenuItemViewModel'
import { useCurrentLanguage } from '../../../context/provider/app_settings'
import { Avatar } from '@material-ui/core'
import { useUser } from '../../../context/provider/user'
import IconButton from '../../button/icon_button'
import {ReactComponent as ChevronLeftIconSVG} from '../../../assets/icons/chevron_left.svg'

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
      <div className="user__avatar">
        <Avatar
          src={user.picture}
          alt={language.AVATAR_ALT}
          className="avatar"
        />
      </div>
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
              ariaLabel={language.CLOSE_MENU_BUTTON_ARIA_LABEL}
              icon={ChevronLeftIconSVG}
              onClick={handleCloseClick}
            />
          </div>
          <Divider />
          <div className="drawer_navigation__drawer__content">
            {renderUser()}
            {renderGroupItems()}
          </div>
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
