import React, { useState, useEffect } from 'react'
import ContactItemsProps from './props'
import ContactCard from '../contact_dialog_card'
import ContactItemList from '../contact_list_item'
import { List } from '@material-ui/core'
import ContactFormDialog from '../contact_dialog_form'
import Constants from '../../../../constants/contact/ContactsConstants'
import AgreementDialog from '../../../../components/agreement_dialog'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'
import ContactView from '../../../../types/contact/view/ContactView'

const ContactItems: React.FC<ContactItemsProps> = ({
  items,
  contactService,
  googleContactService,
  phoneService
}) => {
  const [cardOpen, setCardOpen] = useState(false)
  const [contactToEdit, setContactToEdit] = useState<ContactView | undefined>(undefined)
  const [contactToDelete, setContactToDelete] = useState<ContactView | undefined>(undefined)

  const language = useCurrentLanguage()

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

    const handleOpenCard = (index: number) => {
        setCardOpen(true)
        setContactToEdit(items[index])
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
           <ContactCard
              item={item}
              phoneService={phoneService}
              onClose={() => setCardOpen(0)}
              setEdit={setContactToEdit}
              setDelete={setContactToDelete}
              dialogOpen={cardOpen}
         />
      <ContactFormDialog
        item={contactToEdit}
        contactService={contactService}
        phoneService={phoneService}
        items={items}
        dialogOpen={contactToEdit !== undefined}
        onClose={() => setContactToEdit(undefined)}
        action={Constants.ACTION_EDIT}
      />
    <AgreementDialog 
      open={Boolean(_delete)}
      agreeOptionText={language.AGREEMENT_OPTION_TEXT}
      disagreeOptionText={language.DISAGREEMENT_OPTION_TEXT}
      description={language.DELETE_CONTACT_OPTION_TEXT}
      question={language.DELETE_CONTACT_QUESTION}
      onAgree={() => setDeleteDialogAgreement(true)}
      onDisagree={handleCloseDeleteDialog}
            />
        </>
    )
}

export default ContactItems
