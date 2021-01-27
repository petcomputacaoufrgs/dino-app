import { TextField } from '@material-ui/core'
import React, { useState } from 'react'
import Button from '../button'
import { useLanguage } from '../../context/language'
import { ReactComponent as SaveSVG } from '../../assets/icons/save.svg'
import FormContentProps from './props'
import './styles.css'

const FormContent: React.FC<FormContentProps> = ( props ) => {

  const [value, setValue] = useState(props.invalidValue || '')

  const language = useLanguage()

  const onSave = (event: React.MouseEvent<any, MouseEvent>) => {
    props.handleSave(value)
    clearValue()
  }

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(event.target.value as string)
  }

  const clearValue = () => {
    if(!Boolean(props.invalidValue)) {
      setValue('')
    }
  }

  return (
  <div className='dialog_form__content'>
    <TextField
      className='dialog_form__content__textfield'
      margin='dense'
      required={props.required}
      fullWidth={props.fullWidth}
      multiline={props.multiline}
      id={props.type || 'name'}
      label={props.label}
      type={props.type || 'name'}
      placeholder={props.placeholder}
      helperText={props.helperText}
      value={value}
      onChange={onChange}
      error={Boolean(props.invalidValue)}
      
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