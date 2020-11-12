import React, { useState, useEffect } from 'react'
import { useCurrentLanguage } from '../../../context/provider/app_settings'
import ContactModel from '../../../types/contact/ContactModel'
import ContactItems from './contact_list_items'
import StringUtils from '../../../utils/StringUtils'
import MuiSearchBar from '../../../components/mui_search_bar'
import ButtonAdd from '../../../components/button_add'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useContacts } from '../../../context/provider/contact'
import ContactFormDialog from './contact_dialog_form'
import Contants from '../../../constants/contact/ContactsConstants'

const Contacts = (): JSX.Element => {
  const language = useCurrentLanguage()

  const items = useContacts().items
  const [add, setAdd] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([] as ContactModel[])

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSearchTerm(event.target.value)
  }

  useEffect(() => {
    const results = items.filter((item) =>
      StringUtils.contains(item.name, searchTerm)
    )
    setSearchResults(results)
  }, [items, searchTerm])

  return (
    <div className='contacts'>
      <MuiSearchBar
        value={searchTerm}
        onChange={handleChange}
        placeholder={language.SEARCH_HOLDER}
      />
      <ContactItems items={searchResults} setItems={setSearchResults} />
      <ButtonAdd onClick={() => setAdd(true)} />
      <ContactFormDialog
        action={Contants.ACTION_ADD}
        dialogOpen={add}
        onClose={() => setAdd(false)}
      />
    </div>
  )
}

export default Contacts
