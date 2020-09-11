import React from 'react'
import { useLanguage } from '../../../../../context_provider/app_settings'
import {
  Avatar,
  IconButton,
  CardHeader,
  Menu,
  MenuItem,
} from '@material-ui/core'
import useStyles from '../../styles'
import { MoreVert } from '@material-ui/icons'
import ContactCardHeaderProps from './props'
import ContactsService from '../../../../../services/contact/ContactService'

const ContactCardHeader = (props: ContactCardHeaderProps) => {
  const classes = useStyles()
  const language = useLanguage().current

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    handleClose()
    props.onClose()
    setTimeout(() => {
      props.setEdit(props.item.frontId)
    }, 300)
  }

  const handleDelete = () => {
    handleClose()
    props.onClose()
    setTimeout(() => {
      props.setDelete(props.item.frontId)
    }, 300)
  }

  return (
    <>
      <CardHeader
        avatar={
          <Avatar
            aria-label={language.AVATAR_ALT}
            className={classes[props.item.color]}
          >
            {props.item.name[0].toUpperCase()}
          </Avatar>
        }
        action={
          <>
            <IconButton
              edge="end"
              aria-label={language.OPTIONS_ARIA_LABEL}
              onClick={handleClick}
            >
              <MoreVert />
            </IconButton>
          </>
        }
        title={props.item.name}
        subheader={ContactsService.getPhoneTypes(props.item.phones)}
      />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>{language.EDIT_OPTION_TEXT}</MenuItem>
        <MenuItem onClick={handleDelete}>
          {language.DELETE_OPTION_TEXT}
        </MenuItem>
      </Menu>
    </>
  )
}

export default ContactCardHeader
