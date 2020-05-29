import React, { useState } from 'react';
import { useLanguage } from '../../../../../provider/app_provider'
import TextField from '@material-ui/core/TextField';
import { MenuItem } from '@material-ui/core';


const AddContactDialogContent = (props: {
    name: string,
    setName: React.Dispatch<React.SetStateAction<string>>
    number: string,
    setNumber: React.Dispatch<React.SetStateAction<string>>
    type: string,
    setType: React.Dispatch<React.SetStateAction<string>>
}): JSX.Element => {

    const language = useLanguage().current


    const types = [
        { label: language.CONTACTS_MOBILE_PHONE },
        { label: language.CONTACTS_RESIDENTIAL_PHONE },
        { label: language.CONTACTS_PUBLIC_SERVICE_PHONE }
    ]

    const handleChangeName = (event: React.ChangeEvent<{ value: string }>) => {
        props.setName(event.target.value as string)
    }
    const handleChangeNumber = (event: React.ChangeEvent<{ value: string }>) => {
        props.setNumber(event.target.value as string)
    }
    const handleChangeType = (event: React.ChangeEvent<{ value: string }>) => {
        props.setType(event.target.value as string)
    }

    return (
        <>
            <TextField
                required
                value={props.name}
                onChange={handleChangeName}
                autoFocus
                margin="dense"
                id="name"
                label={language.FORM_NAME}
                type="name"
            />
            <br />
            <TextField
                id="select-type"
                select
                label={language.FORM_TYPE}
                value={props.type}
                onChange={handleChangeType}
            >
                {types.map((option) => (
                    <MenuItem key={option.label} value={option.label}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <br />
            <TextField
                required
                autoFocus
                value={props.number}
                onChange={handleChangeNumber}
                margin="dense"
                id="tel"
                label={language.FORM_PHONE}
                type="tel"
            />
        </>

    )
}

export default AddContactDialogContent