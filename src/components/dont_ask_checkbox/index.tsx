import React from 'react'
import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core'
import DontAskCheckboxFormProps from './props'
import './styles.css'

const DontAskCheckboxForm = ({children, labelPlacement, dontAskOption, dontAskChecked, handleDontAskChecked}: DontAskCheckboxFormProps) => {

  return (
    <FormGroup className='form-group'>
        {children}
        {dontAskOption ? 
          <FormControlLabel
            className='form-control__checkbox'
            control={
              <Checkbox
              checked={dontAskChecked}
              onChange={handleDontAskChecked}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              />}
            label={"Não me pergunte novamente"}
            labelPlacement={labelPlacement || "end"}
          /> : <></>
        }
    </FormGroup>
  )
}

export default DontAskCheckboxForm