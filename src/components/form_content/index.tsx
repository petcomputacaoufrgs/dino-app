import { TextField } from '@material-ui/core'
import React, { useState } from 'react'
import Button from '../button'
import { useLanguage } from '../../context/language'
import { ReactComponent as SaveSVG } from '../../assets/icons/save.svg'
import FormContentProps from './props'
import './styles.css'

const FormContent: React.FC<FormContentProps> = ( props ) => {

  const [value, setValue] = useState('')

  const language = useLanguage()

  const onSave = () => {
    if(!props.error) {
      props.handleSave(value)
      setValue('')
    }
  }

  return (
  <div className='dialog_form__content'>
    <TextField
      className='dialog_form__content__textfield'
      required={props.required}
      fullWidth={props.fullWidth}
      value={value}
      onChange={e => setValue(e.target.value as string)}
      margin='dense'
      id={props.type || 'name'}
      label={props.label}
      type={props.type || 'name'}
      placeholder={props.placeholder}
      helperText={props.helperText}
      inputProps={{ maxLength: props.textMaxLengh || 1000 }}
      error={props.error}
    />
    {props.children}
    <Button
      className='dialog_form__content__save_button'
      onClick={onSave}
    >
      <SaveSVG className='dialog_form__content__save_button__icon' />
      {props.saveButtonText || language.data.SETTINGS_SAVE}
    </Button>
  </div>
  )
}

export default FormContent