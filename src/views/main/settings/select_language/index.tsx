import React from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import SelectLanguageProps from './props'
import { useUserSettings } from '../../../../context/provider/user_settings'

const SelectLanguage = ({ languageName, setLanguage }: SelectLanguageProps) => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)
  const languageList = userSettings.service.getLanguages(language)

  const handleSelectedLanguageChanged = (event: any) => {
    if (event && event.target && event.target.value) {
      setLanguage(event.target.value as string)
    }
  }

  return (
    <>
      <InputLabel shrink id="language-select-label">
        {language.SETTINGS_LANGUAGE}
      </InputLabel>
      <Select
        labelId="language-select-label"
        id="language-select"
        value={languageName}
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