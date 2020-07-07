import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import SearchIcon from '@material-ui/icons/Search'
import SearchBarProps from './props'
import './styles.css'

const BootstrapSearchBar = (props: SearchBarProps): JSX.Element => (
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
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
    </div>
  </div>
)

export default BootstrapSearchBar
