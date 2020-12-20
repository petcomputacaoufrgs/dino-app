import React, { useState, useEffect } from 'react'
import GlossaryItems from './glossary_items'
import StringUtils from '../../../utils/StringUtils'
import MuiSearchBar from '../../../components/mui_search_bar'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlossaryItemEntity from '../../../types/glossary/database/GlossaryItemEntity'
import { useGlossary } from '../../../context/provider/glossary'
import Loader from '../../../components/loader'
import { useUserSettings } from '../../../context/provider/user_settings'
import './styles.css'

const Glossary = (): JSX.Element => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)
  const glossary = useGlossary()

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<GlossaryItemEntity[]>([])

  const handleChange = (event: any) => setSearchTerm(event.target.value)

  useEffect(() => {
    const results = glossary.data
      .filter((item) => StringUtils.contains(item.title, searchTerm))
      .sort((a, b) => (a.title >= b.title ? 1 : -1))
    setSearchResults(results)
  }, [glossary, searchTerm])

  return (
    <div className="glossary">
      <MuiSearchBar
        value={searchTerm}
        onChange={handleChange}
        placeholder={language.SEARCH_HOLDER}
      />
      <Loader
        className="glossary_loader"
        loading={glossary.loading}
        disableBackground
      >
        <GlossaryItems items={searchResults} />
      </Loader>
    </div>
  )
}

export default Glossary
