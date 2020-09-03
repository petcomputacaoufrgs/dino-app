import React, { useState } from 'react'
import useStyles from '../styles'
import { useLanguage } from '../../../../context_provider/app_settings'
import ContactItemListProps from './props'
import { Avatar, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, Menu, MenuItem,} from '@material-ui/core'
import ContactsService from '../../../../services/contact/ContactService'
import OptionsComponent from '../../../../components/options_component'

const ContactItemList = (props: ContactItemListProps): JSX.Element => {
  const classes = useStyles(props)
  const language = useLanguage().current

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget)

  const handleOpen = () => props.onClick(props.item.frontId)

  const handleClose = () => setAnchorEl(null)

  const handleEdit = () => {
    props.setEdit(props.item.frontId)
    handleClose()
  }
  const handleDelete = () => {
    props.setDelete(props.item.frontId)
    handleClose()
  }

  return (
    <>
      <ListItem button onClick={handleOpen}>
        <ListItemAvatar>
          <Avatar aria-label={language.AVATAR_ALT} className={classes[props.item.color]}>
            {props.item.name[0].toUpperCase()}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={props.item.name}
          secondary={ContactsService.getPhoneTypes(props.item.phones)}
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
      {props.children}
    </>
  )
}

export default ContactItemList
