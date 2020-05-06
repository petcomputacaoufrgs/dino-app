import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../../provider/app_provider'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlossaryItems from './glossary_items'
import GlossaryLocalStorage from '../../../local_storage/GlossaryLocalStorage'
import GlossaryItemModel from '../../../model/dino_api/glossary/GlossaryItemModel'
import StringUtils from '../../../utils/StringUtils'
import SearchBar from '../../../components/search_bar'

const Glossary = (): JSX.Element => {

    const language = useLanguage().currentLanguage
    
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState(new Array<GlossaryItemModel>())

    const handleChange = event => setSearchTerm(event.target.value)

    useEffect(() => {
        const items = GlossaryLocalStorage.getItems()
        const results = items.filter(item =>
            StringUtils.contains(item.title, searchTerm)
        )
        setSearchResults(results)
    }, [searchTerm])

    return (
        <div className="glossary">
            <SearchBar
                value={searchTerm}
                onChange={handleChange}
                placeholder={language.SEARCH_HOLDER} 
            />
            <GlossaryItems items={searchResults} />
        </div>
    )
}

export default Glossary