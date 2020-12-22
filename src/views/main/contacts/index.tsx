import React, { useState } from 'react'
import ContactItems from './contact_list_items'
import MuiSearchBar from '../../../components/mui_search_bar'
import ContactFormDialog from './contact_dialog_form'
import Contants from '../../../constants/contact/ContactsConstants'
import GoogleGrantDialog from '../../../components/google_grant_dialog'
import GoogleScope from '../../../types/auth/google/GoogleScope'
import { ReactComponent as AddIconSVG } from '../../../assets/icons/add.svg'
import CircularButton from '../../../components/button/circular_button'
import 'bootstrap/dist/css/bootstrap.min.css'
import { usePhone } from '../../../context/provider/phone'
import { useGoogleContact } from '../../../context/provider/google_contact'
import { useContact } from '../../../context/provider/contact'
import Loader from '../../../components/loader'
import { useUserSettings } from '../../../context/provider/user_settings'
import { useGoogleScope } from '../../../context/provider/google_scope'

const Contacts = (): JSX.Element => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)
  const syncGoogleContact = userSettings.service.getSyncGoogleContact(userSettings)
  const declinedSyncGoogleContact = userSettings.service.getDeclinedGoogleContact(userSettings)
  const contact = useContact()
  const phone = usePhone()
  const googleContact = useGoogleContact()
  const googleScope = useGoogleScope()

  const [openGrantDialog, setOpenGrantDialog] = useState(false)
  const [add, setAdd] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const contactViews = contact.service.getViewContactByFilter(contact.data, phone.data, googleContact.data, searchTerm)

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSearchTerm(event.target.value)
  }

  const handleAcceptOrDeclineGoogleGrant = () => {
    setAdd(true)
    setOpenGrantDialog(false)
  }

  const handleAddContact = () => {
    if (!declinedSyncGoogleContact) {
      const hasGoogleContactsGrant = googleScope.service.hasContactGrant(googleScope)

      if (!hasGoogleContactsGrant && !syncGoogleContact) {
        setOpenGrantDialog(true)
  
        return
      }
  
      setAdd(true)
    }
  }

  return (
    <div className="contacts">
      <Loader className="contacts__loader" loading={contact.loading || phone.loading || googleContact.loading}>
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
        items={contactViews}
        action={Contants.ACTION_ADD}
        dialogOpen={add}
        onClose={() => setAdd(false)}
      />
      <GoogleGrantDialog
        onAccept={handleAcceptOrDeclineGoogleGrant}
        onDecline={handleAcceptOrDeclineGoogleGrant}
        open={openGrantDialog}
        scopes={[GoogleScope.SCOPE_CONTACT]}
        text={language.GOOGLE_CONTACT_GRANT_TEXT}
        title={language.GOOGLE_CONTACT_GRANT_TITLE}
      />
    </div>
  )
}

export default Contacts
