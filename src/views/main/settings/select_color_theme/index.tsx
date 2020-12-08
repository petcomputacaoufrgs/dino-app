import React from 'react'
import './styles.css'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import { useAppSettings } from '../../../../context/provider/app_settings/'


const SelectColorTheme = ({colorTheme, setColorTheme}) => {

  const appSettings = useAppSettings()
  const colorThemeList = appSettings.colorTheme.getColorThemeOptions()
  const language = appSettings.language.current

  const handleSelectedColorThemeChanged = (event: any) => {
    if (event && event.target && event.target.value) {
      setColorTheme(event.target.value as number)
    }
  }

  return (
    <>
      <InputLabel id="color-theme--select-label">
        {language.COLOR_THEME_SELECTION_TITLE}
      </InputLabel>
      <Select
        labelId="color-theme--select-label"
        id="color-theme--select"
        value={colorTheme}
        onChange={handleSelectedColorThemeChanged}
      >
        {colorThemeList.map((option, index) => (
          <MenuItem key={index} value={option.code}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </>
  )
}

export default SelectColorTheme