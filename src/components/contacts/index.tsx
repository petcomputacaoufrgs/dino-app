import React, { useState, useEffect, useContext } from 'react';
import { LanguageProviderContext } from '../language_provider';
import 'bootstrap/dist/css/bootstrap.min.css';
import ContactItems from './contact_items';
import StringUtils from '../../utils/StringUtils'
import SearchBar from '../search_bar'
import './styles.css'


const Contacts = (): JSX.Element => {

    const languageContext = useContext(LanguageProviderContext)
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState(new Array())//useState(new Array<ContactItemModel>())

    const handleChange = event => {
        setSearchTerm(event.target.value)
    };

    //isso é PROVISÓRIO ook não me matem
    useEffect(() => {
        const items = [{
            'id': 1,
            'name': 'Akqvjaahf',
            'number': '5191242345'
        }, {
            'id': 2,
            'name': 'UDBIUABA',
            'number': '36363634'
        }, {
            'id': 3,
            'name': 'ASOIHAOFB',
            'number': '51936365'
        }, {
            'id': 4,
            'name': 'SKLANDLN',
            'number': '35353535'
        },]
        const results = items.filter(item =>
            StringUtils.normalize(item.name.toLowerCase())
                .includes(StringUtils.normalize(searchTerm.toLowerCase()))
        )
        setSearchResults(results)
    }, [searchTerm])

    return (
        <div className="contacts">
            <SearchBar
                value={searchTerm}
                onChange={handleChange}
                placeholder={languageContext.SEARCH_HOLDER}
            />
            <ContactItems items={searchResults} />
        </div>
    )
}

export default Contacts