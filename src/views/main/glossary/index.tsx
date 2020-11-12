import React, { useState, useEffect } from 'react'
import { useCurrentLanguage } from '../../../context_provider/app_settings'
import GlossaryItems from './glossary_items'
import GlossaryItemModel from '../../../types/glossary/GlossaryItemModel'
import StringUtils from '../../../utils/StringUtils'
import MuiSearchBar from '../../../components/mui_search_bar'
import { useGlossary } from '../../../context_provider/glossary'
import 'bootstrap/dist/css/bootstrap.min.css'

const Glossary = (): JSX.Element => {
  const language = useCurrentLanguage()
  const items = useGlossary().items

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState(
    new Array<GlossaryItemModel>()
  )

  const handleChange = (event) => setSearchTerm(event.target.value)

  useEffect(() => {
    const results = items.filter((item) =>
      StringUtils.contains(item.title, searchTerm)
    )
    setSearchResults(results)
  }, [items, searchTerm])

  return (
    <div className="glossary">
      <MuiSearchBar
        value={searchTerm}
        onChange={handleChange}
        placeholder={language.SEARCH_HOLDER}
      />
      <GlossaryItems items={searchResults} />
    </div>
  )
}

export default Glossary
