import React from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import SelectFontSizeProps from './props'
import { useUserSettings } from '../../../../context/provider/user_settings/index'

const SelectFontSize = ({ fontSize, setFontSize }: SelectFontSizeProps) => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)
  const fontSizeList = userSettings.service.getFontSizeOptions(language)

  const handleSelectedFontSizeChanged = (event: any) => {
    if (event && event.target && event.target.value) {
      setFontSize(event.target.value as number)
    }
  }

  return (
    <div className="font-size__selector">
      <InputLabel shrink id="font-size--select-label">
        {language.FONT_SIZE_SELECTION_TITLE}
      </InputLabel>
      <Select
        labelId="font-size--select-label"
        id="font-size--select"
        value={fontSize}
        onChange={handleSelectedFontSizeChanged}
        fullWidth
      >
        {fontSizeList.map((option, index) => (
          <MenuItem key={index} value={option.code}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}

export default SelectFontSize
