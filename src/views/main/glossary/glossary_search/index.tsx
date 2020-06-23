import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../../../provider/app_provider'
import 'bootstrap/dist/css/bootstrap.min.css'
import SearchIcon from '@material-ui/icons/Search'
import GlossaryItems from '../glossary_items'
import GlossaryItemModel from '../../../../services/glossary/api_model/GlossaryItemModel'
import StringUtils from '../../../../utils/StringUtils'
import GlossaryService from '../../../../services/glossary/GlossaryService'
import './styles.css'

const GlossarySearchBar = (): JSX.Element => {
  const language = useLanguage().current

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState(
    new Array<GlossaryItemModel>()
  )

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }

  //Para realizar uma pesquisa global e substituir, incluir a chave g na expressão regular ou se o primeiro parâmetro é uma string, inclua g no parâmetro flags.
  useEffect(() => {
    const items = GlossaryService.getItems()
    const results = items.filter((item) =>
      StringUtils.contains(item.title, searchTerm)
    )
    setSearchResults(results)
  }, [searchTerm])

  return (
    <div className="glossary">
      <div className="search-bar">
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroupPrepend">
              <SearchIcon />
            </span>
          </div>
          <input
            className="form-control"
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
  )
}

export default GlossarySearchBar