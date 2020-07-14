import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../../provider/app_settings_provider'
import GlossaryItems from './glossary_items'
import GlossaryItemModel from '../../../types/glossary/GlossaryItemModel'
import StringUtils from '../../../utils/StringUtils'
import BootstrapSearchBar from '../../../components/bootstrap_search_bar'
import { useGlossary } from '../../../provider/glossary_provider'
import 'bootstrap/dist/css/bootstrap.min.css'

const Glossary = (): JSX.Element => {
  const language = useLanguage().current
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
