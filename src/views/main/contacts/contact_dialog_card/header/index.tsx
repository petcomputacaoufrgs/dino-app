import React from 'react'
import { Avatar, CardHeader, Menu, MenuItem } from '@material-ui/core'
import { useCurrentLanguage } from '../../../../../context_provider/app_settings'
import useStyles from '../../styles'
import ContactCardHeaderProps from './props'
import ContactsService from '../../../../../services/contact/ContactService'
import CloseComponent from '../../../../../components/icon_buttons/close_component'
import OptionsComponent from '../../../../../components/icon_buttons/options_component'

const ContactCardHeader = ({
  item,
  setEdit,
  setDelete,
  onClose: handleCloseDialog,
}: ContactCardHeaderProps) => {
  const classes = useStyles()

  const language = useCurrentLanguage()

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
      setEdit(item.frontId)
    }, 300)
  }

  const handleDelete = () => {
    handleCloseMenu()
    handleCloseDialog()
    setTimeout(() => {
      setDelete(item.frontId)
    }, 300)
  }

  return (
    <>
      <CardHeader
        avatar={
          <Avatar
            aria-label={language.AVATAR_ALT}
            className={classes[item.color]}
          >
            {item.name[0].toUpperCase()}
          </Avatar>
        }
        action={
          <>
            <OptionsComponent onClick={handleClick} />
            <CloseComponent onClose={handleCloseDialog} />
          </>
        }
        title={item.name}
        subheader={ContactsService.getPhoneTypes(item.phones, language)}
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
