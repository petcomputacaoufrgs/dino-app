import { TextField } from '@material-ui/core'
import React, { useState } from 'react'
import Button from '../../../../components/button'
import { useLanguage } from '../../../../context/language'
import { ReactComponent as SaveSVG } from '../../../../assets/icons/save.svg'


interface FormContentProps {
  handleSave: (value: string) => void,
  error?: boolean
}

const FormContent: React.FC<FormContentProps> = ({handleSave, error}) => {

  const [value, setValue] = useState('')

  const language = useLanguage()

  const onSave = () => {
    handleSave(value)
    if(!error) {
      setValue('')
    }
  }

  return (
  <div className='dialog_form__content'>
    <TextField
      required
      fullWidth
      autoFocus
      value={value}
      onChange={e => {setValue(e.target.value as string)}}
      margin='dense'
      id='email'
      label={language.data.FORM_EMAIL}
      type='email'
      placeholder='Separe múltiplos e-mails por vírgula'
      inputProps={{ maxLength: 1000 }}
      error={error}
    />
    <Button
      className='staff_moderation__save_button'
      onClick={onSave}
    >
      <SaveSVG className='staff_moderation__save_button__icon' />
      {language.data.FORM_ADD_STAFF}
    </Button>
  </div>
  )
}

export default FormContent