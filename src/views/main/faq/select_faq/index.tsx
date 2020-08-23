import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {FormControl,Select,MenuItem, InputLabel} from '@material-ui/core'
import FaqService from '../../../../services/faq/FaqService'
import { FaqTitleOptionsModel } from '../../../../types/faq/FaqOptionsModel'
import { useLanguage } from '../../../../context_provider/app_settings'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

interface SelectFaqProps {
  selectedFaq: FaqTitleOptionsModel | undefined
  setSelectedFaq: React.Dispatch<React.SetStateAction<FaqTitleOptionsModel | undefined>>
}

const SelectFaq = ({selectedFaq, setSelectedFaq}: SelectFaqProps): JSX.Element => {

    const language = useLanguage().current

    const [faqOptions, setFaqOptions] = useState([] as FaqTitleOptionsModel[])
    const [open, setOpen] = useState(false)
    const loading = open && faqOptions.length === 0;

    const [value, setValue] = React.useState<FaqTitleOptionsModel | null>(selectedFaq || null);
    const [inputValue, setInputValue] = React.useState(selectedFaq ? selectedFaq.title : '');

    const handleChange = (newValue: FaqTitleOptionsModel | null) => {
      if(newValue)
        setSelectedFaq(newValue)
    }

    useEffect(() => {

      let active = true;

      if (!loading) {
        return undefined;
      }

      const getFaqOptions = async () => {
      if(open) {
        const optionsItems = await FaqService.getFaqOptions() as FaqTitleOptionsModel[]
        if(optionsItems.length > 0)
          setFaqOptions(optionsItems)
      }
    }
      getFaqOptions()

      return () => {
        active = false;
      };
    }, [loading])

    useEffect(() => {
      if (!open) {
        setFaqOptions([] as FaqTitleOptionsModel[]);
      }
    }, [open]);

    useEffect(() => {
      if (value !== null) {
        setSelectedFaq(value)
      }
    }, [value]);

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
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        value={value}
        onChange={(event: any, newValue: FaqTitleOptionsModel | null) => {
          setValue(newValue);
        }}
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