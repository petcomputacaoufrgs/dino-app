import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import FaqService from '../../../../services/faq/FaqService'
import FaqOptionsModel from '../../../../types/faq/FaqOptionsModel'
import { useLanguage } from '../../../../context_provider/app_settings'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import SelectFaqProps from './props'

const SelectFaq = ({selectedFaq, setSelectedFaq}: SelectFaqProps): JSX.Element => {

    const language = useLanguage().current

    const [faqOptions, setFaqOptions] = useState([] as FaqOptionsModel[])
    const [open, setOpen] = useState(false)
    const [value, setValue] = React.useState<FaqOptionsModel | null>(selectedFaq || null);
    const [inputValue, setInputValue] = React.useState(selectedFaq ? selectedFaq.title : '');
    
    const loading = open && faqOptions.length === 0;

    useEffect(() => {
      if (!loading) {
        return undefined
      }
      const getFaqOptions = async () => {
        if(open) {
          const response = await FaqService.getFaqOptionsFromServer() as FaqOptionsModel[]
          if(response !== undefined) {
            setFaqOptions(response)
          }
        }
      }
      getFaqOptions()
    }, [loading])

    useEffect(() => {
      if (value !== null) {
        setSelectedFaq(value)
      }
    }, [value])

    return (
      <>
      <Autocomplete
        id="faq-select-label"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        getOptionSelected={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.title || ''}
        options={faqOptions}
        loading={loading}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        value={value}
        onChange={(event: any, newValue: FaqOptionsModel | null) => setValue(newValue)}
        renderInput={params => (
          <TextField
            {...params}
            label={language.SETTINGS_FAQ}
            variant='standard'
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
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