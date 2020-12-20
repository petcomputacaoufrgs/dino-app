import React from 'react'
import { Avatar, CardHeader, Menu, MenuItem } from '@material-ui/core'
import ContactCardHeaderProps from './props'
import CloseIconButton from '../../../../../components/button/icon_button/close_icon_button'
import OptionsIconButton from '../../../../../components/button/icon_button/options_icon_button'
import { useUserSettings } from '../../../../../context/provider/user_settings'
import '../../styles.css'
import './styles.css'

const ContactCardHeader = ({
  item,
  phoneService,
  onEdit,
  onDelete,
  onClose: handleCloseDialog,
}: ContactCardHeaderProps) => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    handleCloseMenu()
    handleCloseDialog()
    setTimeout(() => {
      onEdit(item)
    }, 300)
  }

  const handleDelete = () => {
    handleCloseMenu()
    handleCloseDialog()
    setTimeout(() => {
      onDelete(item)
    }, 300)
  }

  return (
    <>
      <CardHeader
        avatar={
          <Avatar
            aria-label={language.AVATAR_ALT}
            className={`avatar__color-${item.contact.color}`}
          >
            {item.contact.name[0].toUpperCase()}
          </Avatar>
        }
        action={
          <>
            <OptionsIconButton dark onClick={handleClick} />
            <CloseIconButton dark onClose={handleCloseDialog} />
          </>
        }
        title={item.contact.name}
        subheader={phoneService.getPhoneTypes(item.phones, language)}
        className="contact_dialog_content_header"
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleEdit}>{language.EDIT_OPTION_TEXT}</MenuItem>
        <MenuItem onClick={handleDelete}>
          {language.DELETE_OPTION_TEXT}
        </MenuItem>
      </Menu>
    </>
  )
}

export default ContactCardHeader
