import React, { useState } from 'react'
import IconButton from '../../../../../components/button/icon_button'
import { ReactComponent as ChangeColorIconSVG } from '../../../../../assets/icons/color_lens.svg'
import { Avatar, CardHeader, Menu, MenuItem } from '@material-ui/core'
import ContactFormDialogHeaderProps from './props'
import Constants from '../../../../../constants/contact/ContactsConstants'
import { useLanguage } from '../../../../../context/language'
import '../../styles.css'
import './styles.css'
import OptionsIconButton from '../../../../../components/button/icon_button/options_icon_button'

const AddContactDialogHeader = (
  props: ContactFormDialogHeaderProps
): JSX.Element => {
  const language = useLanguage()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  const handleNewEssentialContact = () => {
    handleClose()
  }

  return (
    <>
    <CardHeader
      avatar={
        <Avatar
          aria-label={language.data.AVATAR_ALT}
          className={`avatar__color-${props.color}`}
        >
          {props.name ? props.name[0].toUpperCase() : '?'}
        </Avatar>
      }
      action={
        <>
          <IconButton
            ariaLabel={language.data.COLOR_THEME_SELECTION_ARIA_LABEL}
            icon={ChangeColorIconSVG}
            dark
            onClick={props.handleChangeColor}
          />
          <OptionsIconButton dark onClick={handleClick} />
        </>
      }
      title={
        props.action === Constants.ACTION_ADD
          ? props.name || language.data.CONTACTS_ADD_CONTACT
          : props.name
      }
      subheader={language.data.CONTACT_DIALOG_FORM_SUBTITLE}
      className="contact_dialog_form_header"
    />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleNewEssentialContact}>Definir Como Essencial</MenuItem>
      </Menu>
    </>
  )
}

export default AddContactDialogHeader
