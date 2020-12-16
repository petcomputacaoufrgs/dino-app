import React, { useState, useEffect } from 'react'
import ContactItemsProps from './props'
import ContactCard from '../contact_dialog_card'
import ContactItemList from '../contact_list_item'
import { List } from '@material-ui/core'
import ContactFormDialog from '../contact_dialog_form'
import Constants from '../../../../constants/contact/ContactsConstants'
import ContactView from '../../../../types/contact/view/ContactView'

const ContactItems: React.FC<ContactItemsProps> = ({
  items,
  contactService,
  googleContactService,
  phoneService
}) => {
  const [cardOpen, setCardOpen] = useState(0)
  const [contactToEdit, setContactToEdit] = useState<ContactView | undefined>(undefined)
  const [contactToDelete, setContactToDelete] = useState<ContactView | undefined>(undefined)

  useEffect(() => {
    let updateState = () => {
      setContactToDelete(undefined)
    }

    const deleteItems = async () => {
      if (contactToDelete) {
        await phoneService.deleteAll(contactToDelete.phones)
        contactService.delete(contactToDelete.contact)
        updateState()
      }
    }
    
    deleteItems()

    const cleanBeforeUpdate = () => {
      updateState = () => {}
    }

    return cleanBeforeUpdate
  }, [contactToDelete, contactService, phoneService])

  return (
    <List className="contacts__list">
      {items.map((item, index) => (
        <div key={index}>
          <ContactItemList
            item={item}
            phoneService={phoneService}
            setEdit={setContactToEdit}
            setDelete={setContactToDelete}
            onClick={() => setCardOpen(item.contact.localId!)}
          >
            <ContactCard
              item={item}
              phoneService={phoneService}
              onClose={() => setCardOpen(0)}
              setEdit={setContactToEdit}
              setDelete={setContactToDelete}
              dialogOpen={cardOpen === item.contact.localId}
            />
          </ContactItemList>
        </div>
      ))}
      <ContactFormDialog
        item={contactToEdit}
        contactService={contactService}
        phoneService={phoneService}
        items={items}
        dialogOpen={contactToEdit !== undefined}
        onClose={() => setContactToEdit(undefined)}
        action={Constants.ACTION_EDIT}
      />
    </List>
  )
}

export default ContactItems
