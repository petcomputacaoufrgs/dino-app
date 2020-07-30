import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../../context_provider/app_settings'
import ContactModel from '../../../types/contact/ContactModel'
import ContactItems from './contact_list_items'
import StringUtils from '../../../utils/StringUtils'
import BootstrapSearchBar from '../../../components/bootstrap_search_bar'
import AddContactButton from './contact_button_add'
import ContactsService from '../../../services/contact/ContactsService'
import 'bootstrap/dist/css/bootstrap.min.css'

const Contacts = (): JSX.Element => {
  const language = useLanguage().current

  const [add, setAdd] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState(new Array<ContactModel>())

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSearchTerm(event.target.value)
  }

  useEffect(() => {
    if (!add) {
      const items = ContactsService.getItems()
      const results = items.filter((item) =>
        StringUtils.contains(item.name, searchTerm)
      )
      setSearchResults(results)
    }
  }, [searchTerm, add])

  return (
    <div>
      <BootstrapSearchBar
        value={searchTerm}
        onChange={handleChange}
        placeholder={language.SEARCH_HOLDER}
      />
      <ContactItems items={searchResults} setItems={setSearchResults} />
      <AddContactButton dialogOpen={add} setDialogOpen={setAdd} />
    </div>
  )
}

export default Contacts
