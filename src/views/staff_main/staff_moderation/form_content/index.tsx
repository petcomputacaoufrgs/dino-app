import { TextField } from '@material-ui/core'
import React from 'react'
import Button from '../../../../components/button'
import { useLanguage } from '../../../../context/language'
import { ReactComponent as SaveSVG } from '../../../../assets/icons/save.svg'


interface FormContentProps {
  value: string, 
  setValue: React.Dispatch<React.SetStateAction<string>>, 
  handleAdd: () => void
}

const FormContent: React.FC<FormContentProps> = ({value, setValue, handleAdd}) => {

  const language = useLanguage()

  return (
  <div className='dialog_form__content'>
    <TextField
      required
      fullWidth
      autoFocus
      value={value}
      onChange={e => setValue(e.target.value as string)}
      margin='dense'
      id='email'
      label={language.data.FORM_EMAIL}
      type='email'
      placeholder='Separe múltiplos e-mails por vírgula'
      inputProps={{ maxLength: 50 }}
      //error={isNameInvalid(props.name)}
    />
    <Button
      className='staff_moderation__save_button'
      onClick={handleAdd}
    >
      <SaveSVG className='staff_moderation__save_button__icon' />
      {language.data.FORM_ADD_STAFF}
    </Button>
  </div>
  )
}

export default FormContent