import React, { useState } from 'react'
import ContactItemsProps from './props'
import ContactCard from '../contact_dialog_card'
import ContactItemList from '../contact_list_item'
import { List } from '@material-ui/core'
import ContactFormDialog from '../contact_dialog_form'
import Constants from '../../../../constants/contact/ContactsConstants'
import AgreementDialog from '../../../../components/agreement_dialog'
import ContactView from '../../../../types/contact/view/ContactView'
import { useUserSettings } from '../../../../context/provider/user_settings'

const ContactItems: React.FC<ContactItemsProps> = ({
  items,
  contactService,
  googleContactService,
  phoneService
}) => {
  const [contactToEdit, setContactToEdit] = useState<ContactView | undefined>(undefined)
  const [contactToView, setContactToView] = useState<ContactView | undefined>(undefined)
  const [contactToDelete, setContactToDelete] = useState<ContactView | undefined>(undefined)

  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)

    const handleOpenCard = (index: number) => {
      setContactToView(items[index])
    }

    const handleAcceptDeleteDialog = async () => {
      setContactToDelete(undefined)
      if (contactToDelete) {
        await phoneService.deleteAll(contactToDelete.phones)
        contactService.delete(contactToDelete.contact)
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
            phoneService={phoneService}
            onEdit={setContactToEdit}
            onDelete={setContactToDelete}
            onClick={() => handleOpenCard(index)}
          />
      ))}
      </List>
      {contactToView && 
        <ContactCard
          dialogOpen={contactToView !== undefined}
          onClose={() => setContactToView(undefined)}
          item={contactToView}
          phoneService={phoneService}
          onEdit={setContactToEdit}
          onDelete={setContactToDelete}
        />
      }
      {contactToEdit && 
        <ContactFormDialog
          dialogOpen={contactToEdit !== undefined}
          onClose={() => setContactToEdit(undefined)}
          item={contactToEdit}
          contactService={contactService}
          phoneService={phoneService}
          items={items}
          action={Constants.ACTION_EDIT}
        />
      }
      {contactToDelete && 
        <AgreementDialog 
          open={contactToDelete !== undefined}
          agreeOptionText={language.AGREEMENT_OPTION_TEXT}
          disagreeOptionText={language.DISAGREEMENT_OPTION_TEXT}
          description={language.DELETE_CONTACT_OPTION_TEXT}
          question={language.DELETE_CONTACT_QUESTION}
          onAgree={handleAcceptDeleteDialog}
          onDisagree={handleCloseDeleteDialog}
        />
      }
    </>
  )
}

export default ContactItems
