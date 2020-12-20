import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import SelectTreatmentProps from './props'
import { useUserSettings } from '../../../../context/provider/user_settings'
import TreatmentEntity from '../../../../types/treatment/database/TreatmentEntity'
import './styles.css'


const SelectTreatment: React.FC<SelectTreatmentProps> = ({
  children,
  availableTreatments,
  setTreatment,
  treatment
}) => {

  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(treatment ? treatment.name : language.SELECT_TREATMENT)

  return (
    <>
      <Autocomplete
        className="select-treatment__autocomplete"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        getOptionSelected={(option, value) => option === value}
        getOptionLabel={(treatment) => treatment.name || ''}
        options={availableTreatments}
        noOptionsText={language.NO_TREATMENTS_AVAILABLE}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        value={treatment}
        onChange={(event: any, newValue: TreatmentEntity | null) => {
          if (newValue) {
            setTreatment(newValue)
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={language.SETTINGS_TREATMENT}
            variant="standard"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      
      { children ? 
      <div className='select-treatment__children'>
        {children}
      </div> : <></>}
    </>
  )
}

export default SelectTreatment
