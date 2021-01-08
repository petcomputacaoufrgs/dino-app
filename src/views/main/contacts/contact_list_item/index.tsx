import React, { useState } from 'react'
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
import { useLanguage } from '../../../../context/language'
import PhoneService from '../../../../services/contact/PhoneService'
import './styles.css'

const ContactItemList: React.FC<ContactItemListProps> = ({
  item,
  onEdit,
  onDelete,
  onClick,
}) => {
  const language = useLanguage()
  const handleOpen = () => onClick(item.contact.localId!)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget)

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
            aria-label={language.data.AVATAR_ALT}
            className={`avatar__color-${item.contact.color}`}
          >
            {item.contact.name[0].toUpperCase()}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={item.contact.name}
          secondary={PhoneService.getPhoneTypes(item.phones, language.data)}
        />
        <ListItemSecondaryAction>
          <OptionsIconButton dark onClick={handleClick} />
        </ListItemSecondaryAction>
      </ListItem>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>{language.data.EDIT_OPTION_TEXT}</MenuItem>
        <MenuItem onClick={handleDelete}>
          {language.data.DELETE_OPTION_TEXT}
        </MenuItem>
      </Menu>
    </div>
  )
}

export default ContactItemList
