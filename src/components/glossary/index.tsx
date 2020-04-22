import React, { useState, useEffect, useContext } from 'react';
import { LanguageProviderContext } from '../language_provider';
import 'bootstrap/dist/css/bootstrap.min.css';
import GlossaryItems from './glossary_items';
import LocalStorageService from '../../services/LocalStorageService'
import GlossaryItemModel from '../../model/GlossaryItemModel';
import StringUtils from '../../utils/StringUtils'
import SearchBar from '../search_bar'
import './styles.css';

const Glossary = (): JSX.Element => {

    const languageContext = useContext(LanguageProviderContext)
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState(new Array<GlossaryItemModel>())

    const handleChange = event => {
        setSearchTerm(event.target.value)
    };

    useEffect(() => {
        const items = LocalStorageService.getGlossaryItems()
        const results = items.filter(item =>
            StringUtils.normalize(item.title.toLowerCase())
                .includes(StringUtils.normalize(searchTerm.toLowerCase()))
        );
        setSearchResults(results)
    }, [searchTerm])

    return (
        <div className="glossary">
            <SearchBar
                value={searchTerm}
                onChange={handleChange}
                placeholder={languageContext.SEARCH_HOLDER} 
            />
            <GlossaryItems items={searchResults} />
        </div>
    )
}

export default Glossary