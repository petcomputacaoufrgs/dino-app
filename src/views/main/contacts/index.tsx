import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../../provider/app_provider'
import ContactItemModel from '../../../services/contact/api_model/ContactModel'
import 'bootstrap/dist/css/bootstrap.min.css'
import ContactItems from './contact_items'
import StringUtils from '../../../utils/StringUtils'
import SearchBar from '../../../components/search_bar'
import ContactsConstants from '../../../constants/ContactsConstants'


const Contacts = (): JSX.Element => {

  const language = useLanguage().current

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState(
    new Array<ContactItemModel>()
  )

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }

  //isso é PROVISÓRIO ook não me matem
  useEffect(() => {
    const items = [
      {
        id: 100,
        name: 'SAMU',
        phone: '192',
        type: ContactsConstants.PUBLIC_SERVICE,
        description: '',
        color: 'red'
      },
      {
        id: 1,
        name: 'Babu Santana',
        phone: '555196969696',
        type: ContactsConstants.MOBILE,
        description: 'infosupersecretaaaaaa1',
        color: 'red'
      },
      {
        id: 2,
        name: 'Mari Baianinha',
        phone: '36969696',
        type: ContactsConstants.RESIDENTIAL,
        description:
          'blubublu blablalba blubublu blablalba blubublu blablalba blubublu',
        color: 'pink'
      },
      {
        id: 3,
        name: 'Manu Gavassi',
        phone: '26969696',
        type: ContactsConstants.RESIDENTIAL,
        description: 'infosupersecretaaaaaa3',
        color: 'green'
      },
      {
        id: 4,
        name: 'Thelminha',
        phone: '96969696',
        type: ContactsConstants.MOBILE,
        description: 'infosupersecretaaaaaa4',
        color: 'pink'
      }, {
        id: 5,
        name: 'Manu Gavassi',
        phone: '26969696',
        type: ContactsConstants.RESIDENTIAL,
        description: 'infosupersecretaaaaaa3',
        color: 'green'
      },
      {
        id: 6,
        name: 'Thelminha',
        phone: '96969696',
        type: ContactsConstants.MOBILE,
        description: 'infosupersecretaaaaaa4',
        color: 'pink'
      },
    ]
    const results = items.filter((item) =>
      StringUtils.contains(item.name, searchTerm)
    )
    setSearchResults(results)
  }, [searchTerm])

  return (
    <div>
      <SearchBar
        value={searchTerm}
        onChange={handleChange}
        placeholder={language.SEARCH_HOLDER}
      />
      <ContactItems items={searchResults} />
    </div>
  )
}

export default Contacts
