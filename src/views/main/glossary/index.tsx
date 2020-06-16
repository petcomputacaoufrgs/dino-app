import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../../provider/app_provider'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlossaryItems from './glossary_items'
import GlossaryItemModel from '../../../services/glossary/api_model/GlossaryItemModel'
import StringUtils from '../../../utils/StringUtils'
import BootstrapSearchBar from '../../../components/bootstrap_search_bar'
import GlossaryService from '../../../services/glossary/GlossaryService'

const Glossary = (): JSX.Element => {
  const language = useLanguage().current

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState(
    new Array<GlossaryItemModel>()
  )

  const handleChange = (event) => setSearchTerm(event.target.value)

  useEffect(() => {
    const items = GlossaryService.getItems()
    const results = items.filter((item) =>
      StringUtils.contains(item.title, searchTerm)
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
