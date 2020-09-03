import React from 'react'
import { useLanguage } from '../../context_provider/app_settings'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import TagSearchBarProps from './props'
import './styles.css'

const TagSearchBar: React.FC<TagSearchBarProps> = ({
  options, onTagSearch, onTextSearch
}): JSX.Element => {
  const language = useLanguage().current

  const handleChange = (event: React.ChangeEvent<{}>, values: any) => {
    onTagSearch(values)
  }

  const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
    if (onTextSearch) {
      onTextSearch(value)
    }
  }

  return (
    <Autocomplete
      freeSolo
      multiple
      loadingText={language.LOADING}
      noOptionsText={language.NO_OPTIONS}
      options={options}
      getOptionLabel={(option) => option}
      className="tag_search_bar"
      onChange={handleChange}
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          className="tag_search_bar__text_field"
          label={language.SEARCH_BUTTON_LABEL}
          variant="outlined"
        />
      )}
    />
  )
}

export default TagSearchBar
