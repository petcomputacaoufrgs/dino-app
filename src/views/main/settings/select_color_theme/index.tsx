import React from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import SelectColorThemeProps from './props'
import { useUserSettings } from '../../../../context/provider/user_settings'

const SelectColorTheme = ({ colorTheme, setColorTheme }: SelectColorThemeProps) => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)

  const colorThemeList = userSettings.service.getColorThemeOptions(language)

  const handleSelectedColorThemeChanged = (event: any) => {
    if (event && event.target && event.target.value) {
      setColorTheme(event.target.value as number)
    }
  }

  return (
    <div className="select-color-theme">
      <InputLabel shrink id="color-theme--select-label">
        {language.COLOR_THEME_SELECTION_TITLE}
      </InputLabel>
      <Select
        labelId="color-theme--select-label"
        id="color-theme--select"
        value={colorTheme}
        onChange={handleSelectedColorThemeChanged}
        fullWidth
      >
        {colorThemeList.map((option, index) => (
          <MenuItem key={index} value={option.code}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}

export default SelectColorTheme