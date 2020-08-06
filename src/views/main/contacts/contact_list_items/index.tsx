import React, { useState, useEffect } from 'react'
import ContactItemsProps from './props'
import ContactCard from '../contact_dialog_card'
import ContactItemList from '../contact_list_item'
import { List } from '@material-ui/core'
import useStyles from '../styles'
import ContactFormDialog from '../contact_dialog_form'
import ContactsService from '../../../../services/contact/ContactService'
import Constants from '../../../../constants/ContactsConstants'

const ContactItems = ({ items, setItems }: ContactItemsProps): JSX.Element => {
  const classes = useStyles()

  const [open, setOpen] = useState(0)
  const [edit, setEdit] = useState(-1)
  const [_delete, setDelete] = useState(0)

  useEffect(() => {
    if (_delete) {
      ContactsService.deleteContact(_delete)
      setItems([...ContactsService.getItems()])
    }
  }, [_delete, setItems])

  useEffect(() => {
    if (!edit) setItems([...ContactsService.getItems()])
  }, [edit, setItems])

  return (
    <List className={classes.list}>
      {items.map((contact) => (
        <div key={contact.frontId}>
          <ContactItemList
            item={contact}
            setEdit={setEdit}
            setDelete={setDelete}
            onClick={() => setOpen(contact.frontId)}
          >
            <ContactCard
              item={contact}
              onClose={() => setOpen(0)}
              setEdit={setEdit}
              setDelete={setDelete}
              dialogOpen={open === contact.frontId}
              setDialogOpen={setOpen}
            />
            <ContactFormDialog
              item={contact}
              dialogOpen={edit === contact.frontId}
              setDialogOpen={setEdit}
              action={Constants.ACTION_EDIT}
            />
          </ContactItemList>
        </div>
      ))}
    </List>
  )
}

export default ContactItems
