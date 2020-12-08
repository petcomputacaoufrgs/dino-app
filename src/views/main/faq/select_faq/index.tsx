import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import FaqService from '../../../../services/faq/FaqService'
import FaqOptionsModel from '../../../../types/faq/FaqOptionsModel'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import SelectFaqProps from './props'
import './styles.css'
import strUtils from '../../../../utils/StringUtils'

const SelectFaq = ({
  faq,
  setFaq,
}: SelectFaqProps): JSX.Element => {
  const language = useCurrentLanguage()
  const [faqOptions, setFaqOptions] = useState([] as FaqOptionsModel[])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(open && faqOptions.length === 0)
  const [value, setValue] = React.useState<FaqOptionsModel | null>(
    faq || null
  )
  const [inputValue, setInputValue] = useState(
    faq ? faq.title : ''
  )
  const [connectionError, setConnectionError] = useState(false)

  useEffect(() => {
    const getFaqOptions = async () => {
      if (open) {
        const response = await FaqService.getFaqOptionsFromServer()
        updateFaqOptions(response)
      }
    }

    let updateFaqOptions = (response: FaqOptionsModel[] | undefined) => {
      if (response !== undefined) {
        setFaqOptions(strUtils.sortByAttr(response, 'title'))
        setLoading(false)
        if (connectionError) {
          setConnectionError(false)
        }
      } else {
        setLoading(false)
        setConnectionError(true)
      }
    }

    const cleanBeforeUpdate = () => {
      updateFaqOptions = (response: FaqOptionsModel[] | undefined) => {}
    }

    getFaqOptions()

    return cleanBeforeUpdate
  }, [open, loading, connectionError])

  useEffect(() => {
    if (value !== null) {
      setFaq(value)
    }
  }, [value, setFaq])

  return (
    <>
      <Autocomplete
        className="select-faq__autocomplete"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        getOptionSelected={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.title || ''}
        options={faqOptions}
        loading={loading}
        noOptionsText={
          connectionError ? language.FAQ_CONNECTION_ERROR : language.NO_OPTIONS
        }
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        value={value}
        onChange={(event: any, newValue: FaqOptionsModel | null) =>
          setValue(newValue)
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={language.SETTINGS_FAQ}
            variant="standard"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </>
  )
}

export default SelectFaq
