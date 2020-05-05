import React, { useState, useEffect, useContext } from 'react'
import { LanguageContext } from '../../../provider/language_provider'
import 'bootstrap/dist/css/bootstrap.min.css'
import SearchIcon from '@material-ui/icons/Search'
import GlossaryItems from '../glossary_items'
import './styles.css';
import GlossaryLocalStorageService from '../../../local_storage/GlossaryLocalStorage'
import GlossaryItemModel from '../../../model/dino_api/glossary/GlossaryItemModel'
import StringUtils from '../../../utils/StringUtils'


const GlossarySearchBar = () : JSX.Element => {

    const languageContext = useContext(LanguageContext)
    const language = languageContext.currentLanguage
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState(new Array<GlossaryItemModel>())

    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    //Para realizar uma pesquisa global e substituir, incluir a chave g na expressão regular ou se o primeiro parâmetro é uma string, inclua g no parâmetro flags.
    useEffect(() => {
        const items = GlossaryLocalStorageService.getItems()
        const results = items.filter(item =>
            StringUtils.contains(item.title, searchTerm)
        )
        setSearchResults(results);
    }, [searchTerm])

    return (
        <div className="glossary">
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
                        placeholder={language.SEARCH_HOLDER}
                    />
                </div>
            </div>
            <GlossaryItems items={searchResults} />
        </div>
    );
}

export default GlossarySearchBar