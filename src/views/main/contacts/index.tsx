import React, { useState, useEffect } from 'react'
import { useCurrentLanguage } from '../../../context/provider/app_settings'
import ContactModel from '../../../types/contact/ContactModel'
import ContactItems from './contact_list_items'
import StringUtils from '../../../utils/StringUtils'
import MuiSearchBar from '../../../components/mui_search_bar'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useContacts } from '../../../context/provider/contact'
import ContactFormDialog from './contact_dialog_form'
import Contants from '../../../constants/contact/ContactsConstants'
import GoogleGrantDialog from '../../../components/google_grant_dialog'
import GoogleScope from '../../../types/auth/google/GoogleScope'
import AuthService from '../../../services/auth/AuthService'
import { ReactComponent as AddIconSVG } from '../../../assets/icons/add.svg'
import CircularButton from '../../../components/button/circular_button'

const Contacts = (): JSX.Element => {
  const language = useCurrentLanguage()

  const items = useContacts().items
  const [openGrantDialog, setOpenGrantDialog] = useState(false)
  const [add, setAdd] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([] as ContactModel[])


  useEffect(() => {
    const results = items.filter((item) =>
      StringUtils.contains(item.name, searchTerm)
    )
    setSearchResults(results)
  }, [items, searchTerm])

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSearchTerm(event.target.value)
  }

  const handleAcceptOrDeclineGoogleGrant = () => {
    setAdd(true)
    setOpenGrantDialog(false)
  }

  const handleAddContact = () => {
    const hasGoogleContactsGrant = AuthService.hasGoogleContactsGrant()

    if (!hasGoogleContactsGrant) {
      const declinedGrant = AuthService.getDeclinedContactsGrant()
      if (!declinedGrant) {
        setOpenGrantDialog(true)

        return
      }
    }

    setAdd(true)
  }

  return (
    <div className='contacts'>
      <MuiSearchBar
        value={searchTerm}
        onChange={handleChange}
        placeholder={language.SEARCH_HOLDER}
      />
      <ContactItems items={searchResults} setItems={setSearchResults} />
      <CircularButton 
        ariaLabel={language.CONTACTS_ADD_CONTACT}
        className='add_contact_button' 
        icon={AddIconSVG} 
        onClick={handleAddContact}/>
      <ContactFormDialog
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
