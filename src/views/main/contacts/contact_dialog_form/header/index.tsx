import React from 'react'
import { useLanguage } from '../../../../../context_provider/app_settings'
import { Avatar, CardHeader, IconButton } from '@material-ui/core'
import { ColorLens as ColorLensIcon } from '@material-ui/icons'
import useStyles from '../../styles'
import ContactFormDialogHeaderProps from './props'
import Constants from '../../../../../constants/contact/ContactsConstants'
import CloseComponent from '../../../../../components/close_component'

const AddContactDialogHeader = (
  props: ContactFormDialogHeaderProps
): JSX.Element => {
  const classes = useStyles(props)

  const language = useLanguage().current

  return (
    <CardHeader
      avatar={
        <Avatar
          aria-label={language.AVATAR_ALT}
          className={classes[props.color]}
        >
          {props.name ? props.name[0].toUpperCase() : '?'}
        </Avatar>
      }
      action={
        <>
          <IconButton
            aria-label={language.CHANGE_COLOR_ARIA_LABEL}
            size="small"
            className={classes.iconButton}
            onClick={props.handleChangeColor}
          >
            <ColorLensIcon />
          </IconButton>
          <CloseComponent onClose={props.handleCloseDialog} />
        </>
      }
      title={
        props.action === Constants.ACTION_ADD
          ? props.name || language.CONTACTS_ADD_CONTACT
          : props.name
      }
      subheader="Contato"
    />
  )
}

export default AddContactDialogHeader
