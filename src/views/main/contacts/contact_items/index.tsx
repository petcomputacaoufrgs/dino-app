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

  const [open, setOpen] = useState(0)
  const [edit, setEdit] = useState(0)
  const [_delete, setDelete] = useState(0)

  const handleDelete = () => {
    if (_delete) {
      console.log(_delete)
      ContactsService.deleteContact(_delete)
    }
  }

  useEffect(() => {
    handleDelete()
  }, [_delete])


  return (
    <List className={classes.list}>
      {props.items.map((contact) => (
        <div key={contact.id}>
          <ContactItemList
            item={contact}
            setEdit={setEdit}
            setDelete={setDelete}
            onClick={() => setOpen(contact.id)}
          >
            <ContactCard
              item={contact}
              onClose={() => setOpen(0)}
              setEdit={setEdit}
              setDelete={setDelete}
              dialogOpen={open === contact.id}
              setDialogOpen={setOpen}
            />
            <ContactFormDialog
              item={contact}
              dialogOpen={edit === contact.id}
              setDialogOpen={setEdit}
              action="edit"
            />
          </ContactItemList>
          <Divider />
        </div>
      ))}
    </List>
  )
}

export default ContactItems
