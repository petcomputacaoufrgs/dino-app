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
        phones: [{
          number: '192',
          type: ContactsConstants.PUBLIC_SERVICE
        }],
        description: '',
        color: ContactsConstants.RED
      },
      {
        id: 1,
        name: 'Babu Santana',
        phones: [{
          number: '555196969696',
          type: ContactsConstants.MOBILE
        }],
        description: 'infosupersecretaaaaaa1',
        color: ContactsConstants.PURPLE
      },
      {
        id: 2,
        name: 'Mari Baianinha',
        phones: [{
          number: '36969696',
          type: ContactsConstants.RESIDENTIAL
        }, {
          number: '995353453',
          type: ContactsConstants.MOBILE
        }],
        description:
          'blubublu blablalba blubublu blablalba blubublu blablalba blubublu',
        color: ContactsConstants.BLUE
      },
      {
        id: 5,
        name: 'Bial',
        phones: [{
          number: '43244443',
          type: ContactsConstants.RESIDENTIAL,
        }],
        description: 'infosupersecretaaaaaa5',
        color: ContactsConstants.GREY
      },
      {
        id: 3,
        name: 'Manu Gavassi',
        phones: [{
          number: '26969696',
          type: ContactsConstants.RESIDENTIAL,
        }],
        description: 'infosupersecretaaaaaa3',
        color: ContactsConstants.PINK
      },
      {
        id: 4,
        name: 'Thelminha',
        phones: [{
          number: '96969696',
          type: ContactsConstants.MOBILE,
        }],
        description: 'infosupersecretaaaaaa4',
        color: ContactsConstants.GREEN
      },

    ]
    items.sort((a, b) =>
      StringUtils.normalizer(a.name) < StringUtils.normalizer(b.name) ? -1 : 1
    )
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
