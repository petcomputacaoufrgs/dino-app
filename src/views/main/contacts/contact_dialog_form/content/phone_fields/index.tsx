import React from 'react'
import { useLanguage } from '../../../../../../context_provider/app_settings'
import TextField from '@material-ui/core/TextField'
import { MenuItem, IconButton } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import ContactsConstants from '../../../../../../constants/ContactsConstants'
import PhoneFieldsProps from './props'
import NumberFormat from 'react-number-format'
import strUtils from '../../../../../../utils/StringUtils'
import InputAdornment from '@material-ui/core/InputAdornment'

const PhoneFields = ({
  type, onChangeType, number,  onChangeNumber, error, helperText, handleDeletePhone
  } : PhoneFieldsProps): JSX.Element => {

  const language = useLanguage().current

  const types = [
    { label: language.CONTACTS_MOBILE_PHONE, id: ContactsConstants.MOBILE },
    { label: language.CONTACTS_RESIDENTIAL_PHONE, id: ContactsConstants.RESIDENTIAL,},
    {label: language.CONTACTS_PUBLIC_SERVICE_PHONE,id: ContactsConstants.PUBLIC_SERVICE,},
  ]


  const getNumberFormat = () => {

    if (type === ContactsConstants.RESIDENTIAL) {
      return '(23)4567-2345'
    }
    else if(type === ContactsConstants.MOBILE) {
      return '(89)89898-9898'
    }
    return ''
  }

  const getNumberMask = () => {

    if (type === ContactsConstants.RESIDENTIAL) {
      return strUtils.replaceDigits('(23)4567-2345', '#')
    }
    else if(type === ContactsConstants.MOBILE) {
      return strUtils.replaceDigits('(89)89898-9898', '#')
    }
    return undefined
  }

  return (
    <>
      <TextField
        id="select-type"
        select
        fullWidth
        margin="dense"
        label={language.FORM_TYPE}
        value={type}
        onChange={onChangeType}
      >
        {types.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <NumberFormat
        customInput={TextField}
        format={getNumberMask()}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => handleDeletePhone(number)}
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
        fullWidth
        placeholder={getNumberFormat()}
        error={error}
        value={number}
        onChange={onChangeNumber}
        margin="dense"
        label={language.FORM_PHONE}
        type="tel"
        helperText={helperText}
      />
    </>
  )
}

export default PhoneFields
