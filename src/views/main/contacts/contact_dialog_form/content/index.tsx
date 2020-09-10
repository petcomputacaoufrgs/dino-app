import React from 'react'
import TextField from '@material-ui/core/TextField'
import { ContactFormDialogContentProps } from './props'
import PhoneFields from './phone_fields'
import { useLanguage } from '../../../../../context_provider/app_settings'
import { ListItem } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import Constants from '../../../../../constants/ContactsConstants'


const ContactFormDialogContent = (
  props: ContactFormDialogContentProps
): JSX.Element => {
  const language = useLanguage().current

  const isNumberTaken = (tel: string): boolean =>
    props.helperText.number === tel

  const isNumberInvalid = (tel: string) => {
    return isNumberTaken(tel) || tel.length === Constants.NUMBER_MAX
  }

  const isNameInvalid = (name: string) => {
    return name.length === Constants.NAME_MAX || props.invalidName
  }

  return (
    <>
      <TextField
        required
        fullWidth
        value={props.name}
        onChange={props.handleChangeName}
        margin="dense"
        id="name"
        label={language.FORM_NAME}
        type="name"
        inputProps={{maxLength: Constants.NAME_MAX}}
        error={isNameInvalid(props.name)}
      />
      <br />
      <TextField
        fullWidth
        value={props.description}
        onChange={props.handleChangeDescription}
        margin="dense"
        id="description"
        label={language.FORM_DESCRIPTION}
        type="text"
        inputProps={{maxLength: Constants.DESCRIPTION_MAX}}
        error={props.description.length === Constants.DESCRIPTION_MAX}
      />
      <br />
      
      {props.phones.map((phone, index) => (
        <div key={index}>
          <PhoneFields
            type={phone.type}
            onChangeType={(e) => props.handleChangeType(e, index)}
            number={phone.number}
            onChangeNumber={(e) => props.handleChangeNumber(e, index)}
            error={isNumberInvalid(phone.number)}
            helperText={
              isNumberTaken(phone.number) ? props.helperText.text : ''
            }
            handleDeletePhone={() => props.handleDeletePhone(phone.number)}
          />
          <br />
        </div>
      ))}

      <ListItem button onClick={props.handleAddPhone} alignItems='center' style={{justifyContent:"center"}}>
        <Typography variant='body2' color='textSecondary' display='block'>
          {language.FORM_ADD_PHONE}
          </Typography>
        </ListItem>
    </>
  )
}

export default ContactFormDialogContent
