import React, { useEffect } from 'react'
import { useLanguage } from '../../../../../provider/app_settings_provider'
import TextField from '@material-ui/core/TextField'
import { ContactFormDialogContentProps } from './props'
import PhoneFields from './phone_fields'
import Constants from '../../../../../constants/ContactsConstants'

const ContactFormDialogContent = (
  props: ContactFormDialogContentProps
): JSX.Element => {
  const language = useLanguage().current

  useEffect(() => {
    if (props.values.addPhone) {
      props.values.phones.push({ type: Constants.MOBILE, number: '' })
      props.sets.setPhones([...props.values.phones])
      props.sets.setAddPhone(false)
    }
  }, [props.values.addPhone, props.sets, props.values.phones])

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.sets.setName(event.target.value as string)
  }
  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    props.sets.setDescription(event.target.value as string)
  }

  const handleChangeType = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    props.values.phones[index].type = Number(event.target.value)
    props.sets.setPhones([...props.values.phones])
  }
  const handleChangeNumber = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    props.values.phones[index].number = event.target.value as string
    props.sets.setPhones(props.values.phones)
  }

  const isTheInvalidNumber = (number: string): boolean =>
    props.values.helperText.number === number

  return (
    <>
      <TextField
        required
        fullWidth
        value={props.values.name}
        onChange={handleChangeName}
        error={props.values.invalidName}
        autoFocus
        margin="dense"
        id="name"
        label={language.FORM_NAME}
        type="name"
      />
      <br />
      <TextField
        fullWidth
        value={props.values.description}
        onChange={handleChangeDescription}
        margin="dense"
        id="description"
        label={language.FORM_DESCRIPTION}
        type="text"
      />
      <br />
      {props.values.phones.map((phone, index) => (
        <div key={index}>
          <PhoneFields
            type={phone.type}
            onChangeType={(e) => handleChangeType(e, index)}
            number={phone.number}
            onChangeNumber={(e) => handleChangeNumber(e, index)}
            error={isTheInvalidNumber(phone.number)}
            helperText={
              isTheInvalidNumber(phone.number)
                ? props.values.helperText.text
                : ''
            }
            handleDeletePhone={() => props.handleDeletePhone(phone.number)}
          />
          <br />
        </div>
      ))}
    </>
  )
}

export default ContactFormDialogContent
