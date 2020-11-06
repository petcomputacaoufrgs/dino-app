import React, { useState, useEffect } from 'react'
import ContactItemsProps from './props'
import ContactCard from '../contact_dialog_card'
import ContactItemList from '../contact_list_item'
import { List } from '@material-ui/core'
import ContactFormDialog from '../contact_dialog_form'
import ContactsService from '../../../../services/contact/ContactService'
import Constants from '../../../../constants/contact/ContactsConstants'

const ContactItems = ({ items, setItems }: ContactItemsProps): JSX.Element => {

  const [cardOpen, setCardOpen] = useState(0)
  const [edit, setEdit] = useState(0)
  const [_delete, setDelete] = useState(0)

  useEffect(() => {
    if (_delete) {
      ContactsService.deleteContact(_delete)
      setDelete(0)
    }
  }, [_delete, setItems])

  return (
      <List className="contacts__list">
        {items.map((contact, index) => (
          <div key={index}>
            <ContactItemList
              item={contact}
              setEdit={setEdit}
              setDelete={setDelete}
              onClick={() => setCardOpen(contact.frontId)}
            >
              <ContactCard
                item={contact}
                onClose={() => setCardOpen(0)}
                setEdit={setEdit}
                setDelete={setDelete}
                dialogOpen={cardOpen === contact.frontId}
              />
              <ContactFormDialog
                item={contact}
                dialogOpen={edit === contact.frontId}
                onClose={() => setEdit(0)}
                action={Constants.ACTION_EDIT}
              />
            </ContactItemList>
          </div>
        ))}
      </List>
  )
}

export default ContactItems
