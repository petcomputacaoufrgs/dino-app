import React from 'react'
import { useLanguage } from '../../../../../provider/app_provider'
import TextField from '@material-ui/core/TextField'
import { ContactFormDialogContentProps } from './props'
import PhoneFields from './phone_fields'

const ContactFormDialogContent = (props: ContactFormDialogContentProps): JSX.Element => {

    const language = useLanguage().current

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.sets.setName(event.target.value as string)
    }
    const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.sets.setDescription(event.target.value as string)
    }
    const handleChangeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as string
        props.sets.setNumber(value)
    }
    const handleChangeSecNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as string
        props.sets.setSecNumber(value)
    }
    const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        props.sets.setType(value)
    }
    const handleChangeSecType = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        props.sets.setSecType(value)
    }
    

    return (
        <>
            <TextField
                required
                fullWidth
                value={props.values.name}
                onChange={handleChangeName}
                error={!props.values.validName}
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
            <PhoneFields
                type={props.values.type}
                onChangeType={handleChangeType}
                number={props.values.number}
                onChangeNumber={handleChangeNumber}
                required
                error={!props.values.validNumber}
                helperText={props.values.helperText}
            />
            {props.values.addPhoneAction || props.values.secNumber ?
                <><br />
                    <PhoneFields
                        type={props.values.secType}
                        onChangeType={handleChangeSecType}
                        number={props.values.secNumber}
                        onChangeNumber={handleChangeSecNumber}
                    />
                </> 
            : <></>}
        </>
    )
}

export default ContactFormDialogContent

