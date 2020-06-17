import React from 'react'
import { useLanguage } from '../../../../../provider/app_provider'
import TextField from '@material-ui/core/TextField'
import { ContactFormDialogContentProps } from './props'
import PhoneFields from './phone_fields'

const ContactFormDialogContent = (props: ContactFormDialogContentProps): JSX.Element => {

    const language = useLanguage().current

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setName(event.target.value as string)
    }
    const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setDescription(event.target.value as string)
    }
    const handleChangeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as string
        props.setNumber(value)
    }
    const handleChangeSecNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as string
        props.setSecNumber(value)
    }
    const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        props.setType(value)
    }
    const handleChangeSecType = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        props.setSecType(value)
    }
    


    return (
        <>
            <TextField
                required
                fullWidth
                value={props.name}
                onChange={handleChangeName}
                error={!props.validName}
                autoFocus
                margin="dense"
                id="name"
                label={language.FORM_NAME}
                type="name"
            />
            <br />
            <TextField
                fullWidth
                value={props.description}
                onChange={handleChangeDescription}
                margin="dense"
                id="description"
                label={language.FORM_DESCRIPTION}
                type="text"
            />
            <br />
            <PhoneFields
                type={props.type}
                onChangeType={handleChangeType}
                number={props.number}
                onChangeNumber={handleChangeNumber}
                required
                error={!props.validNumber}
                helperText={props.helperText}
            />
            {props.addPhoneAction || props.secNumber ?
                <><br />
                    <PhoneFields
                        type={props.secType}
                        onChangeType={handleChangeSecType}
                        number={props.secNumber}
                        onChangeNumber={handleChangeSecNumber}
                    />
                </> : <></>
            }
        </>
    )
}

export default ContactFormDialogContent

