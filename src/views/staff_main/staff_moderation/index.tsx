import { TextField } from '@material-ui/core'
import React, { useState } from 'react'
import Button from '../../../components/button'
import { useLanguage } from '../../../context/language'
import './styles.css'
import { ReactComponent as SaveSVG } from '../../../assets/icons/save.svg'


const StaffModeration: React.FC = () => {

  const language = useLanguage()

  const [email, setEmail] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value as string)
  }

  const handleAddEmail = () => {

  }

  return (
    <div className='dialog_form__content'>
      <TextField
        required
        fullWidth
        value={email}
        onChange={handleChange}
        margin='dense'
        id='name'
        label={language.data.FORM_EMAIL}
        type='name'
        inputProps={{ maxLength: 50 }}
        //error={isNameInvalid(props.name)}
      />
      <Button
        className='staff_moderation__save_button'
        onClick={handleAddEmail}
      >
        <SaveSVG className='staff_moderation__save_button__icon' />
        {language.data.FORM_ADD_STAFF}
      </Button>
    </div>
  )
}

export default StaffModeration