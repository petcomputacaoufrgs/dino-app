import { TextField } from '@material-ui/core'
import React from 'react'
import { useLanguage } from '../../../../context/language'
import { IsNotClient } from '../../../../context/private_router'

interface EmailFormProps {
  value: string, 
  handleChange: (value: string) => void,
  error: boolean,
}

const EmailTextField: React.FC<EmailFormProps> = ({ value, handleChange, error }) => {

  const language = useLanguage()
  const isNotClient = IsNotClient()

  return (
    <TextField
      className='email_textfield'
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      margin='dense'
      required
      fullWidth
      type='email'
      placeholder={language.data.EXAMPLE_EMAIL}
      inputProps={{ maxLength: 1000 }}
      label={language.data.FORM_EMAIL}
      disabled={isNotClient}
      error={error}
      helperText={error && 'E-mail inválido'}
    />
  )
}

export default EmailTextField