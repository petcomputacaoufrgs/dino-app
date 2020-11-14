import React from 'react'
import { Checkbox, FormControlLabel } from '@material-ui/core'
import DontAskCheckboxProps from './props'

const DontAskCheckbox = ({checked, handleChecked, label, labelPlacement}: DontAskCheckboxProps) => {
  return (
  <>
    <FormControlLabel
      className='dialog__content__checkbox'
      control={
        <Checkbox
        checked={checked}
        onChange={handleChecked}
        inputProps={{ 'aria-label': 'primary checkbox' }}
        />}
      label={label || "Não me pergunte novamente"}
      labelPlacement={labelPlacement || "end"}
    />
    <br />
  </>)
}

export default DontAskCheckbox