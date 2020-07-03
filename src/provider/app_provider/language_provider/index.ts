import { useState } from 'react'
import LanguageBase from './languages/LanguageBase'
import EN_US from './languages/EN_US'
import PT_BR from './languages/PT_BR'
import LanguageProviderValue, { Language } from './value'
import LanguageCodeConstants from '../../../constants/LanguageCodeConstants'
import AppSettingsService from '../../../services/app_settings/AppSettingsService'

const LanguageProvider = (): LanguageProviderValue => {
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

  const setHTMLElementLanguage = (language: LanguageBase) => {
    const html = document.getElementById('html')

    if (html) {
      html.lang = language.ISO_LANGUAGE_CODE
    }
  }

  const [currentLanguage, setCurrentLanguage] = useState(getLanguageSet())

  setHTMLElementLanguage(currentLanguage)

  const updateCurrentLanguage = (): LanguageBase => {
    const language = getLanguageSet()

    setHTMLElementLanguage(language)

    setCurrentLanguage(language)

    return language
  }

  const getLanguageList = (): Language[] => {
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
    getLanguageList: getLanguageList,
    updateLanguage: updateCurrentLanguage,
  }

  return value
}

export default LanguageProvider
