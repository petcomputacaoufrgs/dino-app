import { useState } from 'react'
import LanguageBase from '../../../types/languages/LanguageBase'
import LanguageContextType, {
  Language,
} from '../../../types/context_provider/LanguageContextType'
import LanguageCodeConstants from '../../../constants/LanguageCodeConstants'
import AppSettingsService from '../../../services/app_settings/AppSettingsService'

const LanguageContextProvider = (): LanguageContextType => {
  const setHTMLLanguage = (language: LanguageBase) => {
    const html = document.getElementById('html')

    if (html) {
      html.lang = language.ISO_LANGUAGE_CODE
    }
  }

  const [currentLanguage, setCurrentLanguage] = useState(
    AppSettingsService.getLanguageBase()
  )

  setHTMLLanguage(currentLanguage)

  const updateLanguage = (): LanguageBase => {
    const language = AppSettingsService.getLanguageBase()

    setHTMLLanguage(language)

    setCurrentLanguage(language)

    return language
  }

  const getLanguages = (): Language[] => {
    const language = AppSettingsService.getLanguageBase()

    return [
      {
        code: LanguageCodeConstants.PORTUGUESE,
        name: language.LANGUAGE_PORTUGUESE,
      } as Language,
      {
        code: LanguageCodeConstants.ENGLISH,
        name: language.LANGUAGE_ENGLISH,
      } as Language,
    ]
  }

  const value: LanguageContextType = {
    current: currentLanguage,
    getLanguages: getLanguages,
    updateLanguage: updateLanguage,
  }

  return value
}

export default LanguageContextProvider
