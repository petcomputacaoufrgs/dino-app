import React from "react"
import FilterIcon from '@material-ui/icons/FilterList';
import { Checkbox, FormControlLabel, IconButton, Menu } from '@material-ui/core'
import { useLanguage } from "../../../context/language"
import './styles.css'
import DinoFilterListProps from "./props"

const DinoFilterList: React.FC<DinoFilterListProps> = (props) => {

  const language = useLanguage()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)

  const handleClose = () => setAnchorEl(null)

  return (
    <div className='filterlist'>
      <IconButton onClick={(e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}>
        <FilterIcon fontSize='small'/>
        <div className='filterlist__label'>{language.data.FILTER}</div>
      </IconButton>
      <Menu
        id="fade-menu"
        className="filterlist__menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        open={open}
        keepMounted
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
      {props.filters.map((e, index) => 
        <FormControlLabel
          key={index}
          control={<Checkbox checked={e.checked} onChange={() => props.onChangeChecked(index)} />}
          label={e.label}
        />
      )}
      </Menu>
    </div>
  )
}

export default DinoFilterList