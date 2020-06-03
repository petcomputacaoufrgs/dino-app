import React, { useState } from 'react'
import ContactItemsProps from './props'
import ContactCard from '../contact_item/contact_card_dialog'
import ContactItemList from '../contact_item/contact_list_item'
import { List, Divider } from '@material-ui/core'
import useStyles from '../styles'
import AddContactButton from '../add_contact_button'
import ContactFormDialog from '../contact_form_dialog'
import ContactsConstants from '../../../../constants/ContactsConstants'


const ContactItems = (props: ContactItemsProps): JSX.Element => {

  const classes = useStyles()

  const [name, setName] = useState('Nome do carinha')
  const [number, setNumber] = useState('')
  const [type, setType] = useState(ContactsConstants.MOBILE)
  const [color, setColor] = useState('')

  const [selectedItem, setSelectedItem] = useState(0)
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)

  const handleOpen = (id: number) => {
    setOpen(true)
    setSelectedItem(id)
  }

  const handleClose = () => setOpen(false)

  const isContactCardOpen = (id: number): boolean => open && selectedItem === id
  const isContactEditOpen = (id: number): boolean => edit && selectedItem === id

  return (
    <div>
      <List className={classes.list}>
        {props.items.map((contact) => (
          <div key={contact.id}>
            <ContactItemList
              item={contact}
              onClick={() => handleOpen(contact.id)}
            />
            <ContactCard
              item={contact}
              onClose={handleClose}
              setEdit={setEdit}
              dialogOpen={isContactCardOpen(contact.id)}
              setDialogOpen={setOpen}
            />
            <ContactFormDialog
              itemId={selectedItem}
              action="edit"
              dialogOpen={isContactEditOpen(contact.id)}
              setDialogOpen={setEdit}
              name={contact.name}
              number={contact.phone}
              type={contact.type}
              color={contact.color}
            />
            <Divider />
          </div>
        ))}
      </List>
      <AddContactButton />

    </div>
  )
}

export default ContactItems
