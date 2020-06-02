import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../../../provider/app_provider'
import TextField from '@material-ui/core/TextField';
import { MenuItem, CircularProgress } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Superagent from 'superagent'
import { ContactFormDialogContentProps, CountryTypeProps } from './props'
import useStyles from './styles'
import ContactsConstants from '../../../../../constants/ContactsConstants'


function countryToFlag(isoCode: string) {
    return typeof String.fromCodePoint !== 'undefined'
        ? isoCode.toUpperCase().replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
        : isoCode;
}


const ContactFormDialogContent = (props: ContactFormDialogContentProps): JSX.Element => {

    const classes = useStyles()
    const language = useLanguage().current

    let prevNumber = ''

    const types = [
        { label: language.CONTACTS_MOBILE_PHONE, id: ContactsConstants.MOBILE },
        { label: language.CONTACTS_RESIDENTIAL_PHONE, id: ContactsConstants.RESIDENTIAL },
        { label: language.CONTACTS_PUBLIC_SERVICE_PHONE, id: ContactsConstants.PUBLIC_SERVICE }
    ]

    const [openCountry, setOpenCountry] = useState(false);
    const [countries, setCountries] = useState<CountryTypeProps[]>([])

    const handleChangeName = (event: React.ChangeEvent<{ value: string }>) => {
        props.setName(event.target.value as string)
    }
    const handleChangeNumber = (event: React.ChangeEvent<{ value: string }>) => {
        let value = event.target.value

        if (props.dialCode === "(+55)" && prevNumber.length < value.length) {
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
    const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setType(Number(event.target.value))

    }

    const loading = openCountry && countries.length === 0;


    useEffect(() => {

        if (openCountry) {
            Superagent
                .get('https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json')
                .then(res => {
                    if (res.status === 200) {
                        setCountries(JSON.parse(res.text))
                    }

                    // res.body, res.headers, res.status
                })
                .catch(err => {
                    // err.message, err.response
                    console.error(err)
                })
        }
        console.log('a')
    }, [openCountry])


    const phonePlaceHolder = (): string => {
        switch (props.type) {
            case ContactsConstants.MOBILE:
                return '89 89898-9898'
            case ContactsConstants.RESIDENTIAL:
                return '23 4567-2345'
            case ContactsConstants.PUBLIC_SERVICE:
                return '111'
        }
        return ''
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
                id="select-type"
                select
                fullWidth
                margin="dense"
                label={language.FORM_TYPE}
                value={props.type}
                onChange={handleChangeType}
            >
                {types.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <br />
            <Autocomplete
                id="country-select"
                classes={{
                    option: classes.option,
                }}
                open={openCountry}
                onOpen={() => setOpenCountry(true)}
                onClose={() => setOpenCountry(false)}
                onInputChange={(e, value) => props.setDialCode(value)}
                defaultValue={{
                    "name": "Brazil",
                    "dial_code": "+55",
                    "code": "BR"
                }}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => `(${option.dial_code})`}
                options={countries}
                loading={loading}
                renderOption={(option) => (
                    <React.Fragment>
                        <span>{countryToFlag(option.code)}</span>
                        {option.name} ({option.dial_code})
                    </React.Fragment>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        margin="dense"
                        label="Dial Code"
                        type="tel"
                        inputProps={{ ...params.inputProps, }}
                    />
                )}
            />

            <TextField
                required
                fullWidth
                placeholder={phonePlaceHolder()}
                error={!props.validNumber}
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

export default ContactFormDialogContent

