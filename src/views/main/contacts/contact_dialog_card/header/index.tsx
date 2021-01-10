import React from 'react'
import { Avatar, CardHeader, Menu, MenuItem } from '@material-ui/core'
import ContactCardHeaderProps from './props'
import { Star } from '@material-ui/icons'
import OptionsIconButton from '../../../../../components/button/icon_button/options_icon_button'
import { useLanguage } from '../../../../../context/language'
import PhoneService from '../../../../../services/contact/PhoneService'
import '../../styles.css'
import './styles.css'

const ContactCardHeader = ({
  item,
  onEdit,
  onDelete,
  onClose: handleCloseDialog,
}: ContactCardHeaderProps) => {
  const language = useLanguage()

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

  const isEssential = () => item.contact.isEssential === 1

  const renderEditMenuItem = () => {
    return isEssential() ? <></> : 
    <MenuItem onClick={handleEdit}>
      {language.data.EDIT_OPTION_TEXT}
    </MenuItem> 
  }

  return (
    <>
      <CardHeader
        avatar={
          <Avatar
            aria-label={language.data.AVATAR_ALT}
            className={`avatar__color-${item.contact.color}`}
          >
            {item.contact.name[0].toUpperCase()}
          </Avatar>
        }
        action={
          <>
            {isEssential() ? <Star /> : <></>}
            <OptionsIconButton dark onClick={handleClick} />
          </>
        }
        title={item.contact.name}
        subheader={PhoneService.getPhoneTypes(item.phones, language.data)}
        className="contact_dialog_content_header"
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {renderEditMenuItem()}
        <MenuItem onClick={handleDelete}>
          {language.data.DELETE_OPTION_TEXT}
        </MenuItem>
      </Menu>
    </>
  )
}

export default ContactCardHeader
