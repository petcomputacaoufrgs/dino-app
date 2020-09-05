import React from 'react'
import TextField from '@material-ui/core/TextField'
import { ContactFormDialogContentProps } from './props'
import PhoneFields from './phone_fields'
import { useLanguage } from '../../../../../context_provider/app_settings'
import { IconButton, Divider, ListItem } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import Typography from '@material-ui/core/Typography';


const ContactFormDialogContent = (
  props: ContactFormDialogContentProps
): JSX.Element => {
  const language = useLanguage().current

  const isTheInvalidNumber = (number: string): boolean =>
    props.helperText.number === number

  return (
    <>
      <TextField
        required
        fullWidth
        value={props.name}
        onChange={props.handleChangeName}
        error={props.invalidName}
        margin="dense"
        id="name"
        label={language.FORM_NAME}
        type="name"
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
      />
      <br />
      
      {props.phones.map((phone, index) => (
        <div key={index}>
          <PhoneFields
            type={phone.type}
            onChangeType={(e) => props.handleChangeType(e, index)}
            number={phone.number}
            onChangeNumber={(e) => props.handleChangeNumber(e, index)}
            error={isTheInvalidNumber(phone.number)}
            helperText={
              isTheInvalidNumber(phone.number) ? props.helperText.text : ''
            }
            handleDeletePhone={() => props.handleDeletePhone(phone.number)}
          />
          <br />
        </div>
      ))}

      <ListItem button onClick={props.handleAddPhone} alignItems='center' style={{justifyContent:"center"}}>
        <Typography variant='body2' color='textSecondary' display='block'>
          Adicionar Telefones
          </Typography>
        </ListItem>
    </>
  )
}

export default ContactFormDialogContent
