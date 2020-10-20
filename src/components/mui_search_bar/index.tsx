import React from 'react'
import { InputAdornment, TextField, IconButton } from '@material-ui/core/'
import { Search } from '@material-ui/icons/'
import './styles.css'

interface SearchBarProps {
  value: string
  onChange: (event: any) => void
  placeholder: string
}

const MuiSearchBar = (props: SearchBarProps) => {
  return (
    <div className="mui-search-bar">
      <TextField
        id="outlined-helperText"
        fullWidth
        variant="outlined"
        value={props.value}
        onChange={props.onChange}
        aria-describedby="standard-weight-helper-text"
        size="small"
        placeholder={props.placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton>
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  )
}

export default MuiSearchBar
