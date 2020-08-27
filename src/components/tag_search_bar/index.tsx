import React from 'react'
import { useLanguage } from '../../context_provider/app_settings'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import TagSearchBarProps from './props'
import './styles.css'

const TagSearchBar = (props: TagSearchBarProps): JSX.Element => {
  const language = useLanguage().current

  const handleChange = (event: React.ChangeEvent<{}>, values: any) => {
    props.onTagSearch(values)
  }

  const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
    if (props.onTextSearch) {
      props.onTextSearch(value)
    }
  }

  return (
    <Autocomplete
      freeSolo
      multiple
      loadingText={language.LOADING}
      noOptionsText={language.NO_OPTIONS}
      options={props.options}
      getOptionLabel={(option) => option}
      className="tag_search_bar"
      onChange={handleChange}
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          className={props.textFieldClass}
          label={language.SEARCH_BUTTON_LABEL}
          variant="outlined"
        />
      )}
    />
  )
}

export default TagSearchBar
