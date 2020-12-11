import React from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import { useAppSettings } from '../../../../context/provider/app_settings/'
import SelectLanguageProps from './props'

const SelectLanguage = ({ language, setLanguage }: SelectLanguageProps) => {

  const appSettings = useAppSettings()
  const languageList = appSettings.language.getLanguages()

  const handleSelectedLanguageChanged = (event: any) => {
    if (event && event.target && event.target.value) {
      setLanguage(event.target.value as string)
    }
  }

  return (
    <>
      <InputLabel shrink id="language-select-label">
        {appSettings.language.current.SETTINGS_LANGUAGE}
      </InputLabel>
      <Select
        labelId="language-select-label"
        id="language-select"
        value={language}
        onChange={handleSelectedLanguageChanged}
        fullWidth
      >
        {languageList.map((language, index) => (
          <MenuItem key={index} value={language.code}>
            {language.name}
          </MenuItem>
        ))}
      </Select>
    </>
  )
}

export default SelectLanguage