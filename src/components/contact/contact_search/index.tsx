import React, { useState, useEffect, useContext } from 'react';
import { LanguageProviderContext } from '../../language_provider';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchIcon from '@material-ui/icons/Search';
import ContactItems from '../contact_items';
import StringUtils from '../../../utils/StringUtils'
import './styles.css'


const ContactSearchBar = () : JSX.Element => {

    const languageContext = useContext(LanguageProviderContext)
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState(new Array())//useState(new Array<ContactItemModel>())

    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    //Para realizar uma pesquisa global e substituir, incluir a chave g na expressão regular ou se o primeiro parâmetro é uma string, inclua g no parâmetro flags.
    useEffect(() => {
        const items = [{
            'id': 1,
            'name': 'Akqvjaahf',
            'number': '5191242345'
        },{
            'id': 2,
            'name': 'UDBIUABA',
            'number': '36363634'
        },{
            'id': 3,
            'name': 'ASOIHAOFB',
            'number': '51936365'
        },{
            'id': 4,
            'name': 'SKLANDLN',
            'number': '35353535'
        },]
        const results = items.filter(item =>
            StringUtils.normalizeString(item.name.toLowerCase())
            .includes(StringUtils.normalizeString(searchTerm.toLowerCase()))
        );
        setSearchResults(results);
    }, [searchTerm])

    return (
        <div className="contacts">
            <div className='search-bar'>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroupPrepend"><SearchIcon /></span>
                    </div>
                    <input className="form-control"
                        type="text"
                        aria-label="Search"
                        value={searchTerm}
                        onChange={handleChange}
                        placeholder={languageContext.SEARCH_HOLDER}
                    />
                </div>
            </div>
            <ContactItems items={searchResults} />
        </div>
    );
}

export default ContactSearchBar