import React, { useState } from 'react'
import ContactItemsProps from './props'
import ContactCard from '../contact_dialog_card'
import ContactItemList from '../contact_list_item'
import { List } from '@material-ui/core'
import ContactFormDialog from '../contact_dialog_form'
import Constants from '../../../../constants/contact/ContactsConstants'
import AgreementDialog from '../../../../components/agreement_dialog'
import ContactView from '../../../../types/contact/view/ContactView'
import { useLanguage } from '../../../../context/language'
import PhoneService from '../../../../services/contact/PhoneService'
import ContactService from '../../../../services/contact/ContactService'
import GoogleContactService from '../../../../services/contact/GoogleContactService'

const ContactItems: React.FC<ContactItemsProps> = ({
  items,
}) => {
  const [contactToEdit, setContactToEdit] = useState<ContactView | undefined>(undefined)
  const [contactToView, setContactToView] = useState<ContactView | undefined>(undefined)
  const [contactToDelete, setContactToDelete] = useState<ContactView | undefined>(undefined)

  const language = useLanguage()

  const handleOpenCard = (index: number) => {
    setContactToView(items[index])
  }

  const handleAcceptDeleteDialog = async () => {
    const deleteGoogleContact = async (contactToDelete: ContactView): Promise<void> => {
      if (contactToDelete.googleContact) {
        await GoogleContactService.delete(contactToDelete.googleContact)
      }
    }

    const deletePhones = async (contactToDelete: ContactView): Promise<void> => {
      if (contactToDelete.phones.length > 0) {
        await PhoneService.deleteAll(contactToDelete.phones)
      }
    }

    setContactToDelete(undefined)
    if (contactToDelete) {
      await deleteGoogleContact(contactToDelete)
      await deletePhones(contactToDelete)
      await ContactService.delete(contactToDelete.contact)
    }
  }

  const handleCloseDeleteDialog = () => {
    setContactToDelete(undefined)
  }

  return (
    <>
      <List className="contacts__list">
        {items.map((item, index) => (
          <ContactItemList
            key={index}
            item={item}
            onClick={() => handleOpenCard(index)}
            onEdit={setContactToEdit}
            onDelete={setContactToDelete}
            onCloseDialog={() => setContactToView(undefined)}
          />
        ))}
      </List>
      {contactToView && (
        <ContactCard
          dialogOpen={contactToView !== undefined}
          onClose={() => setContactToView(undefined)}
          item={contactToView}
          onEdit={setContactToEdit}
          onDelete={setContactToDelete}
        />
      )}
      {contactToEdit && (
        <ContactFormDialog
          dialogOpen={contactToEdit !== undefined}
          onClose={() => setContactToEdit(undefined)}
          item={contactToEdit}
          items={items}
          action={Constants.ACTION_EDIT}
        />
      )}
      {contactToDelete && (
        <AgreementDialog
          open={contactToDelete !== undefined}
          agreeOptionText={language.data.AGREEMENT_OPTION_TEXT}
          disagreeOptionText={language.data.DISAGREEMENT_OPTION_TEXT}
          description={language.data.DELETE_CONTACT_OPTION_TEXT}
          question={language.data.DELETE_CONTACT_QUESTION}
          onAgree={handleAcceptDeleteDialog}
          onDisagree={handleCloseDeleteDialog}
        />
      )}
    </>
  )
}

export default ContactItems
