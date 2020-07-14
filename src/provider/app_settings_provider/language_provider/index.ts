import { useState } from 'react'
import LanguageBase from '../../../types/languages/LanguageBase'
import EN_US from '../../../types/languages/EN_US'
import PT_BR from '../../../types/languages/PT_BR'
import LanguageProviderValue, { Language } from './value'
import LanguageCodeConstants from '../../../constants/LanguageCodeConstants'
import AppSettingsService from '../../../services/app_settings/AppSettingsService'

const AppSettingsProvider = (): LanguageProviderValue => {
  const getLanguageSetByCode = (languageCode: string): LanguageBase => {
    if (languageCode === LanguageCodeConstants.PORTUGUESE) {
      return new PT_BR()
    } else {
      return new EN_US()
    }
  }

  const getLanguageSet = (): LanguageBase => {
    const language = AppSettingsService.get().language

    return getLanguageSetByCode(language)
  }

  const setHTMLLanguage = (language: LanguageBase) => {
    const html = document.getElementById('html')

    if (html) {
      html.lang = language.ISO_LANGUAGE_CODE
    }
  }

  const [currentLanguage, setCurrentLanguage] = useState(getLanguageSet())

  setHTMLLanguage(currentLanguage)

  const updateCurrentLanguage = (): LanguageBase => {
    const language = getLanguageSet()

    setHTMLLanguage(language)

    setCurrentLanguage(language)

    return language
  }

  const getLanguages = (): Language[] => {
    const language = getLanguageSet()

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

  const value: LanguageProviderValue = {
    current: currentLanguage,
    getLanguages: getLanguages,
    updateLanguage: updateCurrentLanguage,
  }

  return value
}

export default AppSettingsProvider
