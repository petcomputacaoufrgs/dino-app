import React from 'react'
import { useCurrentLanguage } from '../../../../../../context/provider/app_settings'
import TextField from '@material-ui/core/TextField'
import { MenuItem } from '@material-ui/core'
import IconButton from '../../../../../../components/button/icon_button'
import { ReactComponent as ClearIconSVG } from '../../../../../../assets/icons/close.svg'
import ContactsConstants from '../../../../../../constants/contact/ContactsConstants'
import PhoneFieldsProps from './props'
import NumberFormat from 'react-number-format'
import strUtils from '../../../../../../utils/StringUtils'
import InputAdornment from '@material-ui/core/InputAdornment'
import Constants from '../../../../../../constants/contact/ContactsConstants'
import './style.css'

const PhoneFields = ({
  type,
  onChangeType,
  number,
  onChangeNumber,
  error,
  helperText,
  handleDeletePhone,
}: PhoneFieldsProps): JSX.Element => {
  const language = useCurrentLanguage()

  const types = [
    { label: language.CONTACTS_MOBILE_PHONE, id: ContactsConstants.MOBILE },
    {
      label: language.CONTACTS_RESIDENTIAL_PHONE,
      id: ContactsConstants.RESIDENTIAL,
    },
    {
      label: language.CONTACTS_PUBLIC_SERVICE_PHONE,
      id: ContactsConstants.PUBLIC_SERVICE,
    },
  ]

  const getNumberFormat = () => {
    if (type === ContactsConstants.RESIDENTIAL) {
      return '(23)4567-2345'
    }
    if (type === ContactsConstants.MOBILE) {
      return '(89)89898-9898'
    }
    return ''
  }

  const getNumberMask = () => {
    return type === ContactsConstants.PUBLIC_SERVICE
      ? '#'.repeat(Constants.NUMBER_MAX)
      : strUtils.replaceDigits(getNumberFormat(), '#')
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
        {types.map((option, index) => (
          <MenuItem key={index} value={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <NumberFormat
        customInput={TextField}
        format={getNumberMask()}
        InputProps={{
          maxLength: Constants.NUMBER_MAX,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                ariaLabel={language.CONTACT_CLEAR_BUTTON_ARIA_LABEL}
                icon={ClearIconSVG}
                className="clear_button"
                onClick={() => handleDeletePhone(number)}
              />
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
