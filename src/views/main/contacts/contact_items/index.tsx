import React, { useState, useEffect } from 'react'
import ContactItemsProps from './props'
import ContactCard from '../contact_item/contact_card_dialog'
import ContactItemList from '../contact_item/contact_list_item'
import { List, Divider } from '@material-ui/core'
import useStyles from '../styles'
import ContactFormDialog from '../contact_form_dialog'
import ContactsService from '../../../../services/contact/ContactsService'

const ContactItems = (props: ContactItemsProps): JSX.Element => {

  const classes = useStyles()

  const [selectedItem, setSelectedItem] = useState(0)
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)
  const [_delete, setDelete] = useState(false)

  const handleOpen = (id: number) => {
    setOpen(true)
    setSelectedItem(id)
  }

  useEffect(() => {
    if (_delete) {
      console.log(_delete, selectedItem)
      ContactsService.deleteContact(selectedItem)
    }
  }, [_delete, selectedItem])

  const handleClose = () => setOpen(false)

  const isContactCardOpen = (id: number): boolean => open && selectedItem === id
  const isContactEditOpen = (id: number): boolean => edit && selectedItem === id

  return (
    <List className={classes.list}>
      {props.items.map((contact) => (
        <div key={contact.id}>
          <ContactItemList
            item={contact}
            setEdit={setEdit}
            setDelete={setDelete}
            setSelected={setSelectedItem}
            onClick={() => handleOpen(contact.id)}
          >
            <ContactCard
              item={contact}
              onClose={handleClose}
              setEdit={setEdit}
              dialogOpen={isContactCardOpen(contact.id)}
              setDialogOpen={setOpen}
            />
            <ContactFormDialog
              action="edit"
              dialogOpen={isContactEditOpen(contact.id)}
              setDialogOpen={setEdit}
              id={selectedItem}
              name={contact.name}
              description={contact.description}
              phones={contact.phones}
              color={contact.color}
            />
          </ContactItemList>
          <Divider />
        </div>
      ))}
    </List>
  )
}

export default ContactItems
