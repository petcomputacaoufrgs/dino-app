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
import OptionsIconButton from '../../../../components/button/icon_button/options_icon_button'
import './styles.css'

const ContactItemList = ({
  item,
  onEdit,
  onDelete,
  onClick,
}: ContactItemListProps): JSX.Element => {
  const language = useCurrentLanguage()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget)

  const handleOpen = () => onClick(item.frontId)

  const handleClose = () => setAnchorEl(null)

  const handleEdit = () => {
    onEdit()
    handleClose()
  }
  const handleDelete = () => {
    onDelete()
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
