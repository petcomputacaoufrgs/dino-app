import React from 'react'
import { useLanguage } from '../../../../../context_provider/app_settings'
import { Avatar, CardHeader, IconButton } from '@material-ui/core'
import { ColorLens as ColorLensIcon, Add as AddIcon } from '@material-ui/icons'
import useStyles from '../../styles'
import ContactFormDialogHeaderProps from './props'
import Constants from '../../../../../constants/ContactsConstants'

const AddContactDialogHeader = (
  props: ContactFormDialogHeaderProps
): JSX.Element => {
  const classes = useStyles(props)

  const language = useLanguage().current

  const handleChangeColor = () => {
    const colors = Object.values(Constants.COLORS)
    colors.forEach((color, i) => {
      if (props.color === color) props.setColor(colors[(i + 1) % colors.length])
    })
  }

  return (
    <CardHeader
      avatar={
        <Avatar aria-label="avatar" className={classes[props.color]}>
          {props.name ? props.name[0].toUpperCase() : '?'}
        </Avatar>
      }
      action={
        <>
          <IconButton
            aria-label="color"
            size="small"
            className={classes.iconButton}
            onClick={handleChangeColor}
          >
            <ColorLensIcon />
          </IconButton>
          <IconButton
            aria-label="add_phone"
            size="small"
            className={classes.iconButton}
            onClick={() => props.setAddPhoneAction(true)}
          >
            <AddIcon />
          </IconButton>
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
