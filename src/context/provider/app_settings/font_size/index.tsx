import { useState } from 'react'
import AppSettingsService from '../../../../services/app_settings/AppSettingsService'
import FontSizeContextType, { FontSizeOption } from '../../../../types/context_provider/FontSizeContextType'
import FontSizeEnum from '../../../../types/app_settings/FontSizeEnum'

const FontSizeContextProvider = (): FontSizeContextType => {
  const [currentFontSize, setCurrentFontSize] = useState(
    AppSettingsService.getFontSize()
  )

  const updateFontSize = (): void => {
    const fontSize = AppSettingsService.getFontSize()

    setCurrentFontSize(fontSize)
  }

  const getFontSizeOptions = (): FontSizeOption[] => {
    const language = AppSettingsService.getLanguageBase()

    return [
      {
        code: FontSizeEnum.DEFAULT,
        name: language.DEFAULT_FONT_SIZE_NAME,
      },
      {
        code: FontSizeEnum.LARGE,
        name: language.LARGE_FONT_SIZE_NAME,
      },
      {
        code: FontSizeEnum.LARGER,
        name: language.LARGER_FONT_SIZE_NAME,
      },
    ]
  }

  const value: FontSizeContextType = {
    currentCode: currentFontSize,
    currentName: AppSettingsService.getFontSizeName(currentFontSize),
    updateFontSize: updateFontSize,
    getFontSizeOptions: getFontSizeOptions,
  }

  return value
}

export default FontSizeContextProvider
