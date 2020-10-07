import React from 'react'
import { useCurrentLanguage } from '../../context_provider/app_settings'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import TagSearchBarProps from './props'
import './styles.css'
import { Search } from '@material-ui/icons'
import { InputAdornment, IconButton } from '@material-ui/core'

const TagSearchBar = (props: TagSearchBarProps): JSX.Element => {
  const language = useCurrentLanguage()

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
      size='small'
      renderInput={(params) => (
        <TextField
          {...params}
          className={props.textFieldClass}
          placeholder={language.SEARCH_BUTTON_LABEL}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <IconButton>
                    <Search />
                  </IconButton>
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            )
          }}
        />
      )}
    />
  )
}

export default TagSearchBar
