import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../../provider/app_provider'
import ContactModel from '../../../services/contact/api_model/ContactModel'
import 'bootstrap/dist/css/bootstrap.min.css'
import ContactItems from './contact_items'
import StringUtils from '../../../utils/StringUtils'
import SearchBar from '../../../components/search_bar'
import AddContactButton from './contact_button_add'
import ContactsService from '../../../services/contact/ContactsService'

const Contacts = (): JSX.Element => {

  const language = useLanguage().current

  const [add, setAdd] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState(new Array<ContactModel>())

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    setSearchTerm(event.target.value)
  }
  
  useEffect(() => {
    if(add === 0){
      console.log("pai tirou")
      const items = ContactsService.getItems()
      const results = items.filter((item) =>
        StringUtils.contains(item.name, searchTerm)
      )
      setSearchResults(results)
    }
  }, [searchTerm, add])

  return (
    <div>
      <SearchBar
        value={searchTerm}
        onChange={handleChange}
        placeholder={language.SEARCH_HOLDER}
      />
      <ContactItems items={searchResults} setItems={setSearchResults}/>
      <AddContactButton dialogOpen={add} setDialogOpen={setAdd}/>
    </div>
  )
}

export default Contacts
