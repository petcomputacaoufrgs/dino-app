import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import SearchIcon from '@material-ui/icons/Search'
import SearchBarProps from './props'
import './styles.css'
import { useLanguage } from '../../context_provider/app_settings'

const BootstrapSearchBar = (props: SearchBarProps): JSX.Element => {
  const language = useLanguage().current

  return (
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
          aria-label={language.SEARCH_ARIA_LABEL}
          value={props.value}
          onChange={props.onChange}
          placeholder={props.placeholder}
        />
      </div>
    </div>
  )
}

export default BootstrapSearchBar
