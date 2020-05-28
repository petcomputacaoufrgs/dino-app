import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../../provider/app_provider'
import ContactItemModel from '../../../services/contact/api_model/ContactModel'
import 'bootstrap/dist/css/bootstrap.min.css'
import ContactItems from './contact_items'
import StringUtils from '../../../utils/StringUtils'
import SearchBar from '../../../components/search_bar'
import AddContactButton from './add_contact_button'


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
        phone: { id: 100, countryCode: '', areaCode: '', number: '192' },
        description: '',
        color: 'red'
      },
      {
        id: 1,
        name: 'Babu Santana',
        phone: { id: 1, countryCode: '55', areaCode: '51', number: '96969696' },
        description: 'infosupersecretaaaaaa1',
        color: 'red'
      },
      {
        id: 2,
        name: 'Mari Baianinha',
        phone: { id: 2, countryCode: '', areaCode: '', number: '36969696' },
        description:
          'infosupersecretaaaaaa2 uhihaiugbdgiavduyavu yavuahvsacdtyacd ycdayivatsc dysadcaysdc',
        color: 'pink'
      },
      {
        id: 3,
        name: 'Manu Gavassi',
        phone: { id: 3, countryCode: '55', areaCode: '', number: '26969696' },
        description: 'infosupersecretaaaaaa3',
        color: 'green'
      },
      {
        id: 4,
        name: 'Thelminha',
        phone: { id: 4, countryCode: '', areaCode: '51', number: '96969696' },
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
      <AddContactButton />
    </div>
  )
}

export default Contacts
