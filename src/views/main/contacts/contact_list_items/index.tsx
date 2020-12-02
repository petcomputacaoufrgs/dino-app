import React, { useState, useEffect } from 'react'
import ContactItemsProps from './props'
import ContactCard from '../contact_dialog_card'
import ContactItemList from '../contact_list_item'
import { List } from '@material-ui/core'
import ContactFormDialog from '../contact_dialog_form'
import ContactService from '../../../../services/contact/ContactService'
import Constants from '../../../../constants/contact/ContactsConstants'
import AgreementDialog from '../../../../components/agreement_dialog'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'

const ContactItems = ({ items, setItems }: ContactItemsProps): JSX.Element => {

  const [cardOpen, setCardOpen] = useState(0)
  const [edit, setEdit] = useState(0)
  const [_delete, setDelete] = useState(0)
  const [deleteDialogAgreement, setDeleteDialogAgreement] = useState(false)

  const language = useCurrentLanguage()

  useEffect(() => {
    if (_delete && deleteDialogAgreement) {
      ContactService.deleteContact(_delete)
      handleCloseDeleteDialog()
    }
  }, [_delete, deleteDialogAgreement])

  const handleCloseDeleteDialog = () => {
    setDeleteDialogAgreement(false)
    setDelete(0)
  }

  return (
    <>
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
