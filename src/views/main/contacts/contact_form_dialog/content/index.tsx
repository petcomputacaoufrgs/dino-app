import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../../../../provider/app_provider'
import TextField from '@material-ui/core/TextField'
import { ContactFormDialogContentProps } from './props'
import ContactsConstants from '../../../../../constants/ContactsConstants'
import PhoneFields from './phone_fields'

const ContactFormDialogContent = (props: ContactFormDialogContentProps): JSX.Element => {

    const language = useLanguage().current

    let prevNumber = ''

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setName(event.target.value as string)
    }
    const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setDescription(event.target.value as string)
    }
    const handleChangeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value as string
        if (props.addPhoneAction) {
            props.setSecNumber(value)
        }
        else {
            if (prevNumber.length < value.length) {
                if (props.type === ContactsConstants.MOBILE) {
                    if (value.length === 8)
                        value += '-'
                    else if (value.length === 2)
                        value += ' '

                }
                else if (props.type === ContactsConstants.RESIDENTIAL) {
                    if (value.length === 7)
                        value += '-'
                    else if (value.length === 2)
                        value += ' '
                }
            }
            prevNumber = value
            props.setNumber(value)
        }
    }
    const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        props.addPhoneAction ? props.setSecType(value) : props.setType(value)
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
            />
            {props.addPhoneAction || props.secNumber ?
                <>
                    <br />
                    <PhoneFields
                        type={props.secType}
                        onChangeType={handleChangeType}
                        number={props.secNumber}
                        onChangeNumber={handleChangeNumber}
                    />
                </> : <></>
            }
        </>
    )
}

export default ContactFormDialogContent

