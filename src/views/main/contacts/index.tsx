import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../../provider/app_provider'
import ContactItemModel from '../../../services/contact/api_model/ContactItemModel'
import 'bootstrap/dist/css/bootstrap.min.css'
import ContactItems from './contact_items'
import StringUtils from '../../../utils/StringUtils'
import BootstrapSearchBar from '../../../components/bootstrap_search_bar'

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
        id: 1,
        name: 'Babu Santana',
        number: '51 91242345',
        info: 'infosupersecretaaaaaa1',
        color: 'purple',
      },
      {
        id: 2,
        name: 'Mari Baianinha',
        number: '51 36363634',
        info:
          'infosupersecretaaaaaa2 uhihaiugbdgiavduyavu yavuahvsacdtyacd ycdayivatsc dysadcaysdc',
        color: 'red',
      },
      {
        id: 3,
        name: 'Manu Gavassi',
        number: '51 98936365',
        info: 'infosupersecretaaaaaa3',
        color: 'pink',
      },
      {
        id: 4,
        name: 'Thelminha',
        number: '51 35353535',
        info: 'infosupersecretaaaaaa4',
        color: 'green',
      },
    ]
    const results = items.filter((item) =>
      StringUtils.contains(item.name, searchTerm)
    )
    setSearchResults(results)
  }, [searchTerm])

  return (
    <div>
      <BootstrapSearchBar
        value={searchTerm}
        onChange={handleChange}
        placeholder={language.SEARCH_HOLDER}
      />
      <ContactItems items={searchResults} />
    </div>
  )
}

export default Contacts
