import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../language_provider';
import 'bootstrap/dist/css/bootstrap.min.css';
import GlossaryItems from './glossary_items';
import GlossaryLocalStorageService from '../../services/local_storage/GlossaryLocalStorageService'
import GlossaryItemModel from '../../model/GlossaryItemModel';
import StringUtils from '../../utils/StringUtils'
import BootstrapSearchBar from '../bootstrap_search_bar'

const Glossary = (): JSX.Element => {

    const languageProvider = useContext(LanguageContext)
    const language = languageProvider.currentLanguage
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState(new Array<GlossaryItemModel>())

    const handleChange = event => setSearchTerm(event.target.value)

    useEffect(() => {
        const items = GlossaryLocalStorageService.getItems()
        const results = items.filter(item =>
            StringUtils.normalize(item.title.toLowerCase())
                .includes(StringUtils.normalize(searchTerm.toLowerCase()))
        )
        setSearchResults(results)
    }, [searchTerm])

    return (
        <div className="glossary">
            <BootstrapSearchBar
                value={searchTerm}
                onChange={handleChange}
                placeholder={language.SEARCH_HOLDER} 
            />
            <GlossaryItems items={searchResults} />
        </div>
    )
}

export default Glossary