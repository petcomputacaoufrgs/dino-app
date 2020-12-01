import React, { useState } from 'react'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'
import ContactItemListProps from './props'
import {
  Avatar,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Menu,
  MenuItem,
} from '@material-ui/core'
import ContactService from '../../../../services/contact/ContactService'
import OptionsComponent from '../../../../components/button/icon_button/options_component'
import './styles.css'

const ContactItemList = ({
  item,
  setEdit,
  setDelete,
  onClick,
  children,
}: ContactItemListProps): JSX.Element => {

  const language = useCurrentLanguage()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget)

  const handleOpen = () => onClick(item.frontId)

  const handleClose = () => setAnchorEl(null)

  const handleEdit = () => {
    setEdit(item.frontId)
    handleClose()
  }
  const handleDelete = () => {
    setDelete(item.frontId)
    handleClose()
  }

  return (
    <div className="contacts__list__item">
      <ListItem button divider onClick={handleOpen}>
        <ListItemAvatar>
          <Avatar
            aria-label={language.AVATAR_ALT}
            className={`avatar__color-${item.color}`}
            >
            {item.name[0].toUpperCase()}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={item.name}
          secondary={ContactService.getPhoneTypes(item.phones, language)}
        />
        <ListItemSecondaryAction>
          <OptionsComponent onClick={handleClick} />
        </ListItemSecondaryAction>
      </ListItem>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>{language.EDIT_OPTION_TEXT}</MenuItem>
        <MenuItem onClick={handleDelete}>
          {language.DELETE_OPTION_TEXT}
        </MenuItem>
      </Menu>
      {children}
    </div>
  )
}

export default ContactItemList
