import React from 'react'
import { useLanguage } from '../../../../../../provider/app_provider'
import TextField from '@material-ui/core/TextField'
import { MenuItem } from '@material-ui/core'
import ContactsConstants from '../../../../../../constants/ContactsConstants'
import PhoneFieldsProps from './props'
import NumberFormat from 'react-number-format'
import strUtils from '../../../../../../utils/StringUtils'

const PhoneFields = (props: PhoneFieldsProps): JSX.Element => {

    const language = useLanguage().current

    const types = [
        { label: language.CONTACTS_MOBILE_PHONE, id: ContactsConstants.MOBILE },
        { label: language.CONTACTS_RESIDENTIAL_PHONE, id: ContactsConstants.RESIDENTIAL },
        { label: language.CONTACTS_PUBLIC_SERVICE_PHONE, id: ContactsConstants.PUBLIC_SERVICE }
    ]

    const getNumberFormat = (): string => {
        switch (props.type) {
            case ContactsConstants.RESIDENTIAL:
                return '(23)4567-2345'
            case ContactsConstants.PUBLIC_SERVICE:
                return '111'
            default:
                return '(89)89898-9898'
        }
    }

    return (
        <>
            <TextField
                id="select-type"
                select
                fullWidth
                margin="dense"
                label={language.FORM_TYPE}
                value={props.type}
                onChange={props.onChangeType}
            >
                {types.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <NumberFormat
                customInput={TextField}
                format={strUtils.replaceDigits(getNumberFormat(), '#')}
                fullWidth
                placeholder={getNumberFormat()}
                required={props.required}
                error={props.error}
                value={props.number}
                onChange={props.onChangeNumber}
                margin="dense"
                label={language.FORM_PHONE}
                type="tel"
            />
        </>
    )
}

export default PhoneFields