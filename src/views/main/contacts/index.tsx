import React, { useState } from 'react'
import ContactItems from './contact_list_items'
import MuiSearchBar from '../../../components/mui_search_bar'
import ContactFormDialog from './contact_dialog_form'
import Contants from '../../../constants/contact/ContactsConstants'
import GoogleGrantDialog from '../../../components/google_grant_dialog'
import GoogleScope from '../../../types/auth/google/GoogleScope'
import { ReactComponent as AddIconSVG } from '../../../assets/icons/add.svg'
import CircularButton from '../../../components/button/circular_button'
import { usePhone } from '../../../context/provider/phone'
import { useGoogleContact } from '../../../context/provider/google_contact'
import { useContact } from '../../../context/provider/contact'
import Loader from '../../../components/loader'
import { useUserSettings } from '../../../context/provider/user_settings'
import { useGoogleScope } from '../../../context/provider/google_scope'
import 'bootstrap/dist/css/bootstrap.min.css'

const Contacts = (): JSX.Element => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)
  const currentSettings = userSettings.first
  const contact = useContact()
  const phone = usePhone()
  const googleContact = useGoogleContact()
  const googleScope = useGoogleScope()
  const syncGoogleContacts = googleScope.service.hasContactGrant(googleScope)
  const [openGrantDialog, setOpenGrantDialog] = useState(false)
  const [add, setAdd] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [shouldDecline, setShouldDecline] = useState(false)

  const contactViews = contact.service.getViewContactByFilter(
    contact.data,
    phone.data,
    googleContact.data,
    searchTerm
  )

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSearchTerm(event.target.value)
  }

  const handleAcceptGoogleGrant = () => {
    if (currentSettings) {
      currentSettings.declineGoogleContacts = false
      userSettings.service.save(currentSettings)
    }
    setOpenGrantDialog(false)
    setAdd(true)
  }

  const handleCloseGoogleGrant = () => {
    setOpenGrantDialog(false)
    setAdd(true)
  }

  const handleDeclineGoogleGrant = () => {
    setShouldDecline(true)
    setOpenGrantDialog(false)
    setAdd(true)
  }

  const handleAddContact = () => {
    if (currentSettings) {
      if (!syncGoogleContacts && !currentSettings.declineGoogleContacts) {
        setOpenGrantDialog(true)
        return
      }
    }

    setAdd(true)
  }

  const handleClose = () => {
    setAdd(false)
    if (shouldDecline && currentSettings) {
      currentSettings.declineGoogleContacts = true
      userSettings.service.save(currentSettings)
    }
  }

  return (
    <div className="contacts">
      <Loader
        className="contacts__loader"
        loading={contact.loading || phone.loading || googleContact.loading}
      >
        <MuiSearchBar
          value={searchTerm}
          onChange={handleChange}
          placeholder={language.SEARCH_HOLDER}
        />
        <ContactItems
          items={contactViews}
          contactService={contact.service}
          phoneService={phone.service}
          googleContactService={googleContact.service}
        />
        <CircularButton
          ariaLabel={language.CONTACTS_ADD_CONTACT}
          className="add_contact_button"
          icon={AddIconSVG}
          onClick={handleAddContact}
        />
      </Loader>
      <ContactFormDialog
        contactService={contact.service}
        phoneService={phone.service}
        googleContactService={googleContact.service}
        items={contactViews}
        action={Contants.ACTION_ADD}
        dialogOpen={add}
        onClose={handleClose}
      />
      <GoogleGrantDialog
        onAccept={handleAcceptGoogleGrant}
        onDecline={handleDeclineGoogleGrant}
        onClose={handleCloseGoogleGrant}
        open={openGrantDialog}
        scopes={[GoogleScope.SCOPE_CONTACT]}
        text={language.GOOGLE_CONTACT_GRANT_TEXT}
        title={language.GOOGLE_CONTACT_GRANT_TITLE}
      />
    </div>
  )
}

export default Contacts
