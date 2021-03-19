import { TextField } from '@material-ui/core'
import React from 'react'
import DataConstants from '../../../../constants/app_data/DataConstants'
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
      className='email_textfield dino__textfield'
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      margin='dense'
      required={DataConstants.STAFF_EMAIL.REQUIRED}
      fullWidth
      type='email'
      placeholder={language.data.EXAMPLE_EMAIL}
      label={language.data.FORM_EMAIL}
      disabled={isNotClient}
      error={error}
      inputProps={{ maxLength: DataConstants.STAFF_EMAIL.MAX }}
      helperText={(error && language.data.INVALID_VALUE) || `${value.length}/${DataConstants.STAFF_EMAIL.MAX}`}
    />
  )
}

export default EmailTextField