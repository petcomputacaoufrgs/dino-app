import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../../context_provider/app_settings'
import ContactModel from '../../../types/contact/ContactModel'
import ContactItems from './contact_list_items'
import StringUtils from '../../../utils/StringUtils'
import BootstrapSearchBar from '../../../components/bootstrap_search_bar'
import AddContactButton from './contact_button_add'
import ContactService from '../../../services/contact/ContactService'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useContacts } from '../../../context_provider/contact'


const Contacts = (): JSX.Element => {
  const language = useLanguage().current

  const items = useContacts().items
  const [add, setAdd] = useState(0)
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
