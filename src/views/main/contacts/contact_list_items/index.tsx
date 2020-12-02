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
import ContactModel from '../../../../types/contact/ContactModel'

const ContactItems = ({ items }: ContactItemsProps): JSX.Element => {

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [edit, setEdit] = useState(0)
  const [_delete, setDelete] = useState(0)
  const [cardOpen, setCardOpen] = useState(false)
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

  const handleOpenCard = (index: number) => {
    setCardOpen(true)
    setSelectedIndex(index)
  }

  const getSelectedContact = (): ContactModel => items[selectedIndex] 
  
  return (
    <>
    <List className="contacts__list">
      {items.map((contact, index) => 
          <ContactItemList
            key={index}
            item={contact}
            onEdit={() => setEdit(contact.frontId)}
            onDelete={() => setDelete(contact.frontId)}
            onClick={() => handleOpenCard(index)}
          />
      )}
    </List>
    <ContactCard
      item={getSelectedContact()}
      dialogOpen={cardOpen}
      onClose={() => setCardOpen(false)}
      onEdit={() => setEdit(getSelectedContact().frontId)}
      onDelete={() => setDelete(getSelectedContact().frontId)}
    />
    <ContactFormDialog
      item={getSelectedContact()}
      dialogOpen={Boolean(edit)}
      onClose={() => setEdit(0)}
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
