import React from 'react'
import { Menu, MenuItem } from '@material-ui/core'
import ContactMenuItemsProps from './props'
import { useLanguage } from '../../../../context/language'

const ContactMenuItems = ({ anchor, setAnchor, item, onEdit, onDelete, onCloseDialog}: ContactMenuItemsProps) => {

  const language = useLanguage()

  const handleClose = () => {
    setAnchor(null)
  }

  const renderEditMenuItem = () => {
    const isNotEssential = item.contact.localEssentialContactId === undefined

    if(isNotEssential) {
      return (
        <MenuItem onClick={handleEdit}>
          {language.data.EDIT_OPTION_TEXT}
        </MenuItem> 
      )
    } 
  }

  const handleEdit = () => {
    onEdit(item)
    handleClose()
    onCloseDialog()
  }

  const handleDelete = () => {
    onDelete(item)
    handleClose()
    onCloseDialog()
  }

  return (
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={handleClose}
      >
        {renderEditMenuItem()}
        <MenuItem onClick={handleDelete}>
          {language.data.DELETE_OPTION_TEXT}
        </MenuItem>
      </Menu>
  ) 
}

export default ContactMenuItems
