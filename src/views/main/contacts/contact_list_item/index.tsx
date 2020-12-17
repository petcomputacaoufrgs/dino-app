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
import OptionsIconButton from '../../../../components/button/icon_button/options_icon_button'
import './styles.css'

const ContactItemList: React.FC<ContactItemListProps> = ({
  item,
  phoneService,
  onEdit,
  onDelete,
  onClick,
  children,
}) => {
  const language = useCurrentLanguage()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget)

  const handleOpen = () => onClick(item.contact.localId!)

  const handleClose = () => setAnchorEl(null)

  const handleEdit = () => {
    onEdit(item)
    handleClose()
  }
  const handleDelete = () => {
    onDelete(item)
    handleClose()
  }

  return (
    <div className="contacts__list__item">
      <ListItem button divider onClick={handleOpen}>
        <ListItemAvatar>
          <Avatar
            aria-label={language.AVATAR_ALT}
            className={`avatar__color-${item.contact.color}`}
          >
            {item.contact.name[0].toUpperCase()}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={item.contact.name}
          secondary={phoneService.getPhoneTypes(item.phones, language)}
        />
        <ListItemSecondaryAction>
          <OptionsIconButton dark onClick={handleClick} />
        </ListItemSecondaryAction>
      </ListItem>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>{language.EDIT_OPTION_TEXT}</MenuItem>
        <MenuItem onClick={handleDelete}>
          {language.DELETE_OPTION_TEXT}
        </MenuItem>
      </Menu>
    </div>
  )
}

export default ContactItemList
